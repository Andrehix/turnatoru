from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from .models import Formular, TokenTurnator, Turnatorie


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
def crear_formular(request):
    if request.method == 'POST':
        titlu = request.POST.get('titlu', '').strip()
        mesaj = request.POST.get('mesaj', '').strip()

        if not titlu:
            messages.error(request, '📝 Titlu gol? Serios? Până și șobolanii noștri au standarde.')
            return redirect('core:dashboard_creator')

        if not mesaj:
            mesaj = 'Spune-ne ce crezi, fără frică. Sau cu frică, dar scrie oricum. 🐀'

        Formular.objects.create(titlu=titlu, mesaj=mesaj, creator=request.user)
        messages.success(request, f'✅ Formularul "{titlu}" a fost creat! Acum generează niște tokeni și trimite-i la victi... la participanți.')
        return redirect('core:dashboard_creator')

    return redirect('core:dashboard_creator')


@login_required(login_url='/')
def genereaza_tokeni(request, formular_id):
    formular = get_object_or_404(Formular, id=formular_id, creator=request.user)

    if request.method == 'POST':
        try:
            numar = int(request.POST.get('numar_tokeni', 5))
        except (ValueError, TypeError):
            numar = 5
        numar = min(max(numar, 1), 50)

        tokeni_noi = []
        for _ in range(numar):
            t = TokenTurnator(formular=formular)
            t.save()
            tokeni_noi.append(t.cod)

        messages.success(request, f'🎫 Am generat {numar} tokeni proaspeți! Dă-i la oameni și așteaptă verdictul.')
        return redirect('core:formular_reviews', formular_id=formular.id)

    return redirect('core:formular_reviews', formular_id=formular.id)


@login_required(login_url='/')
def dashboard_creator_formular(request, formular_id):
    formular = get_object_or_404(Formular, id=formular_id, creator=request.user)
    reviews = formular.turnatorii.all().order_by('-creat_la')
    tokeni = formular.tokeni.all().order_by('-creat_la')
    return render(request, 'core/formular_reviews.html', {
        'reviews': reviews,
        'formular': formular,
        'tokeni': tokeni,
    })


def token_login(request):
    if request.method == 'POST':
        cod = request.POST.get('token', '').strip().upper()

        if not cod:
            messages.error(request, '🤨 Ai trimis un token gol. Nici măcar n-ai încercat.')
            return render(request, 'core/token_login.html')

        try:
            token = TokenTurnator.objects.get(cod=cod)
            return redirect('core:token_formular', token=token.cod)
        except TokenTurnator.DoesNotExist:
            messages.error(request, '❌ Tokenul ăsta nu există. L-ai inventat? Sau ai scris cu piciorul?')
            return render(request, 'core/token_login.html')

    return render(request, 'core/token_login.html')


def token_formular(request, token):
    token_obj = get_object_or_404(TokenTurnator, cod=token)
    formular = token_obj.formular

    if request.method == 'POST':
        text = request.POST.get('feedback', '').strip()

        if not text:
            messages.error(request, '🐀 Ai trimis un feedback gol. Până și tăcerea spune mai mult decât atât.')
            return render(request, 'core/token_formular.html', {'formular': formular, 'token': token})

        Turnatorie.objects.create(formular=formular, text=text)
        token_obj.folosit = True
        token_obj.save()
        messages.success(request, '🎉 Turnătoria ta a fost salvată! Mulțumim că ai avut curajul (sau nesimțirea) să fii sincer.')
        return render(request, 'core/token_succes.html', {'formular': formular})

    return render(request, 'core/token_formular.html', {'formular': formular, 'token': token})


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
