import os

SENTIMENT_CHOICES = ('pozitiv', 'neutru', 'negativ')


def analyze_sentiment(text: str) -> str:
    """Call Claude to classify text as pozitiv/neutru/negativ.

    Falls back to 'neutru' when the API is unavailable or misconfigured.
    """
    if not text or not text.strip():
        return 'neutru'

    api_key = os.environ.get('ANTHROPIC_API_KEY')
    if not api_key:
        return 'neutru'

    try:
        import anthropic

        client = anthropic.Anthropic(api_key=api_key)
        message = client.messages.create(
            model='claude-sonnet-4-20250514',
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
    """Analyze sentiment for a Turnatorie instance and persist the result.

    Safe to call even if the agents app models are not migrated yet.
    """
    from .models import SentimentResult

    raspunsuri = turnatorie.raspunsuri.all()
    texts = [r.valoare for r in raspunsuri if r.valoare and r.valoare.strip()]
    sentiment = analyze_sentiment('\n'.join(texts)) if texts else 'neutru'

    SentimentResult.objects.update_or_create(
        turnatorie=turnatorie,
        defaults={'sentiment': sentiment},
    )
    return sentiment
