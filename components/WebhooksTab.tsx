
import React from 'react';
import Card from './Card';
import Label from './Label';
import Input from './Input';

const WebhooksTab: React.FC = () => {
  return (
    <Card title="Webhooks & Integrações">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="ActivePieces">
          <Label>Webhook (Receber lote de notícias)</Label>
          <Input placeholder="https://…/webhook/activepieces" />
          <p className="text-xs text-slate-500 mt-2">Use para acionar fluxos paralelos (armazenamento/broadcast/analytics).</p>
        </Card>
        <Card title="Base44 Panel Push">
          <Label>Endpoint</Label>
          <Input placeholder="https://…/api/painel/push" />
          <p className="text-xs text-slate-500 mt-2">Recebe JSON com cards: título, resumo, tags, fonte, link.</p>
        </Card>
      </div>
    </Card>
  );
};

export default WebhooksTab;
