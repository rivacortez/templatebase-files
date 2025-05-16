import { Room } from '@/lib/models';
import { createClient } from '@supabase/supabase-js';

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

// Funciones del servicio

/**
 * Obtiene todas las habitaciones
 */
export const getRooms = async (): Promise<ServiceResponse> => {
  try {
    const { data, error } = await supabase
      .from('rooms')
      .select('*')
      .order('id', { ascending: true });
    
    if (error) throw error;
    
    return {
      success: true,
      data
    };
  } catch (error: any) {
    console.error('Error al obtener habitaciones:', error.message);
    return {
      success: false,
      message: error.message
    };
  }
};

/**
 * Crea una nueva habitación
 */
export const createRoom = async (room: Omit<Room, 'id'>): Promise<ServiceResponse> => {
  try {
    const { data, error } = await supabase
      .from('rooms')
      .insert(room)
      .select()
      .single();
    
    if (error) throw error;
    
    return {
      success: true,
      data
    };
  } catch (error: any) {
    console.error('Error al crear habitación:', error.message);
    return {
      success: false,
      message: error.message
    };
  }
};

/**
 * Actualiza una habitación existente
 */
export const updateRoom = async (id: number, room: Partial<Room>): Promise<ServiceResponse> => {
  try {
    const { data, error } = await supabase
      .from('rooms')
      .update(room)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    return {
      success: true,
      data
    };
  } catch (error: any) {
    console.error('Error al actualizar habitación:', error.message);
    return {
      success: false,
      message: error.message
    };
  }
};

/**
 * Elimina una habitación
 */
export const deleteRoom = async (id: number): Promise<ServiceResponse> => {
  try {
    const { error } = await supabase
      .from('rooms')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    return {
      success: true
    };
  } catch (error: any) {
    console.error('Error al eliminar habitación:', error.message);
    return {
      success: false,
      message: error.message
    };
  }
};