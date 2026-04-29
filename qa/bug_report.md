# Bug Report Scenario

## Scenario

**Title:** Exportul PDF se blocheaza atunci cand numele unei persoane contine caractere speciale

**Severity:** High

**Component:** `core/views.py` -> `export_pdf`

**Environment:**
- Turnatoru local sau staging
- Browser modern
- Formular care contine cel putin o persoana cu nume precum `Ana & Popescu`, `Mihai <Test>`, sau `O'Connor`

## Steps to Reproduce

1. Creeaza o persoana cu nume care contine caractere speciale.
2. Creeaza un formular si adauga o intrebare asociata acelei persoane.
3. Genereaza cel putin un raspuns pentru formular.
4. Deschide dashboard-ul creatorului.
5. Apasa butonul de export PDF.

## Actual Result

Exportul esueaza sau PDF-ul este corupt. In unele cazuri, generatorul de PDF incearca sa interpreteze textul brut ca markup si apare o eroare de randare.

## Expected Result

PDF-ul trebuie sa se genereze corect pentru orice nume valid de persoana, iar caracterele speciale trebuie escapate sau normalizate.

## Why this happens

In export, numele persoanei si intrebarile sunt introduse direct in `Paragraph` fara o sanitizare explicita pentru caracterele speciale specifice formatului ReportLab.

## GitHub Issues Workflow

1. Verifica daca exista deja un issue similar prin cautare in tab-ul Issues.
2. Creeaza un issue nou cu un titlu clar si specific.
3. Completeaza descrierea cu:
   - contextul problemei
   - pasii exacti de reproducere
   - rezultatul actual
   - rezultatul asteptat
   - capturi de ecran sau loguri, daca exista
4. Adauga label-uri precum `bug`, `high priority`, `pdf`, `export`.
5. Mentioneaza componenta afectata si, daca se poate, un commit sau un fisier relevant.
6. Leaga issue-ul de milestone-ul corect sau de sprintul curent.
7. Dupa fix, adauga un comentariu cu rezolvarea si inchide issue-ul cu referinta la commit.

## Acceptance Criteria for the Fix

- Exportul PDF functioneaza pentru nume cu `&`, `<`, `>`, ghilimele si apostrof.
- Nu apare nicio exceptie in timpul generarii.
- PDF-ul rezultat poate fi descarcat si deschis normal.
