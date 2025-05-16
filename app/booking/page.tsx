"use client";

import { useState, useEffect, useMemo } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, PlusCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Componentes
// Estos serán creados en los siguientes pasos
// import { FilterBar } from "./components/FilterBar";
// import { BookingTable } from "./components/BookingTable";
// import { StatsPanel } from "./components/StatsPanel";
// import { BookingFormDialog } from "./dialogs/BookingFormDialog";
import { Booking } from "@/lib/models";

// Servicios (serán creados)
// import { getBookings, createBooking, updateBooking, deleteBooking } from "./service/booking-service";

// Toast provisional
const toast = (props: { title?: string; description?: string; variant?: "default" | "destructive" }) => {
  console.log(`Toast: ${props.title} - ${props.description}`);
};

export default function BookingPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterState, setFilterState] = useState("");
  const [newBooking, setNewBooking] = useState<Partial<Booking>>({
    customer_id: 0,
    room_id: 0,
    start_date: "",
    end_date: "",
    total_price: 0,
    state: "pendiente"
  });
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [bookingToEdit, setBookingToEdit] = useState<Booking | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Cargar datos de reservas (simulado)
  useEffect(() => {
    setIsLoading(false);
    // Aquí se llamará a getBookings() cuando el servicio esté implementado
  }, []);

  // Filtrar reservas por búsqueda y filtros
  const filteredBookings = useMemo(() => {
    return bookings.filter(booking => {
      const matchesSearch = !searchTerm ||
        booking.state.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesState = !filterState || booking.state === filterState;
      return matchesSearch && matchesState;
    });
  }, [bookings, searchTerm, filterState]);

  // Añadir nueva reserva (simulado)
  const handleAddBooking = async () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsAddDialogOpen(false);
      toast({ title: "Reserva añadida", description: "La reserva ha sido añadida correctamente." });
    }, 1000);
  };

  // Editar reserva existente (simulado)
  const handleEditBooking = async () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsEditDialogOpen(false);
      setBookingToEdit(null);
      toast({ title: "Reserva actualizada", description: "La reserva ha sido actualizada correctamente." });
    }, 1000);
  };

  // Eliminar reserva (simulado)
  const handleDeleteBooking = async (id: number) => {
    setBookings(prev => prev.filter(booking => booking.id !== id));
    toast({ title: "Reserva eliminada", description: "La reserva ha sido eliminada correctamente." });
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Reservas</h1>
      {/* Aquí irán los Tabs, filtros, tabla y diálogos una vez implementados */}
      <Alert>
        <AlertTitle>En construcción</AlertTitle>
        <AlertDescription>
          La sección de reservas está en desarrollo. Pronto podrás ver, crear, editar y eliminar reservas.
        </AlertDescription>
      </Alert>
    </div>
  );
}