import json

from django.contrib.auth.models import User
from django.test import TestCase
from django.urls import reverse

from core.models import CampFormular, Formular, Persoana, RaspunsCamp, TokenTurnator, Turnatorie
from core.views import _escape_reportlab_text


class CoreFlowTests(TestCase):
	def setUp(self):
		self.user = User.objects.create_user(
			username='creator',
			email='creator@example.com',
			password='testpass123',
		)
		self.client.force_login(self.user)
		self.persoana_ana = Persoana.objects.create(nume='Ana Pop', creator=self.user)
		self.persoana_mihai = Persoana.objects.create(nume='Mihai Ionescu', creator=self.user)

	def create_formular(self):
		response = self.client.post(
			reverse('core:crear_formular'),
			data={
				'titlu': 'Feedback echipa',
				'mesaj': 'Spune ce crezi',
				'campuri_json': json.dumps([
					{
						'persoana_id': self.persoana_ana.id,
						'tip': 'text',
						'intrebare': 'Cum colaboreaza Ana?',
						'optiuni': '',
					},
					{
						'persoana_id': self.persoana_mihai.id,
						'tip': 'optiuni',
						'intrebare': 'Cum este Mihai la termene?',
						'optiuni': 'slab,ok,bun',
					},
				]),
			},
		)
		self.assertEqual(response.status_code, 302)
		return Formular.objects.get(titlu='Feedback echipa')

	def test_dynamic_questions_are_saved_on_form_creation(self):
		formular = self.create_formular()

		campuri = list(formular.campuri.order_by('ordine'))
		self.assertEqual(len(campuri), 2)
		self.assertEqual(CampFormular.objects.filter(formular=formular).count(), 2)
		self.assertEqual(campuri[0].persoana, self.persoana_ana)
		self.assertEqual(campuri[0].tip, 'text')
		self.assertEqual(campuri[0].intrebare, 'Cum colaboreaza Ana?')
		self.assertEqual(campuri[0].optiuni, '')
		self.assertEqual(campuri[1].persoana, self.persoana_mihai)
		self.assertEqual(campuri[1].tip, 'optiuni')
		self.assertEqual(campuri[1].optiuni, 'slab,ok,bun')

	def test_token_can_be_used_only_once(self):
		formular = self.create_formular()
		token = TokenTurnator.objects.create(formular=formular)
		campuri = list(formular.campuri.order_by('ordine'))
		url = reverse('core:token_formular', args=[token.cod])

		response = self.client.post(
			url,
			data={
				f'camp_{campuri[0].id}': 'Ana comunica bine',
				f'camp_{campuri[1].id}': 'bun',
			},
		)

		token.refresh_from_db()
		self.assertEqual(response.status_code, 200)
		self.assertTrue(token.folosit)
		self.assertEqual(Turnatorie.objects.count(), 1)
		self.assertEqual(RaspunsCamp.objects.count(), 2)

		second_response = self.client.post(
			url,
			data={
				f'camp_{campuri[0].id}': 'Ar trebui sa mai explice',
				f'camp_{campuri[1].id}': 'slab',
			},
		)

		self.assertEqual(second_response.status_code, 200)
		self.assertEqual(Turnatorie.objects.count(), 1)
		self.assertTemplateUsed(second_response, 'core/token_expirat.html')

	def test_feedback_submission_saves_answers_for_dynamic_fields(self):
		formular = self.create_formular()
		token = TokenTurnator.objects.create(formular=formular)
		campuri = list(formular.campuri.order_by('ordine'))

		response = self.client.post(
			reverse('core:token_formular', args=[token.cod]),
			data={
				f'camp_{campuri[0].id}': 'Clar si la obiect',
				f'camp_{campuri[1].id}': 'ok',
			},
		)

		self.assertEqual(response.status_code, 200)
		raspunsuri = list(RaspunsCamp.objects.filter(turnatorie__formular=formular).order_by('camp__ordine'))
		self.assertEqual([r.valoare for r in raspunsuri], ['Clar si la obiect', 'ok'])


class EscapeReportlabTextTests(TestCase):
	"""Regression tests for issue #6 — PDF export crashes on special characters."""

	def test_ampersand_is_escaped(self):
		self.assertEqual(_escape_reportlab_text('Ana & Popescu'), 'Ana &amp; Popescu')

	def test_angle_brackets_are_escaped(self):
		self.assertEqual(_escape_reportlab_text('Mihai <Test>'), 'Mihai &lt;Test&gt;')

	def test_none_returns_none(self):
		self.assertIsNone(_escape_reportlab_text(None))

	def test_empty_string_returns_empty(self):
		self.assertEqual(_escape_reportlab_text(''), '')

	def test_clean_text_unchanged(self):
		self.assertEqual(_escape_reportlab_text('Feedback normal'), 'Feedback normal')
