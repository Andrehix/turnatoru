import os

try:
    import anthropic
except ImportError:
    anthropic = None

SENTIMENT_CHOICES = ('pozitiv', 'neutru', 'negativ')


def analyze_sentiment(text: str) -> str:
    """Call Claude to classify text as pozitiv/neutru/negativ.

    Falls back to 'neutru' when the API is unavailable or misconfigured.
    """
    if not text or not text.strip():
        return 'neutru'

    api_key = os.environ.get('ANTHROPIC_API_KEY')
    if not api_key or anthropic is None:
        return 'neutru'

    try:
        client = anthropic.Anthropic(api_key=api_key)
        message = client.messages.create(
            model='claude-sonnet-4-6',
            max_tokens=10,
            messages=[{
                'role': 'user',
                'content': (
                    'Analizează sentimentul general al următorului feedback și răspunde '
                    'cu EXACT un singur cuvânt dintre: "pozitiv", "neutru", sau "negativ".\n\n'
                    f'Feedback:\n{text[:2000]}'
                ),
            }],
        )
        result = message.content[0].text.strip().lower()
        if result in SENTIMENT_CHOICES:
            return result
        for choice in SENTIMENT_CHOICES:
            if choice in result:
                return choice
        return 'neutru'
    except Exception:
        return 'neutru'


def analyze_turnatorie(turnatorie) -> str:
    from .models import SentimentResult, SentimentRaspuns

    raspunsuri = list(turnatorie.raspunsuri.all())
    sentimente = []

    for r in raspunsuri:
        if r.valoare and r.valoare.strip():
            s = analyze_sentiment(r.valoare)
        else:
            s = 'neutru'
        SentimentRaspuns.objects.update_or_create(raspuns=r, defaults={'sentiment': s})
        sentimente.append(s)

    if not sentimente:
        dominant = 'neutru'
        poz = neut = neg = 0
    else:
        total = len(sentimente)
        poz = round(sentimente.count('pozitiv') * 100 / total)
        neut = round(sentimente.count('neutru') * 100 / total)
        neg = 100 - poz - neut
        counts = {'pozitiv': poz, 'neutru': neut, 'negativ': neg}
        dominant = max(counts, key=counts.get)

    SentimentResult.objects.update_or_create(
        turnatorie=turnatorie,
        defaults={
            'sentiment': dominant,
            'procent_pozitiv': poz,
            'procent_neutru': neut,
            'procent_negativ': neg,
        },
    )
    return dominant
