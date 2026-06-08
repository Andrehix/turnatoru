import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="animate-slideUp">
      {/* Hero */}
      <section className="text-center py-20 px-4">
        <h1 className="text-6xl font-black text-rat-red text-glow mb-5">
          🐀 TURNATORU
        </h1>
        <h2 className="text-2xl text-rat-text-dim mb-12 font-normal">
          Platforma unde sinceritatea devine sport de echipă
        </h2>

        <div className="max-w-3xl mx-auto text-left space-y-5 mb-12">
          <Paragraph color="red">
            🤔 Ți-ai dorit vreodată să-i spui șefului că ședințele lui de luni dimineață sunt echivalentul
            unei pedepse medievale? Sau profesorului că PowerPoint-ul lui din 2003 te face să cauți sensul
            vieții? Sau prietenului că ideea lui de "teambuilding" în ploaie a fost o crimă împotriva umanității?
            Ei bine, acum poți. <strong className="text-rat-red">Anonim.</strong> Ca un șobolan adevărat. 🐀
          </Paragraph>
          <Paragraph color="amber">
            🎭 <strong className="text-rat-red">Turnatoru</strong> este platforma care transformă feedback-ul în artă. Sau cel puțin în
            ceva ce nu-ți poate fi urmărit înapoi. Creezi un formular, trimiți tokeni la oameni, și ei
            își varsă tot sufletul. Tu primești adevărul gol-goluț, fără să știi cine l-a scris.
            E ca o cutie cu sugestii, dar digitală și cu mai mult <em>spice</em>. 🌶️
          </Paragraph>
          <Paragraph color="green">
            🚀 De ce am creat Turnatoru? Pentru că formularele anonime existente sunt mai plictisitoare
            decât o prezentare despre normele de protecție a muncii. Noi am zis: "Hai să facem feedback-ul
            distractiv!". Și cam atât a fost planul de business. Restul e improvizație. Ca la orice startup
            românesc care se respectă. 💪
          </Paragraph>
          <Paragraph color="red">
            🛡️ Promitem: niciun token nu va fi asociat cu o persoană reală. Identitatea ta e mai protejată
            decât rețeta de la KFC. Poți spune orice vrei, oricui vrei (prin formular, nu pe stradă, te rog).
            Singura regulă: fii sincer. Sau fii amuzant. Sau ambele. Noi nu judecăm. 🤷
          </Paragraph>
        </div>

        <div className="mb-12">
          <Link
            to="/token"
            className="inline-block bg-rat-amber hover:bg-rat-amber-hover text-rat-bg px-10 py-4 rounded-xl font-black text-lg shadow hover:shadow-[0_5px_15px_rgba(255,165,2,0.4)] hover:-translate-y-0.5 transition-all"
          >
            🎫 Ai un token? Intră aici și toarnă!
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto mt-16">
          <FeatureCard
            emoji="📝"
            title="Creezi Formulare"
            desc="Faci un formular în 30 de secunde. Mai rapid decât poți zice 'review de performanță'."
          />
          <FeatureCard
            emoji="🎫"
            title="Trimiți Tokeni"
            desc="Fiecare participant primește un token unic. Ca un bilet la loterie, dar câștigi sinceritatea."
          />
          <FeatureCard
            emoji="🐀"
            title="Primești Adevărul"
            desc="Feedback anonim, crud și nealterat. Ca opinia bunicii, dar de la colegi."
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center text-rat-text-muted text-sm pb-10 border-t mt-16 pt-8" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
        🐀 Turnatoru © 2026 — Unde anonimitatea e o artă și feedback-ul e o armă. Folosește responsabil (sau nu).
      </footer>
    </div>
  );
}

function Paragraph({ color, children }) {
  const borderColor = color === 'green' ? '#2ed573' : color === 'amber' ? '#ffa502' : '#e94560';
  return (
    <p className="text-lg leading-relaxed text-rat-text px-6 py-4 rounded-r-xl"
       style={{ background: 'rgba(255,255,255,0.03)', borderLeft: `4px solid ${borderColor}` }}>
      {children}
    </p>
  );
}

function FeatureCard({ emoji, title, desc }) {
  return (
    <div className="text-center p-10 rounded-2xl card-hover transition-all" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(233,69,96,0.1)' }}>
      <div className="text-5xl mb-4">{emoji}</div>
      <h3 className="text-xl font-bold text-rat-red mb-3">{title}</h3>
      <p className="text-rat-text-muted leading-relaxed">{desc}</p>
    </div>
  );
}
