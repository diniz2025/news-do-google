
import React from 'react';
import Card from './Card';
import Label from './Label';
import Input from './Input';
import Switch from './Switch';

interface RoutesTabProps {
  drive: { folder: string; enabled: boolean };
  setDrive: React.Dispatch<React.SetStateAction<{ folder: string; enabled: boolean }>>;
  email: { to: string; from: string; subject: string; enabled: boolean };
  setEmail: React.Dispatch<React.SetStateAction<{ to: string; from: string; subject: string; enabled: boolean }>>;
  zapi: { appId: string; apiKey: string; phone: string; enabled: boolean };
  setZapi: React.Dispatch<React.SetStateAction<{ appId: string; apiKey: string; phone: string; enabled: boolean }>>;
}

const RoutesTab: React.FC<RoutesTabProps> = ({ drive, setDrive, email, setEmail, zapi, setZapi }) => {
  return (
    <Card title="Roteamento">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card title="Painel (snapshot)">
          <div className="space-y-4">
            <div>
                <Label>Pasta no Drive para histórico (opcional)</Label>
                <Input value={drive.folder} onChange={(e) => setDrive({ ...drive, folder: e.target.value })} />
            </div>
            <div className="flex items-center gap-2">
                <Switch checked={drive.enabled} onChange={(v) => setDrive({ ...drive, enabled: v })} />
                <span className="text-sm">Salvar snapshot diário no Drive</span>
            </div>
          </div>
        </Card>

        <Card title="WhatsApp (Z‑API)">
          <div className="space-y-4">
            <div>
                <Label>App ID</Label>
                <Input value={zapi.appId} onChange={(e) => setZapi({ ...zapi, appId: e.target.value })} />
            </div>
            <div>
                <Label>API Key</Label>
                <Input type="password" value={zapi.apiKey} onChange={(e) => setZapi({ ...zapi, apiKey: e.target.value })} />
            </div>
            <div>
                <Label>Número</Label>
                <Input value={zapi.phone} onChange={(e) => setZapi({ ...zapi, phone: e.target.value })} />
            </div>
            <div className="flex items-center gap-2">
                <Switch checked={zapi.enabled} onChange={(v) => setZapi({ ...zapi, enabled: v })} />
                <span className="text-sm">Enviar resumo diário via WhatsApp</span>
            </div>
          </div>
        </Card>

        <Card title="E‑mail">
          <div className="space-y-4">
            <div>
                <Label>Para</Label>
                <Input value={email.to} onChange={(e) => setEmail({ ...email, to: e.target.value })} />
            </div>
            <div>
                <Label>De</Label>
                <Input value={email.from} onChange={(e) => setEmail({ ...email, from: e.target.value })} />
            </div>
            <div>
                <Label>Assunto</Label>
                <Input value={email.subject} onChange={(e) => setEmail({ ...email, subject: e.target.value })} />
            </div>
            <div className="flex items-center gap-2">
                <Switch checked={email.enabled} onChange={(v) => setEmail({ ...email, enabled: v })} />
                <span className="text-sm">Disparar e‑mail às 08:00</span>
            </div>
          </div>
        </Card>
      </div>
    </Card>
  );
};

export default RoutesTab;
