import json

from django.http import JsonResponse
from django.shortcuts import render

from .chatbot import get_chat_response

MAX_HISTORY = 20
MAX_CONTENT_LEN = 2000


def build_creator_context(user):
    from core.models import Formular

    formulare = Formular.objects.filter(creator=user).prefetch_related(
        'campuri__persoana',
        'turnatorii__raspunsuri__camp__persoana',
        'turnatorii__raspunsuri__sentiment',
        'turnatorii__sentiment',
    )
    if not formulare.exists():
        return ''

    lines = [
        f'## Datele contului tău pe Turnatoru\n',
        f'Ești logat ca: **{user.username}**\n',
    ]

    for formular in formulare:
        turnatorii = list(formular.turnatorii.all())
        lines.append(f'### Formular: "{formular.titlu}" — {len(turnatorii)} răspuns(uri) primite')

        campuri = list(formular.campuri.select_related('persoana').order_by('ordine'))
        if campuri:
            lines.append('Întrebări definite:')
            for camp in campuri:
                optiuni_str = f' (opțiuni: {camp.optiuni})' if camp.tip == 'optiuni' and camp.optiuni else ''
                lines.append(f'  - [Despre {camp.persoana.nume}] "{camp.intrebare}"{optiuni_str}')

        if turnatorii:
            lines.append('Răspunsuri primite (anonime):')
            for idx, t in enumerate(turnatorii, 1):
                data = t.creat_la.strftime('%d.%m.%Y %H:%M')
                try:
                    s = t.sentiment
                    sent_str = (
                        f' | Sentiment general: {s.sentiment}'
                        f' ({s.procent_pozitiv}% poz / {s.procent_neutru}% neu / {s.procent_negativ}% neg)'
                    )
                except Exception:
                    sent_str = ''
                lines.append(f'  Răspuns #{idx} ({data}){sent_str}:')
                for r in t.raspunsuri.select_related('camp__persoana', 'sentiment').order_by('camp__ordine'):
                    try:
                        r_sent = f' [{r.sentiment.sentiment}]'
                    except Exception:
                        r_sent = ''
                    valoare = r.valoare if r.valoare else '(gol)'
                    lines.append(
                        f'    - [Despre {r.camp.persoana.nume}]'
                        f' "{r.camp.intrebare}" → "{valoare}"{r_sent}'
                    )
        lines.append('')

    return '\n'.join(lines)


def build_turnator_context(token_cod):
    from core.models import TokenTurnator

    try:
        token = TokenTurnator.objects.select_related('formular').get(cod=token_cod)
    except TokenTurnator.DoesNotExist:
        return ''

    formular = token.formular
    campuri = formular.campuri.select_related('persoana').order_by('ordine')

    lines = [
        f'## Contextul formularului la care ai acces\n',
        f'Formular: "{formular.titlu}"',
        f'Mesaj introductiv: "{formular.mesaj}"\n',
        'Întrebări la care trebuie să răspunzi:',
    ]
    for camp in campuri:
        optiuni_str = f' (opțiuni posibile: {camp.optiuni})' if camp.tip == 'optiuni' and camp.optiuni else ''
        lines.append(f'  - [Despre {camp.persoana.nume}] "{camp.intrebare}"{optiuni_str}')

    return '\n'.join(lines)


def chatbot_view(request):
    if request.method != 'POST':
        return render(request, 'agents/chatbot.html')

    try:
        data = json.loads(request.body)
    except (json.JSONDecodeError, ValueError):
        return JsonResponse({'error': 'JSON invalid'}, status=400)

    raw_messages = data.get('messages', [])
    if not isinstance(raw_messages, list):
        return JsonResponse({'error': 'Format invalid'}, status=400)

    valid = [
        {'role': m['role'], 'content': m['content'][:MAX_CONTENT_LEN]}
        for m in raw_messages[-MAX_HISTORY:]
        if isinstance(m, dict)
        and m.get('role') in ('user', 'assistant')
        and isinstance(m.get('content'), str)
        and m['content'].strip()
    ]

    if not valid:
        return JsonResponse({'error': 'Niciun mesaj valid'}, status=400)

    if request.user.is_authenticated:
        context = build_creator_context(request.user)
    else:
        token_cod = request.session.get('current_token')
        context = build_turnator_context(token_cod) if token_cod else ''

    reply = get_chat_response(valid, is_creator=request.user.is_authenticated, context=context)
    return JsonResponse({'response': reply})
