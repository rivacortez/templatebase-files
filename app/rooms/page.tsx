"use client";

import { useState, useEffect, useMemo } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, PlusCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Componentes
import { FilterBar } from "./components/FilterBar";
import { RoomsTable } from "./components/RoomsTable";
import { StatsPanel } from "./components/StatsPanel";
import { RoomFormDialog } from "./dialogs/RoomFormDialog";
import { Room } from "@/lib/models";

// Servicios
import { getRooms, createRoom, updateRoom, deleteRoom } from "./service/rooms-service";

// Toast provisional
const toast = (props: { title?: string; description?: string; variant?: "default" | "destructive" }) => {
  console.log(`Toast: ${props.title} - ${props.description}`);
};

export default function RoomsPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("_all_");
  const [filterState, setFilterState] = useState("_all_");
  const [newRoom, setNewRoom] = useState<Partial<Room & { customType?: string }>>({
    room_number: "",
    type: "",
    capacity: 1,
    price: 0,
    state: "disponible",
    customer_id: 0
  });
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [roomToEdit, setRoomToEdit] = useState<Room & { customType?: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Cargar datos de habitaciones
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const result = await getRooms();
        
        if (!result.success) {
          throw new Error(result.message);
        }
        
        setRooms(result.data || []);
      } catch (error: any) {
        console.error("Error al cargar habitaciones:", error.message);
        toast({
          title: "Error",
          description: "No se pudo cargar las habitaciones. " + error.message,
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Extraer todos los tipos únicos para el filtro
  const roomTypes = useMemo(() => {
    return [...new Set(rooms.map(room => room.type))].sort();
  }, [rooms]);
  
  // Filtrar habitaciones por búsqueda y filtros
  const filteredRooms = useMemo(() => {
    return rooms.filter(room => {
      const matchesSearch = !searchTerm || 
        room.room_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        room.type.toLowerCase().includes(searchTerm.toLowerCase());
        
      const matchesType = filterType === "_all_" || !filterType || room.type === filterType;
      
      const matchesState = filterState === "_all_" || !filterState || room.state === filterState;
        
      return matchesSearch && matchesType && matchesState;
    });
  }, [rooms, searchTerm, filterType, filterState]);

  // Añadir nueva habitación
  const handleAddRoom = async () => {
    if (!newRoom.room_number || (!newRoom.type || (newRoom.type === "otro" && !newRoom.customType))) return;

    setIsSubmitting(true);
    try {
      const finalType = newRoom.type === "otro" ? newRoom.customType : newRoom.type;
      const roomToAdd = {
        room_number: newRoom.room_number,
        type: finalType as string,
        capacity: newRoom.capacity || 1,
        price: newRoom.price || 0,
        state: newRoom.state || "disponible",
        customer_id: newRoom.state === "ocupada" ? (newRoom.customer_id || 0) : 0
      };
      
      const result = await createRoom(roomToAdd);
      
      if (!result.success) {
        throw new Error(result.message);
      }
      
      // Refrescar habitaciones
      const refreshResult = await getRooms();
      
      if (!refreshResult.success) {
        throw new Error(refreshResult.message);
      }
      
      setRooms(refreshResult.data || []);
      setNewRoom({
        room_number: "",
        type: "",
        capacity: 1,
        price: 0,
        state: "disponible",
        customer_id: 0
      });
      setIsAddDialogOpen(false);
      
      toast({
        title: "Éxito",
        description: "La habitación ha sido añadida correctamente",
      });
    } catch (error: any) {
      console.error("Error al añadir habitación:", error.message);
      toast({
        title: "Error",
        description: "No se pudo añadir la habitación. " + error.message,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Abrir diálogo de edición
  const handleOpenEditDialog = (room: Room) => {
    setRoomToEdit({...room});
    setIsEditDialogOpen(true);
  };
  
  // Guardar cambios de edición
  const handleSaveEdit = async () => {
    if (!roomToEdit) return;
    
    setIsSubmitting(true);
    try {
      const finalType = roomToEdit.type === "otro" ? roomToEdit.customType : roomToEdit.type;
      const roomToUpdate = {
        ...roomToEdit,
        type: finalType as string,
        customer_id: roomToEdit.state === "ocupada" ? roomToEdit.customer_id : 0
      };
      
      delete roomToUpdate.customType;
      
      const result = await updateRoom(roomToEdit.id, roomToUpdate);
      
      if (!result.success) {
        throw new Error(result.message);
      }
      
      // Refrescar habitaciones
      const refreshResult = await getRooms();
      
      if (!refreshResult.success) {
        throw new Error(refreshResult.message);
      }
      
      setRooms(refreshResult.data || []);
      setIsEditDialogOpen(false);
      setRoomToEdit(null);
      
      toast({
        title: "Éxito",
        description: "La habitación ha sido actualizada correctamente",
      });
    } catch (error: any) {
      console.error("Error al actualizar habitación:", error.message);
      toast({
        title: "Error",
        description: "No se pudo actualizar la habitación. " + error.message,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Eliminar habitación
  const handleDeleteRoom = async (id: number) => {
    try {
      const result = await deleteRoom(id);
      
      if (!result.success) {
        throw new Error(result.message);
      }
      
      // Actualizar el estado local
      setRooms(rooms.filter(room => room.id !== id));
      
      toast({
        title: "Éxito",
        description: "La habitación ha sido eliminada correctamente",
      });
    } catch (error: any) {
      console.error("Error al eliminar habitación:", error.message);
      toast({
        title: "Error",
        description: "No se pudo eliminar la habitación. " + error.message,
        variant: "destructive"
      });
    }
  };

  // Obtener estadísticas de habitaciones
  const roomsStats = useMemo(() => ({
    totalRooms: rooms.length,
    availableRooms: rooms.filter(room => room.state === "disponible").length,
    occupiedRooms: rooms.filter(room => room.state === "ocupada").length,
    maintenanceRooms: rooms.filter(room => room.state === "mantenimiento").length,
    totalCapacity: rooms.reduce((sum, room) => sum + room.capacity, 0),
    totalValue: rooms.reduce((sum, room) => sum + room.price, 0),
    averagePrice: rooms.length ? 
      rooms.reduce((sum, room) => sum + room.price, 0) / rooms.length : 0
  }), [rooms]);

  // Restablecer filtros
  const resetFilters = () => {
    setSearchTerm("");
    setFilterType("_all_");
    setFilterState("_all_");
  };

  // Mostrar spinner de carga mientras se obtienen los datos
  if (isLoading) {
    return (
      <div className="container mx-auto py-16 flex flex-col items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Cargando habitaciones...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-1">Habitaciones</h1>
          <p className="text-muted-foreground">Gestiona las habitaciones del hotel</p>
        </div>
        
        <Button 
          className="flex items-center gap-2"
          onClick={() => setIsAddDialogOpen(true)}
        >
          <PlusCircle size={16} />
          <span>Añadir Habitación</span>
        </Button>
      </div>

      {roomsStats.maintenanceRooms > 0 && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>¡Atención!</AlertTitle>
          <AlertDescription>
            Hay {roomsStats.maintenanceRooms} habitaciones en mantenimiento. Revisa el estado de las habitaciones.
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="list" className="mb-8">
        <TabsList className="mb-6 w-full sm:w-auto">
          <TabsTrigger value="list" className="flex items-center gap-2">
            <span>Lista de Habitaciones</span>
          </TabsTrigger>
          <TabsTrigger value="stats" className="flex items-center gap-2">
            <span>Estadísticas</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="list">
          <div className="grid gap-6">
            <FilterBar 
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              filterType={filterType}
              setFilterType={setFilterType}
              filterState={filterState}
              setFilterState={setFilterState}
              roomTypes={roomTypes}
            />
            
            <RoomsTable 
              rooms={rooms}
              filteredRooms={filteredRooms}
              totalValue={roomsStats.totalValue}
              onEdit={handleOpenEditDialog}
              onDelete={handleDeleteRoom}
              resetFilters={resetFilters}
            />
          </div>
        </TabsContent>
        
        <TabsContent value="stats">
          <StatsPanel 
            rooms={rooms}
            stats={roomsStats}
            roomTypes={roomTypes}
          />
        </TabsContent>
      </Tabs>
      
      {/* Diálogo para añadir habitación */}
      <RoomFormDialog
        title="Añadir Nueva Habitación"
        description="Ingresa los detalles de la nueva habitación para el hotel"
        isOpen={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        room={newRoom}
        setRoom={setNewRoom}
        onSubmit={handleAddRoom}
        isSubmitting={isSubmitting}
        availableTypes={roomTypes}
      />
      
      {/* Diálogo para editar habitación */}
      {roomToEdit && (
        <RoomFormDialog
          title="Editar Habitación"
          description="Modifica los detalles de la habitación seleccionada"
          isOpen={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          room={roomToEdit}
          setRoom={setRoomToEdit as any}
          onSubmit={handleSaveEdit}
          isSubmitting={isSubmitting}
          buttonText="Guardar Cambios"
          availableTypes={roomTypes}
        />
      )}
    </div>
  );
}