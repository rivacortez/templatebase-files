"use client";

import { useState, useEffect, useMemo } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, PlusCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DateRange } from "react-day-picker";

// Componentes
import { FilterBar } from "./components/FilterBar";
import { BookingTable } from "./components/BookingTable";
import { StatsPanel } from "./components/StatsPanel";
import { BookingFormDialog } from "./dialogs/BookingFormDialog";
import { Booking, Customer, Room } from "@/lib/models";

// Servicios 
import { getBookings, createBooking, updateBooking, deleteBooking } from "./service/booking-service";
import { getCustomers } from "../customers/service/customer-service";
import { getRooms } from "../rooms/service/room-service";

// Toast provisional
const toast = (props: { title?: string; description?: string; variant?: "default" | "destructive" }) => {
  console.log(`Toast: ${props.title} - ${props.description}`);
};

export default function BookingPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterState, setFilterState] = useState("all");
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [newBooking, setNewBooking] = useState<Partial<Booking>>({
    customer_id: 0,
    room_id: 0,
    start_date: new Date().toISOString(),
    end_date: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString(),
    total_price: 0,
    state: "pendiente"
  });
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [bookingToEdit, setBookingToEdit] = useState<any | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("todas");

  // Cargar datos iniciales
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Cargar reservas, clientes y habitaciones
        const [bookingsResult, customersResult, roomsResult] = await Promise.all([
          getBookings(),
          getCustomers(),
          getRooms()
        ]);
        
        if (!bookingsResult.success) {
          throw new Error(bookingsResult.message);
        }
        
        if (!customersResult.success) {
          throw new Error(customersResult.message);
        }
        
        if (!roomsResult.success) {
          throw new Error(roomsResult.message);
        }
        
        setBookings(bookingsResult.data || []);
        setCustomers(customersResult.data || []);
        setRooms(roomsResult.data || []);
      } catch (error: any) {
        console.error("Error al cargar datos:", error.message);
        toast({
          title: "Error",
          description: "No se pudieron cargar los datos. " + error.message,
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Extraer todos los estados únicos para el filtro
  const bookingStates = useMemo(() => {
    return [...new Set(bookings.map(booking => booking.state))].sort();
  }, [bookings]);
  
  // Filtrar reservas
  const filteredBookings = useMemo(() => {
    return bookings.filter(booking => {
      // Filtrar por término de búsqueda
      const matchesSearch = !searchTerm || 
        booking.state.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (booking.customers?.name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
        (booking.rooms?.room_number || "").includes(searchTerm);
        
      // Filtrar por estado
      const matchesState = filterState === "all" || booking.state === filterState;
      
      // Filtrar por pestaña activa
      const matchesTab = 
        activeTab === "todas" || 
        (activeTab === "pendientes" && booking.state === "pendiente") ||
        (activeTab === "confirmadas" && booking.state === "confirmada") ||
        (activeTab === "canceladas" && booking.state === "cancelada");
      
      // Filtrar por rango de fechas
      let matchesDateRange = true;
      if (dateRange?.from && dateRange?.to) {
        const startDate = new Date(booking.start_date);
        const endDate = new Date(booking.end_date);
        const from = new Date(dateRange.from);
        const to = new Date(dateRange.to);
        
        // La reserva se superpone con el rango de fechas seleccionado
        matchesDateRange = (
          (startDate >= from && startDate <= to) || // La fecha de inicio está dentro del rango
          (endDate >= from && endDate <= to) || // La fecha de fin está dentro del rango
          (startDate <= from && endDate >= to) // La reserva abarca todo el rango
        );
      }
        
      return matchesSearch && matchesState && matchesTab && matchesDateRange;
    });
  }, [bookings, searchTerm, filterState, activeTab, dateRange]);

  // Añadir nueva reserva
  const handleAddBooking = async () => {
    setIsSubmitting(true);
    try {
      const result = await createBooking({
        customer_id: newBooking.customer_id || 0,
        room_id: newBooking.room_id || 0,
        start_date: newBooking.start_date || "",
        end_date: newBooking.end_date || "",
        total_price: newBooking.total_price || 0,
        state: newBooking.state || "pendiente"
      });

      if (!result.success) {
        throw new Error(result.message);
      }

      setBookings(prev => [result.data, ...prev]);
      setIsAddDialogOpen(false);
      setNewBooking({
        customer_id: 0,
        room_id: 0,
        start_date: new Date().toISOString(),
        end_date: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString(),
        total_price: 0,
        state: "pendiente"
      });

      toast({
        title: "Reserva añadida",
        description: "La reserva ha sido añadida correctamente."
      });
    } catch (error: any) {
      console.error("Error al añadir reserva:", error.message);
      toast({
        title: "Error",
        description: "No se pudo añadir la reserva. " + error.message,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Editar reserva existente
  const handleEditBooking = async () => {
    if (!bookingToEdit || !bookingToEdit.id) return;

    setIsSubmitting(true);
    try {
      const result = await updateBooking(bookingToEdit.id, {
        customer_id: bookingToEdit.customer_id,
        room_id: bookingToEdit.room_id,
        start_date: bookingToEdit.start_date,
        end_date: bookingToEdit.end_date,
        total_price: bookingToEdit.total_price,
        state: bookingToEdit.state
      });

      if (!result.success) {
        throw new Error(result.message);
      }

      setBookings(prev => 
        prev.map(booking => 
          booking.id === bookingToEdit.id ? result.data : booking
        )
      );
      setIsEditDialogOpen(false);
      setBookingToEdit(null);

      toast({
        title: "Reserva actualizada",
        description: "La reserva ha sido actualizada correctamente."
      });
    } catch (error: any) {
      console.error("Error al actualizar reserva:", error.message);
      toast({
        title: "Error",
        description: "No se pudo actualizar la reserva. " + error.message,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Eliminar reserva
  const handleDeleteBooking = async (id: number) => {
    if (!confirm("¿Estás seguro de que deseas eliminar esta reserva? Esta acción no se puede deshacer.")) {
      return;
    }

    try {
      const result = await deleteBooking(id);

      if (!result.success) {
        throw new Error(result.message);
      }

      setBookings(prev => prev.filter(booking => booking.id !== id));

      toast({
        title: "Reserva eliminada",
        description: "La reserva ha sido eliminada correctamente."
      });
    } catch (error: any) {
      console.error("Error al eliminar reserva:", error.message);
      toast({
        title: "Error",
        description: "No se pudo eliminar la reserva. " + error.message,
        variant: "destructive"
      });
    }
  };

  // Resetear filtros
  const resetFilters = () => {
    setSearchTerm("");
    setFilterState("all");
    setDateRange(undefined);
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reservas</h1>
          <p className="text-muted-foreground">
            Gestiona las reservas del hotel.
          </p>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)} className="gap-1">
          <PlusCircle size={16} />
          Nueva Reserva
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Cargando reservas...</span>
        </div>
      ) : bookings.length === 0 ? (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>No hay reservas</AlertTitle>
          <AlertDescription>
            No se encontraron reservas en el sistema. Añade tu primera reserva haciendo clic en el botón "Nueva Reserva".
          </AlertDescription>
        </Alert>
      ) : (
        <>
          <StatsPanel bookings={bookings} />
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid grid-cols-4 w-full sm:w-[400px]">
              <TabsTrigger value="todas">Todas</TabsTrigger>
              <TabsTrigger value="pendientes">Pendientes</TabsTrigger>
              <TabsTrigger value="confirmadas">Confirmadas</TabsTrigger>
              <TabsTrigger value="canceladas">Canceladas</TabsTrigger>
            </TabsList>
            
            <TabsContent value={activeTab} className="space-y-6">
              <FilterBar
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                filterState={filterState}
                setFilterState={setFilterState}
                bookingStates={bookingStates}
                dateRange={dateRange}
                setDateRange={setDateRange}
              />

              <div className="grid grid-cols-1 gap-6">
                <BookingTable
                  bookings={bookings}
                  filteredBookings={filteredBookings}
                  onEdit={(booking) => {
                    setBookingToEdit(booking);
                    setIsEditDialogOpen(true);
                  }}
                  onDelete={handleDeleteBooking}
                  resetFilters={resetFilters}
                />
              </div>
            </TabsContent>
          </Tabs>
        </>
      )}

      {/* Diálogo para añadir nueva reserva */}
      <BookingFormDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        title="Añadir nueva reserva"
        description="Completa el formulario para añadir una nueva reserva."
        booking={newBooking}
        setBooking={setNewBooking}
        onSubmit={handleAddBooking}
        isSubmitting={isSubmitting}
        submitLabel="Añadir reserva"
        customers={customers}
        rooms={rooms}
      />

      {/* Diálogo para editar reserva */}
      {bookingToEdit && (
        <BookingFormDialog
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          title="Editar reserva"
          description="Actualiza la información de la reserva."
          booking={bookingToEdit}
          setBooking={(booking) => setBookingToEdit({...bookingToEdit, ...booking})}
          onSubmit={handleEditBooking}
          isSubmitting={isSubmitting}
          submitLabel="Guardar cambios"
          customers={customers}
          rooms={rooms}
        />
      )}
    </div>
  );
}