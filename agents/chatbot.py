import os

try:
    import anthropic
except ImportError:
    anthropic = None

_BASE_RULES = (
    'Reguli:\n'
    '- Răspunde ÎNTOTDEAUNA în română\n'
    '- Fii concis și practic\n'
    '- Nu dezvălui identitatea nimănui și nu încuraja comportamente rău-intenționate\n'
    '- Dacă ți se cer date private despre alți utilizatori, refuză politicos'
)

SYSTEM_PROMPT_TURNATOR = (
    'Ești un asistent AI integrat în Turnatoru — o platformă românească de feedback anonim.\n'
    'Vorbești cu un TURNĂTOR — cineva care vrea să trimită feedback anonim despre colegi sau superiori.\n'
    'Rolul tău este să îl ajuți să:\n'
    '1. Formuleze feedback clar, constructiv și la obiect\n'
    '2. Exprime criticile sau laudele profesionist, fără să fie ofensator\n'
    '3. Identifice ce e cu adevărat important de transmis\n'
    '4. Se simtă în siguranță — feedback-ul e complet anonim\n\n'
    + _BASE_RULES
)

SYSTEM_PROMPT_CREATOR = (
    'Ești un asistent AI integrat în Turnatoru — o platformă românească de feedback anonim.\n'
    'Vorbești cu un CREATOR — cineva care a creat formulare de feedback și a primit răspunsuri anonime.\n'
    'Rolul tău este să îl ajuți să:\n'
    '1. Înțeleagă și interpreteze feedback-ul primit\n'
    '2. Identifice pattern-uri și teme comune în răspunsuri\n'
    '3. Formuleze un plan de acțiune bazat pe feedback\n'
    '4. Răspundă constructiv la critici, chiar și la cele dure\n\n'
    + _BASE_RULES
)

WELCOME_TURNATOR = (
    'Salut! Sunt asistentul AI al platformei Turnatoru. '
    'Te ajut să îți formulezi feedback-ul anonim cât mai clar și constructiv. '
    'Spune-mi — despre ce sau cine vrei să dai feedback?'
)

WELCOME_CREATOR = (
    'Salut! Sunt asistentul AI al platformei Turnatoru. '
    'Te ajut să înțelegi feedback-ul primit și să tragi concluzii utile din el. '
    'Poți să îmi descrii ce răspunsuri ai primit sau ce te nedumerește.'
)


def get_chat_response(messages: list[dict], is_creator: bool = False, context: str = '') -> str:
    api_key = os.environ.get('ANTHROPIC_API_KEY')
    if not api_key or anthropic is None:
        return (
            'Agentul AI nu este disponibil momentan. '
            'Administratorul trebuie să configureze ANTHROPIC_API_KEY.'
        )

    system = SYSTEM_PROMPT_CREATOR if is_creator else SYSTEM_PROMPT_TURNATOR
    if context:
        system += f'\n\n{context}'

    try:
        client = anthropic.Anthropic(api_key=api_key)
        response = client.messages.create(
            model='claude-sonnet-4-6',
            max_tokens=1024,
            system=system,
            messages=messages,
        )
        return response.content[0].text
    except Exception:
        return 'Agentul AI nu este disponibil momentan. Încearcă din nou mai târziu.'
