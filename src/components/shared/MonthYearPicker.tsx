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
  "Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
  "Jul", "Ago", "Set", "Out", "Nov", "Dez",
];

interface MonthYearPickerProps {
  value?: Date;
  onChange: (date: Date) => void;
  disabled?: boolean;
  minDate?: Date;
  placeholder?: string;
  className?: string;
}

export function MonthYearPicker({
  value,
  onChange,
  disabled = false,
  minDate,
  placeholder = "Selecione",
  className,
}: MonthYearPickerProps) {
  const [year, setYear] = useState(
    value?.getFullYear() ?? new Date().getFullYear()
  );

  const isMonthDisabled = (year: number, month: number) => {
    if (!minDate) return false;

    const current = new Date(year, month, 1);
    const min = new Date(
      minDate.getFullYear(),
      minDate.getMonth(),
      1
    );

    return current <= min;
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn("w-full justify-between", className)}
          disabled={disabled}
        >
          {value
            ? `${months[value.getMonth()]} ${value.getFullYear()}`
            : placeholder}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[280px] p-3">
        {/* Header do ano */}
        <div className="flex items-center justify-between mb-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setYear((y) => y - 1)}
            disabled={disabled}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <span className="font-semibold">{year}</span>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setYear((y) => y + 1)}
            disabled={disabled}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Grid de meses */}
        <div className="grid grid-cols-3 gap-2">
          {months.map((month, index) => {
            const selected =
              value?.getFullYear() === year &&
              value?.getMonth() === index;

            const disabledMonth = isMonthDisabled(year, index);

            return (
              <Button
                key={month}
                variant={selected ? "default" : "ghost"}
                className={cn(
                  "h-9",
                  selected && "bg-primary text-primary-foreground"
                )}
                disabled={disabled || disabledMonth}
                onClick={() =>
                  onChange(new Date(year, index, 1))
                }
              >
                {month}
              </Button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}
