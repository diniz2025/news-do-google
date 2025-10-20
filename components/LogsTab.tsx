
import React from 'react';
import Card from './Card';

interface LogsTabProps {
  log: string[];
}

const LogsTab: React.FC<LogsTabProps> = ({ log }) => {
  return (
    <Card title="Execuções & Auditoria">
      <div className="bg-slate-100 rounded-xl max-h-80 overflow-auto p-4 text-sm font-mono">
        {log.length === 0 ? (
          <p className="text-slate-500">Sem logs ainda. Clique em “Buscar agora”.</p>
        ) : (
          <ul className="space-y-1">
            {log.map((line, i) => (
              <li key={i} className="text-slate-700">{line}</li>
            ))}
          </ul>
        )}
      </div>
    </Card>
  );
};

export default LogsTab;
