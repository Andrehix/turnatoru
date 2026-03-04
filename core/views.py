import json
from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.http import HttpResponse
from .models import Formular, TokenTurnator, Turnatorie, Persoana, CampFormular, RaspunsCamp


def home(request):
    if request.user.is_authenticated:
        return redirect('core:dashboard_creator')
    return render(request, 'core/home.html')


def register(request):
    if request.method == 'POST':
        username = request.POST.get('username', '').strip()
        email = request.POST.get('email', '').strip()
        password1 = request.POST.get('password1', '')
        password2 = request.POST.get('password2', '')

        if not username or not password1:
            messages.error(request, '🐀 Frate, pune măcar un username și o parolă. Nu-i greu.')
            return render(request, 'core/register.html')

        if password1 != password2:
            messages.error(request, '🤦 Parolele nu se potrivesc. Ai mâinile pe taste sau pe telefon?')
            return render(request, 'core/register.html')

        if len(password1) < 4:
            messages.error(request, '🔐 Parola aia e mai scurtă decât un haiku. Minim 4 caractere, te rog.')
            return render(request, 'core/register.html')

        if User.objects.filter(username=username).exists():
            messages.error(request, f'😤 Username-ul "{username}" e deja luat. Cineva a fost mai rapid ca tine.')
            return render(request, 'core/register.html')

        user = User.objects.create_user(username=username, email=email, password=password1)
        login(request, user)
        messages.success(request, f'🎉 Bine ai venit, {username}! Acum ești oficial un creator de turnătorii.')
        return redirect('core:dashboard_creator')

    return render(request, 'core/register.html')


def login_view(request):
    if request.method == 'POST':
        username = request.POST.get('username', '')
        password = request.POST.get('password', '')
        user = authenticate(request, username=username, password=password)

        if user is not None:
            login(request, user)
            messages.success(request, f'🐀 Salut, {user.username}! Pregătit să citești niște adevăruri dureroase?')
            return redirect('core:dashboard_creator')
        else:
            messages.error(request, '🚫 Username sau parolă greșită. Încearcă din nou sau dă-i cu "am uitat parola" (glumesc, n-avem asta).')
            return redirect('core:home')

    return redirect('core:home')


def logout_view(request):
    logout(request)
    messages.success(request, '👋 Te-ai delogat. Turnătoriile tale rămân în siguranță. Sau nu. Cine știe.')
    return redirect('core:home')


@login_required(login_url='/')
def dashboard_creator(request):
    formulare = Formular.objects.filter(creator=request.user).order_by('-creat_la')
    formulare_data = []
    for f in formulare:
        formulare_data.append({
            'id': f.id,
            'titlu': f.titlu,
            'raspunsuri': f.turnatorii.count(),
            'tokeni_count': f.tokeni.count(),
            'creat_la': f.creat_la,
        })
    return render(request, 'core/dashboard_creator.html', {'formulare': formulare_data})


@login_required(login_url='/')
def persoane_view(request):
    persoane = Persoana.objects.filter(creator=request.user).order_by('nume')
    if request.method == 'POST':
        action = request.POST.get('action', '')
        if action == 'add':
            nume = request.POST.get('nume', '').strip()
            if not nume:
                messages.error(request, '🐀 Pune un nume, nu lăsa câmpul gol ca sufletul tău.')
            elif Persoana.objects.filter(creator=request.user, nume=nume).exists():
                messages.error(request, f'😤 "{nume}" există deja în lista ta. Nu duplica oamenii.')
            else:
                Persoana.objects.create(nume=nume, creator=request.user)
                messages.success(request, f'✅ "{nume}" a fost adăugat în lista ta de subiecți!')
        elif action == 'delete':
            persoana_id = request.POST.get('persoana_id')
            persoana = get_object_or_404(Persoana, id=persoana_id, creator=request.user)
            persoana.delete()
            messages.success(request, '🗑️ Persoana a fost ștearsă. Ca și cum n-ar fi existat.')
        return redirect('core:persoane')
    return render(request, 'core/persoane.html', {'persoane': persoane})


@login_required(login_url='/')
def crear_formular(request):
    if request.method == 'POST':
        titlu = request.POST.get('titlu', '').strip()
        mesaj = request.POST.get('mesaj', '').strip()

        if not titlu:
            messages.error(request, '📝 Titlu gol? Serios? Până și șobolanii noștri au standarde.')
            return redirect('core:crear_formular')

        if not mesaj:
            mesaj = 'Spune-ne ce crezi, fără frică. Sau cu frică, dar scrie oricum. 🐀'

        campuri_json = request.POST.get('campuri_json', '[]')
        try:
            campuri_data = json.loads(campuri_json)
        except json.JSONDecodeError:
            campuri_data = []

        if not campuri_data:
            messages.error(request, '🐀 Adaugă măcar o întrebare. Un formular gol e ca o pizza fără blat.')
            return redirect('core:crear_formular')

        formular = Formular.objects.create(titlu=titlu, mesaj=mesaj, creator=request.user)

        for idx, camp in enumerate(campuri_data):
            persoana_id = camp.get('persoana_id')
            tip = camp.get('tip', 'text')
            intrebare = camp.get('intrebare', '').strip()
            optiuni = camp.get('optiuni', '').strip()

            if not intrebare or not persoana_id:
                continue

            try:
                persoana = Persoana.objects.get(id=persoana_id, creator=request.user)
            except Persoana.DoesNotExist:
                continue

            CampFormular.objects.create(
                formular=formular,
                persoana=persoana,
                tip=tip,
                intrebare=intrebare,
                optiuni=optiuni if tip == 'optiuni' else '',
                ordine=idx,
            )

        messages.success(request, f'✅ Formularul "{titlu}" a fost creat cu {formular.campuri.count()} întrebări! Acum generează niște tokeni.')
        return redirect('core:dashboard_creator')

    persoane = Persoana.objects.filter(creator=request.user).order_by('nume')
    return render(request, 'core/crear_formular.html', {'persoane': persoane})


@login_required(login_url='/')
def genereaza_tokeni(request, formular_id):
    formular = get_object_or_404(Formular, id=formular_id, creator=request.user)

    if request.method == 'POST':
        try:
            numar = int(request.POST.get('numar_tokeni', 5))
        except (ValueError, TypeError):
            numar = 5
        numar = min(max(numar, 1), 50)

        for _ in range(numar):
            t = TokenTurnator(formular=formular)
            t.save()

        messages.success(request, f'🎫 Am generat {numar} tokeni proaspeți! Dă-i la oameni și așteaptă verdictul.')
        return redirect('core:formular_reviews', formular_id=formular.id)

    return redirect('core:formular_reviews', formular_id=formular.id)


@login_required(login_url='/')
def dashboard_creator_formular(request, formular_id):
    formular = get_object_or_404(Formular, id=formular_id, creator=request.user)
    reviews = formular.turnatorii.all().order_by('-creat_la')
    tokeni = formular.tokeni.all().order_by('-creat_la')
    campuri = formular.campuri.all().order_by('ordine')

    reviews_data = []
    for r in reviews:
        raspunsuri = r.raspunsuri.select_related('camp', 'camp__persoana').order_by('camp__ordine')
        reviews_data.append({
            'turnatorie': r,
            'raspunsuri': raspunsuri,
        })

    return render(request, 'core/formular_reviews.html', {
        'reviews': reviews_data,
        'formular': formular,
        'tokeni': tokeni,
        'campuri': campuri,
    })


def token_login(request):
    if request.method == 'POST':
        cod = request.POST.get('token', '').strip().upper()

        if not cod:
            messages.error(request, '🤨 Ai trimis un token gol. Nici măcar n-ai încercat.')
            return render(request, 'core/token_login.html')

        try:
            token = TokenTurnator.objects.get(cod=cod)
        except TokenTurnator.DoesNotExist:
            messages.error(request, '❌ Tokenul ăsta nu există. L-ai inventat? Sau ai scris cu piciorul?')
            return render(request, 'core/token_login.html')

        if token.folosit:
            tokeni_ramasi = TokenTurnator.objects.filter(
                formular=token.formular, folosit=False
            ).order_by('creat_la')
            return render(request, 'core/token_expirat.html', {
                'formular': token.formular,
                'tokeni_ramasi': tokeni_ramasi,
            })

        return redirect('core:token_formular', token=token.cod)

    return render(request, 'core/token_login.html')


def token_formular(request, token):
    token_obj = get_object_or_404(TokenTurnator, cod=token)
    formular = token_obj.formular

    if token_obj.folosit:
        tokeni_ramasi = TokenTurnator.objects.filter(
            formular=formular, folosit=False
        ).order_by('creat_la')
        return render(request, 'core/token_expirat.html', {
            'formular': formular,
            'tokeni_ramasi': tokeni_ramasi,
        })

    campuri = formular.campuri.all().order_by('ordine')

    if request.method == 'POST':
        turnatorie = Turnatorie.objects.create(formular=formular)

        for camp in campuri:
            valoare = request.POST.get(f'camp_{camp.id}', '').strip()
            RaspunsCamp.objects.create(
                turnatorie=turnatorie,
                camp=camp,
                valoare=valoare,
            )

        token_obj.folosit = True
        token_obj.save()
        messages.success(request, '🎉 Turnătoria ta a fost salvată! Mulțumim că ai avut curajul (sau nesimțirea) să fii sincer.')
        return render(request, 'core/token_succes.html', {'formular': formular})

    persoane_campuri = {}
    for camp in campuri:
        if camp.persoana not in persoane_campuri:
            persoane_campuri[camp.persoana] = []
        persoane_campuri[camp.persoana].append(camp)

    return render(request, 'core/token_formular.html', {
        'formular': formular,
        'token': token,
        'persoane_campuri': persoane_campuri,
    })


@login_required(login_url='/')
def dashboard_admin(request):
    if not request.user.is_staff:
        messages.error(request, '🚫 Nu ești admin. Frumoasă încercare, dar nu merge.')
        return redirect('core:home')

    formulare = Formular.objects.all().order_by('-creat_la')
    tokeni_total = TokenTurnator.objects.count()
    turnatorii_total = Turnatorie.objects.count()

    return render(request, 'core/dashboard_admin.html', {
        'formulare': formulare,
        'tokeni_total': tokeni_total,
        'turnatorii_total': turnatorii_total,
    })


@login_required(login_url='/')
def export_pdf(request, formular_id):
    from reportlab.lib.pagesizes import A4
    from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
    from reportlab.lib.units import cm
    from reportlab.lib.colors import HexColor
    from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
    from reportlab.lib import colors
    from io import BytesIO

    formular = get_object_or_404(Formular, id=formular_id, creator=request.user)
    campuri = formular.campuri.select_related('persoana').order_by('ordine')
    turnatorii = formular.turnatorii.all().order_by('creat_la')

    buffer = BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=A4, topMargin=2*cm, bottomMargin=2*cm)
    styles = getSampleStyleSheet()

    title_style = ParagraphStyle(
        'CustomTitle', parent=styles['Title'],
        fontSize=22, textColor=HexColor('#e94560'),
        spaceAfter=10,
    )
    subtitle_style = ParagraphStyle(
        'CustomSubtitle', parent=styles['Normal'],
        fontSize=12, textColor=HexColor('#888888'),
        spaceAfter=20,
    )
    heading_style = ParagraphStyle(
        'CustomHeading', parent=styles['Heading2'],
        fontSize=14, textColor=HexColor('#e94560'),
        spaceAfter=8, spaceBefore=16,
    )
    normal_style = ParagraphStyle(
        'CustomNormal', parent=styles['Normal'],
        fontSize=10, textColor=HexColor('#333333'),
        spaceAfter=4,
    )

    elements = []
    elements.append(Paragraph('Raport de Sinceritate Bruta', title_style))
    elements.append(Paragraph(f'Formular: {formular.titlu}', subtitle_style))
    elements.append(Paragraph(f'Creator: {formular.creator.username} | Data: {formular.creat_la.strftime("%d.%m.%Y %H:%M")}', subtitle_style))
    elements.append(Spacer(1, 0.5*cm))

    persoane_dict = {}
    for camp in campuri:
        if camp.persoana.id not in persoane_dict:
            persoane_dict[camp.persoana.id] = {
                'persoana': camp.persoana,
                'campuri': [],
            }
        persoane_dict[camp.persoana.id]['campuri'].append(camp)

    for pers_id, pers_data in persoane_dict.items():
        persoana = pers_data['persoana']
        elements.append(Paragraph(f'Persoana: {persoana.nume}', heading_style))

        for camp in pers_data['campuri']:
            tip_label = 'Text Liber' if camp.tip == 'text' else 'Alegere Multipla'
            elements.append(Paragraph(f'Intrebare ({tip_label}): {camp.intrebare}', normal_style))

            if camp.tip == 'optiuni' and camp.optiuni:
                elements.append(Paragraph(f'  Optiuni: {camp.optiuni}', normal_style))

            raspunsuri = RaspunsCamp.objects.filter(camp=camp).select_related('turnatorie')
            if raspunsuri.exists():
                table_data = [['#', 'Raspuns', 'Data']]
                for idx, r in enumerate(raspunsuri, 1):
                    val = r.valoare if r.valoare else '(gol)'
                    data = r.turnatorie.creat_la.strftime('%d.%m.%Y %H:%M')
                    table_data.append([str(idx), val, data])

                t = Table(table_data, colWidths=[1*cm, 12*cm, 3.5*cm])
                t.setStyle(TableStyle([
                    ('BACKGROUND', (0, 0), (-1, 0), HexColor('#e94560')),
                    ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
                    ('FONTSIZE', (0, 0), (-1, -1), 9),
                    ('GRID', (0, 0), (-1, -1), 0.5, HexColor('#cccccc')),
                    ('ROWBACKGROUNDS', (0, 1), (-1, -1), [HexColor('#f9f9f9'), colors.white]),
                    ('VALIGN', (0, 0), (-1, -1), 'TOP'),
                ]))
                elements.append(Spacer(1, 0.2*cm))
                elements.append(t)
            else:
                elements.append(Paragraph('  Niciun raspuns inca.', normal_style))

            elements.append(Spacer(1, 0.3*cm))

    if not persoane_dict:
        elements.append(Paragraph('Niciun camp definit in acest formular.', normal_style))

    doc.build(elements)
    buffer.seek(0)

    response = HttpResponse(buffer, content_type='application/pdf')
    response['Content-Disposition'] = f'attachment; filename="raport_{formular.titlu}.pdf"'
    return response
