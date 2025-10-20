
import React from 'react';
import Card from './Card';
import Label from './Label';
import Input from './Input';
import Switch from './Switch';
import Button from './Button';

interface ActionBarProps {
    corsProxy: string;
    setCorsProxy: (value: string) => void;
    onlyEnabled: boolean;
    setOnlyEnabled: (value: boolean) => void;
    onRunNow: () => void;
    isRunning: boolean;
}

const ActionBar: React.FC<ActionBarProps> = ({ corsProxy, setCorsProxy, onlyEnabled, setOnlyEnabled, onRunNow, isRunning }) => {
    return (
        <Card className="mt-4">
            <div className="flex flex-wrap items-end gap-6">
                <div className="flex-grow min-w-[260px]">
                    <Label htmlFor="cors-proxy">Proxy CORS</Label>
                    <Input 
                        id="cors-proxy"
                        value={corsProxy} 
                        onChange={(e) => setCorsProxy(e.target.value)} 
                        placeholder="https://api.allorigins.win/raw?url=" 
                    />
                    <p className="text-xs text-slate-500 mt-1">
                        Dica: se um site bloquear, teste <code>https://r.jina.ai/</code> ou use um proxy próprio.
                    </p>
                </div>
                <div className="min-w-[180px]">
                    <Label>Coletar apenas fontes ligadas</Label>
                    <div className="flex items-center gap-2">
                        <Switch checked={onlyEnabled} onChange={setOnlyEnabled} />
                        <span className="text-sm font-medium">{onlyEnabled ? "Sim" : "Não"}</span>
                    </div>
                </div>
                <div className="flex-shrink-0">
                    <Button onClick={onRunNow} disabled={isRunning}>
                        {isRunning ? "Buscando…" : "🔎 Buscar agora"}
                    </Button>
                </div>
            </div>
        </Card>
    );
}

export default ActionBar;
