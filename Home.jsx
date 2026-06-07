import { Link } from 'react-router-dom';

export default function Home() {
    return (
        <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
                <h1 className="text-5xl font-bold text-red-600 mb-4">Bun venit la Turnatoru! 🐀</h1>
                <p className="text-xl text-gray-700 mb-8">
                    Unde se adună bârfele și secretele se dezvăluie...
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Link
                    to="/create"
                    className="bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white p-8 rounded-lg shadow-lg transform hover:scale-105 transition"
                >
                    <div className="text-center">
                        <div className="text-5xl mb-4">📝</div>
                        <h2 className="text-2xl font-bold mb-4">Fă o Turnătorie</h2>
                        <p className="text-blue-100 mb-6">
                            Creează un formular pentru a aduna bârfele și secretele altora. Ești gata să treci la acțiune?
                        </p>
                        <div className="bg-blue-700 px-4 py-2 rounded font-bold inline-block">
                            Creează Acum 🚀
                        </div>
                    </div>
                </Link>

                <Link
                    to="/token"
                    className="bg-gradient-to-br from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white p-8 rounded-lg shadow-lg transform hover:scale-105 transition"
                >
                    <div className="text-center">
                        <div className="text-5xl mb-4">🔑</div>
                        <h2 className="text-2xl font-bold mb-4">Intră cu Token</h2>
                        <p className="text-purple-100 mb-6">
                            Ai un token secret? Intră și pârăț pe cât poți! Nicio scapare!
                        </p>
                        <div className="bg-purple-700 px-4 py-2 rounded font-bold inline-block">
                            Intră Acum 🕵️‍♂️
                        </div>
                    </div>
                </Link>
            </div>

            <div className="mt-16 bg-gray-50 p-8 rounded-lg border border-gray-200">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Cum funcționează? 🤔</h3>
                <div className="space-y-4 text-gray-700">
                    <div className="flex gap-4">
                        <div className="text-3xl">1️⃣</div>
                        <div>
                            <h4 className="font-bold text-lg">Creator: Fă o Turnătorie</h4>
                            <p>
                                Creează un formular cu întrebări hazlii și generate codul pentru tokenuri. Distribuie tokenii prietenilor tăi.
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <div className="text-3xl">2️⃣</div>
                        <div>
                            <h4 className="font-bold text-lg">Respondent: Intră cu Token</h4>
                            <p>
                                Prietenul tau primeste un token și intră pe site cu el. Apoi răspunde onest la întrebări (sau nu 😏).
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <div className="text-3xl">3️⃣</div>
                        <div>
                            <h4 className="font-bold text-lg">Rezultate: Vezi Bârfele</h4>
                            <p>
                                Creatorului poți vedea toate răspunsurile în panoul de control. Nici o scapare, totul se înregistrează! 📊
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-12 text-center text-gray-600">
                <p className="text-sm">
                    ⚠️ <strong>Atenție:</strong> Această platformă este pentru bârfă responsabilă. Niciun răspuns nu va fi șters din baza de date. Deci gândește-te înainte de a scrie! 💭
                </p>
            </div>
        </div>
    );
}
