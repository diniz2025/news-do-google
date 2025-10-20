
import React from 'react';
import Card from './Card';
import Input from './Input';

const KeysTab: React.FC = () => {
  return (
    <Card title="Chaves & Acessos (placeholders)">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="Google (Drive/Gmail)">
          <Input placeholder="Credenciais OAuth / Service Account" />
          <p className="text-xs text-slate-500 mt-2">Drive p/ snapshots e Gmail p/ envio do resumo diário.</p>
        </Card>
        <Card title="Lusha / ReceitaWS (futuro enriquecimento)">
          <div className="space-y-2">
            <Input placeholder="Lusha API Key" />
            <Input placeholder="ReceitaWS Key" />
          </div>
          <p className="text-xs text-slate-500 mt-2">Reservado para módulos de enriquecimento de notícias/empresas.</p>
        </Card>
      </div>
    </Card>
  );
};

export default KeysTab;
