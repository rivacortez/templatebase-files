"use client";

import * as React from "react";
import { CalendarIcon } from "lucide-react";
import { addDays, format } from "date-fns";
import { es } from "date-fns/locale";
import { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DateRangePickerProps {
  value: DateRange | undefined;
  onChange: (date: DateRange | undefined) => void;
  placeholder?: string;
  className?: string;
}

export function DateRangePicker({
  value,
  onChange,
  placeholder = "Seleccionar rango de fechas",
  className,
}: DateRangePickerProps) {
  const [date, setDate] = React.useState<DateRange | undefined>(value);

  // Actualizar el valor si cambia externamente
  React.useEffect(() => {
    setDate(value);
  }, [value]);

  // Manejar el cambio de fecha y propagar hacia arriba
  const handleDateChange = (newDate: DateRange | undefined) => {
    setDate(newDate);
    onChange(newDate);
  };

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-[300px] justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "PPP", { locale: es })} -{" "}
                  {format(date.to, "PPP", { locale: es })}
                </>
              ) : (
                format(date.from, "PPP", { locale: es })
              )
            ) : (
              <span>{placeholder}</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from || new Date()}
            selected={date}
            onSelect={handleDateChange}
            numberOfMonths={2}
            locale={es}
          />
          <div className="p-3 border-t border-border flex justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDateChange(undefined)}
            >
              Limpiar
            </Button>
            <div className="space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const today = new Date();
                  handleDateChange({
                    from: today,
                    to: addDays(today, 7),
                  });
                }}
              >
                Próxima semana
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const today = new Date();
                  handleDateChange({
                    from: today,
                    to: addDays(today, 30),
                  });
                }}
              >
                Próximo mes
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
} 