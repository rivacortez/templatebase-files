import { Booking, Customer, Room } from "@/lib/models";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Calendar } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { checkRoomAvailability } from "../service/booking-service";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, CaretSortIcon, CheckIcon } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";

interface BookingFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  booking: Partial<Booking>;
  setBooking: (booking: Partial<Booking>) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  submitLabel: string;
  customers: Customer[];
  rooms: Room[];
}

export const BookingFormDialog = ({
  open,
  onOpenChange,
  title,
  description,
  booking,
  setBooking,
  onSubmit,
  isSubmitting,
  submitLabel,
  customers,
  rooms,
}: BookingFormDialogProps) => {
  const [startDate, setStartDate] = useState<Date | undefined>(
    booking.start_date ? new Date(booking.start_date) : undefined
  );
  const [endDate, setEndDate] = useState<Date | undefined>(
    booking.end_date ? new Date(booking.end_date) : undefined
  );
  const [isStartDateOpen, setIsStartDateOpen] = useState(false);
  const [isEndDateOpen, setIsEndDateOpen] = useState(false);
  const [customerSelectOpen, setCustomerSelectOpen] = useState(false);
  const [roomSelectOpen, setRoomSelectOpen] = useState(false);
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);
  const [availabilityError, setAvailabilityError] = useState<string | null>(null);

  // Actualizar las fechas cuando cambia el booking
  useEffect(() => {
    if (booking.start_date) {
      setStartDate(new Date(booking.start_date));
    }
    if (booking.end_date) {
      setEndDate(new Date(booking.end_date));
    }
  }, [booking.start_date, booking.end_date]);

  // Calcular el precio total cuando cambian las fechas o la habitación
  useEffect(() => {
    if (startDate && endDate && booking.room_id) {
      const selectedRoom = rooms.find(room => room.id === booking.room_id);
      if (selectedRoom) {
        const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
        const total = selectedRoom.price * Math.max(1, days);
        setBooking({ ...booking, total_price: total });
      }
    }
  }, [startDate, endDate, booking.room_id, rooms]);

  // Verificar disponibilidad cuando cambian las fechas o la habitación
  useEffect(() => {
    const checkAvailability = async () => {
      if (startDate && endDate && booking.room_id) {
        setIsCheckingAvailability(true);
        setAvailabilityError(null);
        
        try {
          const result = await checkRoomAvailability(
            booking.room_id,
            startDate.toISOString(),
            endDate.toISOString(),
            booking.id
          );
          
          if (result.success && !result.data.isAvailable) {
            setAvailabilityError("La habitación no está disponible en las fechas seleccionadas.");
          }
        } catch (error) {
          console.error("Error al verificar disponibilidad:", error);
        } finally {
          setIsCheckingAvailability(false);
        }
      }
    };
    
    if (startDate && endDate && booking.room_id) {
      checkAvailability();
    }
  }, [startDate, endDate, booking.room_id, booking.id]);

  // Manejar cambio de fecha de inicio
  const handleStartDateChange = (date: Date | undefined) => {
    setStartDate(date);
    if (date) {
      setBooking({
        ...booking,
        start_date: date.toISOString()
      });
      
      // Si la fecha de fin es anterior a la de inicio, actualizarla
      if (endDate && date > endDate) {
        const newEndDate = new Date(date);
        newEndDate.setDate(date.getDate() + 1);
        setEndDate(newEndDate);
        setBooking(prev => ({
          ...prev,
          start_date: date.toISOString(),
          end_date: newEndDate.toISOString()
        }));
      }
    }
    setIsStartDateOpen(false);
  };

  // Manejar cambio de fecha de fin
  const handleEndDateChange = (date: Date | undefined) => {
    setEndDate(date);
    if (date) {
      setBooking({
        ...booking,
        end_date: date.toISOString()
      });
    }
    setIsEndDateOpen(false);
  };

  // Generar las iniciales para el avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  // Función para formatear las fechas
  const formatDate = (date: Date | undefined) => {
    if (!date) return "";
    return format(date, "PPP", { locale: es });
  };

  // Seleccionar un cliente
  const selectedCustomer = customers.find(c => c.id === booking.customer_id);
  
  // Seleccionar una habitación
  const selectedRoom = rooms.find(r => r.id === booking.room_id);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* Selección de Cliente */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="customer" className="text-right">Cliente</Label>
            <div className="col-span-3">
              <Popover open={customerSelectOpen} onOpenChange={setCustomerSelectOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={customerSelectOpen}
                    className="w-full justify-between"
                  >
                    {selectedCustomer ? (
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback className="bg-primary/10 text-primary text-xs">
                            {getInitials(selectedCustomer.name)}
                          </AvatarFallback>
                        </Avatar>
                        <span>{selectedCustomer.name}</span>
                      </div>
                    ) : (
                      "Seleccione un cliente"
                    )}
                    <CaretSortIcon className="h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[300px] p-0">
                  <Command>
                    <CommandInput placeholder="Buscar cliente..." className="h-9" />
                    <CommandList>
                      <CommandEmpty>No se encontraron clientes.</CommandEmpty>
                      <CommandGroup>
                        {customers.map((customer) => (
                          <CommandItem
                            key={customer.id}
                            value={customer.name}
                            onSelect={() => {
                              setBooking({ ...booking, customer_id: customer.id });
                              setCustomerSelectOpen(false);
                            }}
                            className="flex items-center gap-2 cursor-pointer"
                          >
                            <Avatar className="h-6 w-6">
                              <AvatarFallback className="bg-primary/10 text-primary text-xs">
                                {getInitials(customer.name)}
                              </AvatarFallback>
                            </Avatar>
                            <span>{customer.name}</span>
                            {customer.id === booking.customer_id && (
                              <CheckIcon className="ml-auto h-4 w-4" />
                            )}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Selección de Habitación */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="room" className="text-right">Habitación</Label>
            <div className="col-span-3">
              <Popover open={roomSelectOpen} onOpenChange={setRoomSelectOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={roomSelectOpen}
                    className="w-full justify-between"
                  >
                    {selectedRoom ? (
                      <span>
                        {selectedRoom.room_number} - {selectedRoom.type} (${selectedRoom.price}/noche)
                      </span>
                    ) : (
                      "Seleccione una habitación"
                    )}
                    <CaretSortIcon className="h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[300px] p-0">
                  <Command>
                    <CommandInput placeholder="Buscar habitación..." className="h-9" />
                    <CommandList>
                      <CommandEmpty>No se encontraron habitaciones disponibles.</CommandEmpty>
                      <CommandGroup>
                        {rooms
                          .filter(room => room.state === "disponible")
                          .map((room) => (
                          <CommandItem
                            key={room.id}
                            value={room.room_number}
                            onSelect={() => {
                              setBooking({ ...booking, room_id: room.id });
                              setRoomSelectOpen(false);
                            }}
                            className="cursor-pointer"
                          >
                            <span>{room.room_number} - {room.type} (${room.price}/noche)</span>
                            {room.id === booking.room_id && (
                              <CheckIcon className="ml-auto h-4 w-4" />
                            )}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              {availabilityError && (
                <p className="text-destructive text-sm mt-1">{availabilityError}</p>
              )}
            </div>
          </div>

          {/* Fecha de Inicio */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="start_date" className="text-right">Fecha de llegada</Label>
            <div className="col-span-3">
              <Popover open={isStartDateOpen} onOpenChange={setIsStartDateOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !startDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? formatDate(startDate) : "Seleccionar fecha de llegada"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={startDate}
                    onSelect={handleStartDateChange}
                    initialFocus
                    locale={es}
                    disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Fecha de Fin */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="end_date" className="text-right">Fecha de salida</Label>
            <div className="col-span-3">
              <Popover open={isEndDateOpen} onOpenChange={setIsEndDateOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !endDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? formatDate(endDate) : "Seleccionar fecha de salida"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={endDate}
                    onSelect={handleEndDateChange}
                    initialFocus
                    locale={es}
                    disabled={(date) => 
                      date < new Date(new Date().setHours(0, 0, 0, 0)) || 
                      (startDate ? date < startDate : false)
                    }
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Precio Total */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="total_price" className="text-right">Precio Total</Label>
            <div className="relative col-span-3">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">$</span>
              <Input
                id="total_price"
                type="number"
                value={booking.total_price || ""}
                onChange={(e) => setBooking({...booking, total_price: parseFloat(e.target.value)})}
                className="pl-8"
                disabled={isSubmitting}
              />
            </div>
          </div>

          {/* Estado de la Reserva */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="state" className="text-right">Estado</Label>
            <Select
              value={booking.state || "pendiente"}
              onValueChange={(value) => setBooking({...booking, state: value})}
              disabled={isSubmitting}
            >
              <SelectTrigger id="state" className="col-span-3">
                <SelectValue placeholder="Selecciona un estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pendiente">Pendiente</SelectItem>
                <SelectItem value="confirmada">Confirmada</SelectItem>
                <SelectItem value="cancelada">Cancelada</SelectItem>
                <SelectItem value="completada">Completada</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button
            onClick={onSubmit}
            disabled={
              isSubmitting ||
              !booking.customer_id ||
              !booking.room_id ||
              !booking.start_date ||
              !booking.end_date ||
              !booking.total_price ||
              !booking.state ||
              !!availabilityError ||
              isCheckingAvailability
            }
          >
            {isSubmitting || isCheckingAvailability ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isCheckingAvailability ? "Verificando disponibilidad..." : "Guardando..."}
              </>
            ) : (
              submitLabel
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};