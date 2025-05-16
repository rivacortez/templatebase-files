import { Booking } from "@/lib/models";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Calendar, User, Home, DollarSign } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface BookingTableProps {
  bookings: any[]; // Usando any temporalmente porque incluye datos relacionados
  filteredBookings: any[]; // Igual que arriba
  onEdit: (booking: any) => void;
  onDelete: (id: number) => void;
  resetFilters: () => void;
}

export const BookingTable = ({ 
  bookings, 
  filteredBookings, 
  onEdit, 
  onDelete,
  resetFilters
}: BookingTableProps) => {
  
  // Función para formatear fechas ISO a formato legible
  const formatDate = (isoDate: string) => {
    const date = new Date(isoDate);
    return format(date, "PPP", { locale: es });
  };

  // Función para determinar el color de la badge según el estado
  const getStateColor = (state: string) => {
    switch (state) {
      case "confirmada":
        return "bg-green-500 hover:bg-green-600";
      case "pendiente":
        return "bg-amber-500 hover:bg-amber-600";
      case "cancelada":
        return "bg-destructive hover:bg-destructive/90";
      default:
        return "bg-slate-500 hover:bg-slate-600";
    }
  };

  return (
    <Card className="shadow-sm hover:shadow transition-shadow duration-300">
      <CardContent className="p-0">
        <Table>
          <TableCaption>
            {filteredBookings.length === 0 
              ? "No hay reservas que coincidan con la búsqueda" 
              : `Mostrando ${filteredBookings.length} de ${bookings.length} reservas`}
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Habitación</TableHead>
              <TableHead>Llegada</TableHead>
              <TableHead>Salida</TableHead>
              <TableHead>Precio</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredBookings.length > 0 ? (
              filteredBookings.map(booking => (
                <TableRow key={booking.id} className="hover:bg-muted/50">
                  <TableCell className="font-medium">{booking.id}</TableCell>
                  <TableCell className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    {booking.customers?.name || `Cliente ID: ${booking.customer_id}`}
                  </TableCell>
                  <TableCell className="flex items-center gap-2">
                    <Home className="h-4 w-4 text-muted-foreground" />
                    {booking.rooms ? 
                      `${booking.rooms.room_number} (${booking.rooms.type})` : 
                      `Habitación ID: ${booking.room_id}`}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      {formatDate(booking.start_date)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      {formatDate(booking.end_date)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      {booking.total_price.toLocaleString('es-ES', {
                        style: 'currency',
                        currency: 'USD',
                        minimumFractionDigits: 2
                      })}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStateColor(booking.state)}>
                      {booking.state}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          Acciones
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Opciones</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => onEdit(booking)}>
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => onDelete(booking.id)}
                          className="text-destructive focus:text-destructive"
                        >
                          Eliminar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  <div className="flex flex-col items-center justify-center text-muted-foreground">
                    <Calendar size={32} className="mb-2" />
                    <p>No se encontraron reservas</p>
                    {(bookings.length > 0) && (
                      <Button 
                        variant="link" 
                        onClick={resetFilters}
                        className="mt-2"
                      >
                        Limpiar filtros
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};