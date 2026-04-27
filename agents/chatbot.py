import os

try:
    import anthropic
except ImportError:
    anthropic = None

SYSTEM_PROMPT = (
    'Ești un asistent AI integrat în Turnatoru — o platformă românească de feedback anonim.\n'
    'Rolul tău este să ajuți utilizatorii să:\n'
    '1. Formuleze feedback constructiv și clar\n'
    '2. Identifice punctele cheie pe care vor să le transmită\n'
    '3. Exprime criticile sau laudele într-un mod profesionist\n'
    '4. Înțeleagă mai bine răspunsurile primite\n\n'
    'Reguli:\n'
    '- Răspunde ÎNTOTDEAUNA în română\n'
    '- Fii concis și practic\n'
    '- Nu dezvălui identitatea nimănui și nu încuraja comportamente rău-intenționate\n'
    '- Dacă ți se cer date private despre alți utilizatori, refuză politicos'
)


def get_chat_response(messages: list[dict]) -> str:
    """Send conversation history to Claude and return the assistant reply.

    Falls back to a friendly error message when the API is unavailable.
    """
    api_key = os.environ.get('ANTHROPIC_API_KEY')
    if not api_key or anthropic is None:
        return (
            'Agentul AI nu este disponibil momentan. '
            'Administratorul trebuie să configureze ANTHROPIC_API_KEY.'
        )

    try:
        client = anthropic.Anthropic(api_key=api_key)
        response = client.messages.create(
            model='claude-sonnet-4-20250514',
            max_tokens=1024,
            system=SYSTEM_PROMPT,
            messages=messages,
        )
        return response.content[0].text
    except Exception:
        return 'Agentul AI nu este disponibil momentan. Încearcă din nou mai târziu.'
