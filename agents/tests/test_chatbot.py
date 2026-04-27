import json
from unittest.mock import MagicMock, patch

from django.test import Client, TestCase
from django.urls import reverse

from agents.chatbot import get_chat_response


class TestGetChatResponse(TestCase):

    def test_no_api_key_returns_fallback(self):
        with patch.dict('os.environ', {}, clear=True):
            result = get_chat_response([{'role': 'user', 'content': 'Salut!'}])
        self.assertIn('disponibil', result.lower())

    @patch('agents.chatbot.anthropic')
    def test_successful_response(self, mock_anthropic):
        client = MagicMock()
        mock_anthropic.Anthropic.return_value = client
        client.messages.create.return_value.content = [MagicMock(text='Bună ziua! Cu ce te pot ajuta?')]

        with patch.dict('os.environ', {'ANTHROPIC_API_KEY': 'test-key'}):
            result = get_chat_response([{'role': 'user', 'content': 'Salut!'}])

        self.assertEqual(result, 'Bună ziua! Cu ce te pot ajuta?')

    @patch('agents.chatbot.anthropic')
    def test_api_error_returns_fallback(self, mock_anthropic):
        client = MagicMock()
        mock_anthropic.Anthropic.return_value = client
        client.messages.create.side_effect = Exception('API down')

        with patch.dict('os.environ', {'ANTHROPIC_API_KEY': 'test-key'}):
            result = get_chat_response([{'role': 'user', 'content': 'Salut!'}])

        self.assertIn('disponibil', result.lower())

    @patch('agents.chatbot.anthropic')
    def test_system_prompt_is_passed(self, mock_anthropic):
        client = MagicMock()
        mock_anthropic.Anthropic.return_value = client
        client.messages.create.return_value.content = [MagicMock(text='ok')]

        messages = [{'role': 'user', 'content': 'Ajutor cu feedback-ul'}]
        with patch.dict('os.environ', {'ANTHROPIC_API_KEY': 'test-key'}):
            get_chat_response(messages)

        call_kwargs = client.messages.create.call_args.kwargs
        self.assertIn('system', call_kwargs)
        self.assertIn('Turnatoru', call_kwargs['system'])


class TestChatbotView(TestCase):

    def setUp(self):
        self.client = Client()
        self.url = reverse('agents:chatbot')

    def test_get_renders_chatbot_page(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, 'Asistent AI')

    def test_post_empty_messages_returns_400(self):
        response = self.client.post(
            self.url,
            data=json.dumps({'messages': []}),
            content_type='application/json',
        )
        self.assertEqual(response.status_code, 400)

    def test_post_invalid_json_returns_400(self):
        response = self.client.post(
            self.url,
            data='not-json',
            content_type='application/json',
        )
        self.assertEqual(response.status_code, 400)

    def test_post_invalid_role_returns_400(self):
        response = self.client.post(
            self.url,
            data=json.dumps({'messages': [{'role': 'hacker', 'content': 'boo'}]}),
            content_type='application/json',
        )
        self.assertEqual(response.status_code, 400)

    @patch('agents.views.get_chat_response')
    def test_post_valid_message_returns_response(self, mock_get):
        mock_get.return_value = 'Răspuns de test de la AI'
        response = self.client.post(
            self.url,
            data=json.dumps({'messages': [{'role': 'user', 'content': 'Salut AI!'}]}),
            content_type='application/json',
        )
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.content)
        self.assertEqual(data['response'], 'Răspuns de test de la AI')

    @patch('agents.views.get_chat_response')
    def test_history_is_trimmed_to_max(self, mock_get):
        mock_get.return_value = 'ok'
        long_history = [{'role': 'user', 'content': f'msg {i}'} for i in range(30)]
        response = self.client.post(
            self.url,
            data=json.dumps({'messages': long_history}),
            content_type='application/json',
        )
        self.assertEqual(response.status_code, 200)
        passed_messages = mock_get.call_args.args[0]
        self.assertLessEqual(len(passed_messages), 20)
