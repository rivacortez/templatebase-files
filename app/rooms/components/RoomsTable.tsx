import { Room } from "@/lib/models";
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { BedDouble } from "lucide-react"; // Icono para habitaciones

interface RoomsTableProps {
  rooms: Room[];
  filteredRooms: Room[];
  totalValue: number;
  onEdit: (room: Room) => void;
  onDelete: (id: number) => void;
  resetFilters: () => void;
}

export const RoomsTable = ({ 
  rooms, 
  filteredRooms, 
  totalValue,
  onEdit, 
  onDelete,
  resetFilters
}: RoomsTableProps) => {
  // Función para determinar el color del estado
  const getStateColor = (state: string) => {
    switch (state.toLowerCase()) {
      case 'disponible':
        return "bg-green-500 hover:bg-green-600";
      case 'ocupada':
        return "bg-destructive hover:bg-destructive/90";
      case 'mantenimiento':
        return "bg-amber-500 hover:bg-amber-600";
      default:
        return "bg-muted hover:bg-muted/80";
    }
  };

  return (
    <Card className="shadow-sm hover:shadow transition-shadow duration-300">
      <CardContent className="p-0">
        <Table>
          <TableCaption>
            {filteredRooms.length === 0 
              ? "No hay habitaciones que coincidan con la búsqueda" 
              : `Mostrando ${filteredRooms.length} de ${rooms.length} habitaciones`}
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Número</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead className="text-right">Capacidad</TableHead>
              <TableHead className="text-right">Precio</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRooms.length > 0 ? (
              filteredRooms.map(room => (
                <TableRow key={room.id} className="hover:bg-muted/50">
                  <TableCell className="font-medium">{room.id}</TableCell>
                  <TableCell>{room.room_number}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="font-normal">
                      {room.type}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {room.capacity} {room.capacity === 1 ? "persona" : "personas"}
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    ${room.price.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <Badge className={getStateColor(room.state)}>
                      {room.state}
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
                        <DropdownMenuItem onClick={() => onEdit(room)}>
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="text-destructive"
                          onClick={() => onDelete(room.id)}
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
                <TableCell colSpan={7} className="text-center py-8">
                  <div className="flex flex-col items-center justify-center text-muted-foreground">
                    <BedDouble size={48} className="mb-2 opacity-30" />
                    <p>No hay habitaciones que coincidan con los criterios</p>
                    <Button 
                      variant="link" 
                      onClick={resetFilters}
                    >
                      Limpiar filtros
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter className="flex justify-between p-4 bg-muted/30">
        <p className="text-sm text-muted-foreground">
          Habitaciones totales: <strong>{rooms.length}</strong>
        </p>
        <p className="text-sm text-muted-foreground">
          Valor total: <strong>${totalValue.toFixed(2)}</strong>
        </p>
      </CardFooter>
    </Card>
  );
};