import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, User, UserCheck } from "lucide-react";
import { Room, Customer } from "@/lib/models";
import { useEffect, useState } from "react";
import { getCustomers } from "../service/customer-service";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";

interface RoomFormDialogProps {
  title: string;
  description: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  room: Partial<Room & { customType?: string }>;
  setRoom: (room: Partial<Room & { customType?: string }>) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  buttonText?: string;
  availableTypes: string[];
}

export const RoomFormDialog = ({
  title,
  description,
  isOpen,
  onOpenChange,
  room,
  setRoom,
  onSubmit,
  isSubmitting,
  buttonText = "Guardar",
  availableTypes
}: RoomFormDialogProps) => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoadingCustomers, setIsLoadingCustomers] = useState(false);
  const [customerSelectOpen, setCustomerSelectOpen] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState<number | null>(room.customer_id || null);

  // Cargar los clientes cuando se abre el diálogo
  useEffect(() => {
    if (isOpen) {
      loadCustomers();
    }
  }, [isOpen]);

  // Cargar la lista de clientes
  const loadCustomers = async () => {
    setIsLoadingCustomers(true);
    try {
      const result = await getCustomers();
      if (result.success) {
        setCustomers(result.data || []);
      }
    } catch (error) {
      console.error("Error al cargar clientes:", error);
    } finally {
      setIsLoadingCustomers(false);
    }
  };

  // Actualizar el ID del cliente cuando cambia la selección
  useEffect(() => {
    if (selectedCustomerId !== null) {
      setRoom({...room, customer_id: selectedCustomerId});
    }
  }, [selectedCustomerId]);

  // Actualizar el cliente seleccionado si cambia el room.customer_id
  useEffect(() => {
    if (room.customer_id !== undefined) {
      setSelectedCustomerId(room.customer_id);
    }
  }, [room.customer_id]);

  // Obtener el cliente seleccionado
  const selectedCustomer = customers.find(customer => customer.id === selectedCustomerId);

  // Generar las iniciales para el avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="room_number" className="text-right">Número</Label>
            <Input
              id="room_number"
              value={room.room_number || ""}
              onChange={(e) => setRoom({...room, room_number: e.target.value})}
              className="col-span-3"
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="type" className="text-right">Tipo</Label>
            <Select 
              value={room.type || ""} 
              onValueChange={(value) => setRoom({...room, type: value})}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Seleccione un tipo" />
              </SelectTrigger>
              <SelectContent>
                {availableTypes.map(type => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
                <SelectItem value="otro">Otro</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {room.type === "otro" && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="customType" className="text-right">Tipo personalizado</Label>
              <Input
                id="customType"
                value={room.customType || ""}
                onChange={(e) => setRoom({...room, customType: e.target.value})}
                className="col-span-3"
              />
            </div>
          )}

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="capacity" className="text-right">Capacidad</Label>
            <Input
              id="capacity"
              type="number"
              value={room.capacity || ""}
              onChange={(e) => setRoom({...room, capacity: parseInt(e.target.value)})}
              className="col-span-3"
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="price" className="text-right">Precio</Label>
            <div className="relative col-span-3">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">$</span>
              <Input
                id="price"
                type="number"
                value={room.price || ""}
                onChange={(e) => setRoom({...room, price: parseFloat(e.target.value)})}
                className="pl-8"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="state" className="text-right">Estado</Label>
            <Select 
              value={room.state || ""} 
              onValueChange={(value) => {
                // Si cambia a estado diferente de "ocupada", resetear el cliente
                if (value !== "ocupada") {
                  setSelectedCustomerId(null);
                  setRoom({...room, state: value, customer_id: 0});
                } else {
                  setRoom({...room, state: value});
                }
              }}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Seleccione un estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="disponible">Disponible</SelectItem>
                <SelectItem value="ocupada">Ocupada</SelectItem>
                <SelectItem value="mantenimiento">Mantenimiento</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {room.state === "ocupada" && (
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
                      disabled={isLoadingCustomers}
                    >
                      {isLoadingCustomers ? (
                        <div className="flex items-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>Cargando clientes...</span>
                        </div>
                      ) : selectedCustomer ? (
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
                                setSelectedCustomerId(customer.id);
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
                              {customer.id === selectedCustomerId && (
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
          )}
          
          <div className="flex justify-end gap-2 mt-6">
            <Button variant="outline" type="button" onClick={() => setRoom({
              room_number: "",
              type: "",
              capacity: 1,
              price: 0,
              state: "disponible",
              customer_id: 0
            })}>
              Limpiar
            </Button>
            <Button 
              type="submit" 
              onClick={onSubmit}
              disabled={isSubmitting || !room.room_number || !room.type || !room.capacity || !room.price || !room.state || (room.state === "ocupada" && !selectedCustomerId)}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Procesando...
                </>
              ) : (
                buttonText
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};