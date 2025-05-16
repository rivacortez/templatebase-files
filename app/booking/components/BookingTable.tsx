import { Booking } from "@/lib/models";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CalendarCheck2 } from "lucide-react";

interface BookingTableProps {
  bookings: Booking[];
  filteredBookings: Booking[];
  onEdit: (booking: Booking) => void;
  onDelete: (id: number) => void;
  resetFilters: () => void;
}

export const BookingTable = ({ bookings, filteredBookings, onEdit, onDelete, resetFilters }: BookingTableProps) => {
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
              <TableHead>Fecha inicio</TableHead>
              <TableHead>Fecha fin</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredBookings.length > 0 ? (
              filteredBookings.map(booking => (
                <TableRow key={booking.id} className="hover:bg-muted/50">
                  <TableCell className="font-medium">{booking.id}</TableCell>
                  <TableCell>{booking.customer_id}</TableCell>
                  <TableCell>{booking.room_id}</TableCell>
                  <TableCell>{booking.start_date}</TableCell>
                  <TableCell>{booking.end_date}</TableCell>
                  <TableCell>${booking.total_price}</TableCell>
                  <TableCell>
                    <Badge className={
                      booking.state === "confirmada"
                        ? "bg-green-500 hover:bg-green-600"
                        : booking.state === "cancelada"
                          ? "bg-destructive hover:bg-destructive/90"
                          : "bg-amber-500 hover:bg-amber-600"
                    }>
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
                        <DropdownMenuItem onClick={() => onDelete(booking.id)} className="text-destructive focus:text-destructive">
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
                    <CalendarCheck2 size={32} className="mb-2" />
                    <p>No se encontraron reservas</p>
                    {(bookings.length > 0) && (
                      <Button variant="link" onClick={resetFilters} className="mt-2">
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