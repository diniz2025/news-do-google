
import React from 'react';
import Badge from './Badge';

interface HeaderProps {
    testsOk: boolean;
}

const Header: React.FC<HeaderProps> = ({ testsOk }) => {
    return (
        <header>
            <div className="flex items-center flex-wrap gap-x-4 gap-y-2">
                <h1 className="text-3xl font-extrabold text-slate-900">DCG News Feed – Admin</h1>
                <Badge tone={testsOk ? "ok" : "warn"}>{testsOk ? "Testes automáticos: OK" : "Testes automáticos: verificar"}</Badge>
                <Badge tone="subtle">MVP com coleta real</Badge>
            </div>
            <p className="mt-2 text-sm text-slate-600">
                Coleta real via RSS/Atom (proxy CORS configurável). Experimente o botão <b>Buscar agora</b>.
            </p>
        </header>
    );
}

export default Header;
