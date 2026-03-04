import os
import django
import random

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'turnatoru.settings')
django.setup()

from django.contrib.auth.models import User
from core.models import Persoana, Formular, CampFormular, TokenTurnator, Turnatorie, RaspunsCamp

PERSOANE = [
    "Prof. Ionescu Gheorghe",
    "Prof. Popescu Maria",
    "Prof. Dumitrescu Andrei",
    "Sef. Vasile Constantin",
    "Sef. Elena Marin",
    "Coleg. Radu Florin",
    "Coleg. Ana Stanescu",
    "Prof. Mihai Popa",
    "Prof. Cristina Nedelcu",
    "Sef. Alexandru Toma",
    "Coleg. Ioana Barbu",
    "Prof. Bogdan Stefan",
    "Coleg. Mihaela Giurgea",
    "Prof. Tudor Nistor",
    "Sef. Carmen Vlad",
    "Coleg. Vlad Apostol",
    "Prof. Roxana Chiru",
    "Coleg. Stefan Enache",
    "Sef. Laura Dima",
    "Prof. Catalin Preda",
]

FORMULARE = [
    {
        "titlu": "Feedback cursuri semestrul 2",
        "mesaj": "Toarna tot ce ai pe suflet despre cursurile din semestrul 2. Suntem curiosi, promitem sa nu plangem (mult).",
        "campuri": [
            {"persoana_idx": 0, "tip": "optiuni", "intrebare": "Cum evaluezi claritatea explicatiilor?", "optiuni": "Excelent, Bun, Mediocru, Dezastruos"},
            {"persoana_idx": 0, "tip": "text", "intrebare": "Ce ar trebui sa schimbe la curs?", "optiuni": ""},
            {"persoana_idx": 1, "tip": "optiuni", "intrebare": "Materialele de curs sunt utile?", "optiuni": "Foarte utile, Utile, Inutile, Le-am folosit ca suport de somn"},
            {"persoana_idx": 1, "tip": "text", "intrebare": "Ce nota i-ai da in secret?", "optiuni": ""},
            {"persoana_idx": 2, "tip": "text", "intrebare": "Descrie in 3 cuvinte stilul de predare.", "optiuni": ""},
        ],
    },
    {
        "titlu": "Evaluare sedinle de luni dimineata",
        "mesaj": "Stim ca sedintele de luni sunt subiect sensibil. Asta nu inseamna ca nu vrem sa stim ce crezi.",
        "campuri": [
            {"persoana_idx": 3, "tip": "optiuni", "intrebare": "Cat de necesare sunt sedintele de luni?", "optiuni": "Extrem de necesare, Necesare, Inutile, Criminale"},
            {"persoana_idx": 3, "tip": "text", "intrebare": "Cel mai enervant lucru din sedinta?", "optiuni": ""},
            {"persoana_idx": 4, "tip": "optiuni", "intrebare": "Organizarea sedintei este?", "optiuni": "Perfecta, Acceptabila, Haos organizat, Haos pur"},
            {"persoana_idx": 4, "tip": "text", "intrebare": "Sugestie pentru urmatoarea sedinta:", "optiuni": ""},
        ],
    },
    {
        "titlu": "Teambuilding in ploaie - post-mortem",
        "mesaj": "Da, stim. A plouat. Dar cel putin a fost o experienta de neuitat, nu? Nu? Pai spune-ne.",
        "campuri": [
            {"persoana_idx": 5, "tip": "optiuni", "intrebare": "Cum a fost experienta de teambuilding?", "optiuni": "Minunata, Suportabila, O trauma, Nu am cuvinte"},
            {"persoana_idx": 5, "tip": "text", "intrebare": "Cel mai bun moment din teambuilding?", "optiuni": ""},
            {"persoana_idx": 6, "tip": "text", "intrebare": "Ce activitate ai elimina data viitoare?", "optiuni": ""},
            {"persoana_idx": 7, "tip": "optiuni", "intrebare": "Ai recomanda acest teambuilding unui dusman?", "optiuni": "Da, cu placere, Poate, Niciodata, Depinde de dusman"},
        ],
    },
    {
        "titlu": "Feedback proiect de grup semestrial",
        "mesaj": "Proiectul a luat sfarsit. Acum e timpul sa ne spunem ce am gandit cu adevarat unii despre altii.",
        "campuri": [
            {"persoana_idx": 8, "tip": "optiuni", "intrebare": "Cat de mult a contribuit la proiect?", "optiuni": "100%, 50%, 10%, A existat?"},
            {"persoana_idx": 8, "tip": "text", "intrebare": "Ce ai fi facut diferit in echipa?", "optiuni": ""},
            {"persoana_idx": 9, "tip": "text", "intrebare": "Cel mai mare obstacol din proiect?", "optiuni": ""},
            {"persoana_idx": 10, "tip": "optiuni", "intrebare": "Cu aceasta persoana ai mai lucra?", "optiuni": "Definitiv da, Poate, Prefer sa nu, Niciodata in viata mea"},
            {"persoana_idx": 11, "tip": "text", "intrebare": "Lauda sincera pentru un coleg:", "optiuni": ""},
        ],
    },
    {
        "titlu": "Evaluare anuala - Sinceritate Bruta",
        "mesaj": "O data pe an avem curajul sa spunem lucrurilor pe nume. Acel moment este chiar acum. Nu rata ocazia.",
        "campuri": [
            {"persoana_idx": 12, "tip": "optiuni", "intrebare": "Cum descrii atmosfera generala la locul de munca?", "optiuni": "Excelenta, Buna, Tensionata, Supravietuim"},
            {"persoana_idx": 13, "tip": "text", "intrebare": "Ce schimbare ar face cel mai bine companiei?", "optiuni": ""},
            {"persoana_idx": 14, "tip": "optiuni", "intrebare": "Comunicarea intre departamente este?", "optiuni": "Fluenta, Acceptabila, Problematica, Ce comunicare?"},
            {"persoana_idx": 15, "tip": "text", "intrebare": "Un lucru pe care l-ai lauda public:", "optiuni": ""},
            {"persoana_idx": 16, "tip": "optiuni", "intrebare": "Cum evaluezi balanta munca-viata personala?", "optiuni": "Perfecta, Acceptabila, Munca a castigat, Viata personala ce-i aia?"},
            {"persoana_idx": 17, "tip": "text", "intrebare": "Mesaj anonim pentru management:", "optiuni": ""},
        ],
    },
]

RASPUNSURI_TEXT = [
    "Sincer vorbind, putea fi mai bine organizat.",
    "Cel mai bun aspect a fost colegialitatea echipei.",
    "As vrea mai multa transparenta in decizii.",
    "Comunicarea lasa de dorit, dar suntem pe drumul cel bun.",
    "Uneori sedintele par mai lungi decat necesarul.",
    "Apreciez efortul depus, chiar daca rezultatele nu sunt mereu vizibile.",
    "Un exemplu de profesionalism pe care l-as urma.",
    "Stilul haotic dar creativ e caracteristic si de apreciat.",
    "Ma asteptam la mai multa structura in prezentare.",
    "Energie pozitiva, dar putin mai multa organizare n-ar strica.",
    "Cel mai impresionant aspect a fost rabdarea demonstrata.",
    "Feedback-ul primit a fost constructiv si util.",
    "Nu intotdeauna de acord cu metodele, dar respectul e acolo.",
    "O persoana care inspira prin exemplul personal.",
    "Cred ca potential exista, trebuie doar valorificat corect.",
]


def seed():
    print("🐀 Incep popularea bazei de date...")

    USER_USERNAME = "creator_test"
    USER_PASSWORD = "test1234"
    USER_EMAIL = "creator@turnatoru.ro"

    user, created = User.objects.get_or_create(
        username=USER_USERNAME,
        defaults={"email": USER_EMAIL},
    )
    if created:
        user.set_password(USER_PASSWORD)
        user.save()
        print(f"  ✅ User creat: {USER_USERNAME} / {USER_PASSWORD}")
    else:
        print(f"  ℹ️  User existent: {USER_USERNAME}")

    persoane_obiecte = []
    for nume in PERSOANE:
        p, created = Persoana.objects.get_or_create(nume=nume, creator=user)
        persoane_obiecte.append(p)
        status = "adaugata" if created else "existenta"
        print(f"  👤 Persoana {status}: {nume}")

    print(f"\n  📋 Total persoane: {len(persoane_obiecte)}")

    for f_data in FORMULARE:
        formular, f_created = Formular.objects.get_or_create(
            titlu=f_data["titlu"],
            creator=user,
            defaults={"mesaj": f_data["mesaj"]},
        )

        if f_created:
            print(f"\n  📝 Formular creat: {formular.titlu}")

            for idx, camp_data in enumerate(f_data["campuri"]):
                persoana = persoane_obiecte[camp_data["persoana_idx"]]
                CampFormular.objects.create(
                    formular=formular,
                    persoana=persoana,
                    tip=camp_data["tip"],
                    intrebare=camp_data["intrebare"],
                    optiuni=camp_data["optiuni"],
                    ordine=idx,
                )
                print(f"    ❓ Camp adaugat: [{camp_data['tip']}] {camp_data['intrebare'][:60]}")

            for i in range(10):
                t = TokenTurnator(formular=formular)
                t.save()

            print(f"    🎫 10 tokeni generati")

            campuri = list(formular.campuri.all().order_by('ordine'))
            persoane_campuri = {}
            for camp in campuri:
                if camp.persoana_id not in persoane_campuri:
                    persoane_campuri[camp.persoana_id] = []
                persoane_campuri[camp.persoana_id].append(camp)

            tokeni = list(formular.tokeni.all())
            num_raspunsuri = random.randint(3, 7)
            tokeni_de_folosit = random.sample(tokeni, min(num_raspunsuri, len(tokeni)))

            for token in tokeni_de_folosit:
                turnatorie = Turnatorie.objects.create(formular=formular)
                for camp in campuri:
                    if camp.tip == 'text':
                        valoare = random.choice(RASPUNSURI_TEXT)
                    else:
                        optiuni_list = camp.get_optiuni_list()
                        valoare = random.choice(optiuni_list) if optiuni_list else ""
                    RaspunsCamp.objects.create(
                        turnatorie=turnatorie,
                        camp=camp,
                        valoare=valoare,
                    )
                token.folosit = True
                token.save()

            print(f"    🐀 {len(tokeni_de_folosit)} turnatorii simulate")
        else:
            print(f"\n  ℹ️  Formular existent (skip): {formular.titlu}")

    print("\n🎉 Seed complet!")
    print(f"   User: {USER_USERNAME} / {USER_PASSWORD}")
    print(f"   Persoane: {Persoana.objects.filter(creator=user).count()}")
    print(f"   Formulare: {Formular.objects.filter(creator=user).count()}")
    print(f"   Tokeni totali: {TokenTurnator.objects.filter(formular__creator=user).count()}")
    print(f"   Turnatorii: {Turnatorie.objects.filter(formular__creator=user).count()}")
    print(f"\n   🔗 Porneste serverul: python manage.py runserver")
    print(f"   🔗 Login la: http://127.0.0.1:8000/login/")


if __name__ == "__main__":
    seed()
