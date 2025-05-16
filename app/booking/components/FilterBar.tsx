import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarRange, Filter, Search } from "lucide-react";
import { DateRangePicker } from "@/components/ui/date-range-picker"; 

interface FilterBarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filterState: string;
  setFilterState: (state: string) => void;
  bookingStates: string[];
  dateRange: { from?: Date; to?: Date } | undefined;
  setDateRange: (range: { from?: Date; to?: Date } | undefined) => void;
}

export const FilterBar = ({
  searchTerm,
  setSearchTerm,
  filterState,
  setFilterState,
  bookingStates,
  dateRange,
  setDateRange
}: FilterBarProps) => {
  return (
    <div className="flex flex-col space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex w-full sm:w-auto items-center space-x-2">
          <div className="relative w-full sm:w-64 md:w-80">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar reserva..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
          {searchTerm && (
            <Button variant="ghost" onClick={() => setSearchTerm("")} size="sm">
              Limpiar
            </Button>
          )}
        </div>
        
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          <Select value={filterState} onValueChange={setFilterState}>
            <SelectTrigger className="w-full sm:w-40">
              <div className="flex items-center gap-2">
                <Filter size={16} />
                <SelectValue placeholder="Filtrar por estado" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los estados</SelectItem>
              {bookingStates.map(state => (
                <SelectItem key={state} value={state}>{state}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <CalendarRange size={16} className="text-muted-foreground" />
        <span className="text-sm font-medium">Filtrar por fechas:</span>
        <DateRangePicker
          value={dateRange}
          onChange={setDateRange}
          placeholder="Seleccionar rango de fechas"
        />
        {dateRange?.from && (
          <Button variant="ghost" size="sm" onClick={() => setDateRange(undefined)}>
            Limpiar fechas
          </Button>
        )}
      </div>
    </div>
  );
}; 