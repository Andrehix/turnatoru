import json

from django.http import JsonResponse
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt

from .chatbot import get_chat_response

MAX_HISTORY = 20
MAX_CONTENT_LEN = 2000


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

    reply = get_chat_response(valid, is_creator=request.user.is_authenticated)
    return JsonResponse({'response': reply})
