
import React from 'react';
import type { Pipeline } from '../types';
import Card from './Card';
import Label from './Label';
import Input from './Input';

interface ScheduleTabProps {
  schedule: Pipeline['schedule'];
  setSchedule: <K extends keyof Pipeline["schedule"]>(key: K, value: Pipeline["schedule"][K]) => void;
}

const ScheduleTab: React.FC<ScheduleTabProps> = ({ schedule, setSchedule }) => {
  return (
    <Card title="Agendamento">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <Label htmlFor="freq">Frequência</Label>
          <select
            id="freq"
            value={schedule.freq}
            onChange={(e) => setSchedule("freq", e.target.value as Pipeline["schedule"]["freq"])}
            className="w-full border border-gray-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-slate-800 focus:border-slate-800"
          >
            <option value="HOURLY">De hora em hora</option>
            <option value="DAILY">Diário</option>
            <option value="WEEKLY">Semanal</option>
          </select>
        </div>
        <div>
          <Label htmlFor="hour">Hora</Label>
          <Input id="hour" type="number" min={0} max={23} value={schedule.hour} onChange={(e) => setSchedule("hour", Number(e.target.value))} />
        </div>
        <div>
          <Label htmlFor="minute">Minuto</Label>
          <Input id="minute" type="number" min={0} max={59} value={schedule.minute} onChange={(e) => setSchedule("minute", Number(e.target.value))} />
        </div>
      </div>
      <p className="text-sm text-slate-500 mt-4">Padrão: diariamente às 08:00 (America/Sao_Paulo).</p>
    </Card>
  );
};

export default ScheduleTab;
