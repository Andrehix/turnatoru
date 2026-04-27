from unittest.mock import MagicMock, patch

from django.test import TestCase

from agents.sentiment import analyze_sentiment


class TestAnalyzeSentiment(TestCase):

    def test_empty_text_returns_neutru(self):
        self.assertEqual(analyze_sentiment(''), 'neutru')

    def test_whitespace_only_returns_neutru(self):
        self.assertEqual(analyze_sentiment('   '), 'neutru')

    def test_no_api_key_returns_neutru(self):
        with patch.dict('os.environ', {}, clear=True):
            result = analyze_sentiment('Omul acesta este fantastic!')
        self.assertEqual(result, 'neutru')

    @patch('agents.sentiment.anthropic')
    def test_api_returns_pozitiv(self, mock_anthropic):
        client = MagicMock()
        mock_anthropic.Anthropic.return_value = client
        client.messages.create.return_value.content = [MagicMock(text='pozitiv')]

        with patch.dict('os.environ', {'ANTHROPIC_API_KEY': 'test-key'}):
            result = analyze_sentiment('Colegul meu este un exemplu excelent pentru toată echipa!')

        self.assertEqual(result, 'pozitiv')

    @patch('agents.sentiment.anthropic')
    def test_api_returns_negativ(self, mock_anthropic):
        client = MagicMock()
        mock_anthropic.Anthropic.return_value = client
        client.messages.create.return_value.content = [MagicMock(text='negativ')]

        with patch.dict('os.environ', {'ANTHROPIC_API_KEY': 'test-key'}):
            result = analyze_sentiment('Nu respectă termenele și nu comunică deloc.')

        self.assertEqual(result, 'negativ')

    @patch('agents.sentiment.anthropic')
    def test_api_returns_neutru(self, mock_anthropic):
        client = MagicMock()
        mock_anthropic.Anthropic.return_value = client
        client.messages.create.return_value.content = [MagicMock(text='neutru')]

        with patch.dict('os.environ', {'ANTHROPIC_API_KEY': 'test-key'}):
            result = analyze_sentiment('Persoana face munca ei, nici mai mult nici mai puțin.')

        self.assertEqual(result, 'neutru')

    @patch('agents.sentiment.anthropic')
    def test_api_error_falls_back_to_neutru(self, mock_anthropic):
        client = MagicMock()
        mock_anthropic.Anthropic.return_value = client
        client.messages.create.side_effect = Exception('Simulated API failure')

        with patch.dict('os.environ', {'ANTHROPIC_API_KEY': 'test-key'}):
            result = analyze_sentiment('Test feedback')

        self.assertEqual(result, 'neutru')

    @patch('agents.sentiment.anthropic')
    def test_unrecognized_response_falls_back_to_neutru(self, mock_anthropic):
        client = MagicMock()
        mock_anthropic.Anthropic.return_value = client
        client.messages.create.return_value.content = [MagicMock(text='banana')]

        with patch.dict('os.environ', {'ANTHROPIC_API_KEY': 'test-key'}):
            result = analyze_sentiment('Test feedback')

        self.assertEqual(result, 'neutru')

    @patch('agents.sentiment.anthropic')
    def test_partial_match_in_response(self, mock_anthropic):
        client = MagicMock()
        mock_anthropic.Anthropic.return_value = client
        client.messages.create.return_value.content = [MagicMock(text='Sentimentul este pozitiv.')]

        with patch.dict('os.environ', {'ANTHROPIC_API_KEY': 'test-key'}):
            result = analyze_sentiment('Feedback bun!')

        self.assertEqual(result, 'pozitiv')
