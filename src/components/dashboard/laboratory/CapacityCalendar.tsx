
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Calendar as CalendarIcon } from 'lucide-react';

interface CapacityCalendarProps {
  selectedDate: Date | undefined;
  onDateSelect: (date: Date | undefined) => void;
  capacityData: {
    today: number;
    week: number;
    month: number;
  };
}

const CapacityCalendar = ({ selectedDate, onDateSelect, capacityData }: CapacityCalendarProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <CalendarIcon className="h-5 w-5 text-[#1565C0]" />
          <span>Calendário de Capacidade</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={onDateSelect}
          className="rounded-md border"
        />
        <div className="mt-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm">Capacidade Semanal:</span>
            <Badge variant="secondary">{capacityData.week}%</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">Capacidade Mensal:</span>
            <Badge variant="secondary">{capacityData.month}%</Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CapacityCalendar;
