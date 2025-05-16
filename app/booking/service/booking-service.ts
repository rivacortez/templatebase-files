import { Booking } from "@/lib/models";
import { createClient } from "@supabase/supabase-js";

// Tipo para las respuestas del servicio
type ServiceResponse = {
  success: boolean;
  message?: string;
  data?: any;
};

// Obtener las variables de entorno
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_KEY;

// Verificar que las variables de entorno estén definidas
if (!SUPABASE_URL || !SUPABASE_KEY) {
  throw new Error('Las variables de entorno NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_KEY deben estar definidas.');
}

// Crear cliente de Supabase
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

/**
 * Obtiene todas las reservas
 */
export const getBookings = async (): Promise<ServiceResponse> => {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .select(`
        *,
        customers (name),
        rooms (room_number, type)
      `)
      .order('id', { ascending: false });
    
    if (error) throw error;
    
    return {
      success: true,
      data
    };
  } catch (error: any) {
    console.error('Error al obtener reservas:', error.message);
    return {
      success: false,
      message: error.message
    };
  }
};

/**
 * Crea una nueva reserva
 */
export const createBooking = async (booking: Omit<Booking, 'id'>): Promise<ServiceResponse> => {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .insert(booking)
      .select(`
        *,
        customers (name),
        rooms (room_number, type)
      `)
      .single();
    
    if (error) throw error;
    
    return {
      success: true,
      data
    };
  } catch (error: any) {
    console.error('Error al crear reserva:', error.message);
    return {
      success: false,
      message: error.message
    };
  }
};

/**
 * Actualiza una reserva existente
 */
export const updateBooking = async (id: number, booking: Partial<Booking>): Promise<ServiceResponse> => {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .update(booking)
      .eq('id', id)
      .select(`
        *,
        customers (name),
        rooms (room_number, type)
      `)
      .single();
    
    if (error) throw error;
    
    return {
      success: true,
      data
    };
  } catch (error: any) {
    console.error('Error al actualizar reserva:', error.message);
    return {
      success: false,
      message: error.message
    };
  }
};

/**
 * Elimina una reserva
 */
export const deleteBooking = async (id: number): Promise<ServiceResponse> => {
  try {
    const { error } = await supabase
      .from('bookings')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    return {
      success: true
    };
  } catch (error: any) {
    console.error('Error al eliminar reserva:', error.message);
    return {
      success: false,
      message: error.message
    };
  }
};

/**
 * Obtiene las reservas por habitación
 */
export const getBookingsByRoom = async (roomId: number): Promise<ServiceResponse> => {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .select(`
        *,
        customers (name),
        rooms (room_number, type)
      `)
      .eq('room_id', roomId)
      .order('start_date', { ascending: true });
    
    if (error) throw error;
    
    return {
      success: true,
      data
    };
  } catch (error: any) {
    console.error('Error al obtener reservas por habitación:', error.message);
    return {
      success: false,
      message: error.message
    };
  }
};

/**
 * Obtiene las reservas por cliente
 */
export const getBookingsByCustomer = async (customerId: number): Promise<ServiceResponse> => {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .select(`
        *,
        customers (name),
        rooms (room_number, type)
      `)
      .eq('customer_id', customerId)
      .order('start_date', { ascending: true });
    
    if (error) throw error;
    
    return {
      success: true,
      data
    };
  } catch (error: any) {
    console.error('Error al obtener reservas por cliente:', error.message);
    return {
      success: false,
      message: error.message
    };
  }
};

/**
 * Verifica si una habitación está disponible en un rango de fechas
 */
export const checkRoomAvailability = async (
  roomId: number, 
  startDate: string, 
  endDate: string, 
  excludeBookingId?: number
): Promise<ServiceResponse> => {
  try {
    let query = supabase
      .from('bookings')
      .select('id')
      .eq('room_id', roomId)
      .eq('state', 'confirmada')
      .or(`start_date.lte.${endDate},end_date.gte.${startDate}`);
    
    if (excludeBookingId) {
      query = query.neq('id', excludeBookingId);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    
    return {
      success: true,
      data: {
        isAvailable: data.length === 0,
        conflictingBookings: data
      }
    };
  } catch (error: any) {
    console.error('Error al verificar disponibilidad:', error.message);
    return {
      success: false,
      message: error.message
    };
  }
};