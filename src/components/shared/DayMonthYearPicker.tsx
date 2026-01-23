import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const months = [
  "Janeiro", "Fevereiro", "Março", "Abril",
  "Maio", "Junho", "Julho", "Agosto",
  "Setembro", "Outubro", "Novembro", "Dezembro",
];

interface DayMonthYearPickerProps {
  value?: Date;
  onChange: (date: Date) => void;
}

export function DayMonthYearPicker({
  value,
  onChange,
}: DayMonthYearPickerProps) {
  const today = new Date();

  const [year, setYear] = useState(
    value?.getFullYear() ?? today.getFullYear()
  );
  const [month, setMonth] = useState(
    value?.getMonth() ?? today.getMonth()
  );

  const selectedDay = value?.getDate();

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-full justify-between">
          {value
            ? value.toLocaleDateString("pt-BR")
            : "Selecione a data"}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[320px] p-3">
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setYear((y) => y - 1)}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <div className="font-semibold">
            {months[month]} {year}
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setYear((y) => y + 1)}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Dias da semana */}
        <div className="grid grid-cols-7 text-center text-xs text-muted-foreground mb-1">
          {["D", "S", "T", "Q", "Q", "S", "S"].map((d) => (
            <div key={d}>{d}</div>
          ))}
        </div>

        {/* Grid de dias */}
        <div className="grid grid-cols-7 gap-1">
          {/* Espaços vazios */}
          {Array.from({ length: firstDayOfMonth }).map((_, i) => (
            <div key={`empty-${i}`} />
          ))}

          {/* Dias */}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const selected =
              day === selectedDay &&
              month === value?.getMonth() &&
              year === value?.getFullYear();

            return (
              <Button
                key={day}
                variant={selected ? "default" : "ghost"}
                size="icon"
                className={cn(
                  "h-9 w-9",
                  selected &&
                    "bg-primary text-primary-foreground"
                )}
                onClick={() =>
                  onChange(new Date(year, month, day))
                }
              >
                {day}
              </Button>
            );
          })}
        </div>

        {/* Navegação de mês */}
        <div className="flex justify-between mt-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              if (month === 0) {
                setMonth(11);
                setYear((y) => y - 1);
              } else {
                setMonth((m) => m - 1);
              }
            }}
          >
            Mês anterior
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              if (month === 11) {
                setMonth(0);
                setYear((y) => y + 1);
              } else {
                setMonth((m) => m + 1);
              }
            }}
          >
            Próximo mês
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
