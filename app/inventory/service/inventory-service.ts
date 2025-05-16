import { Inventory } from '@/lib/models';
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
 * Obtiene todos los elementos del inventario
 */
export const getInventoryItems = async (): Promise<ServiceResponse> => {
  try {
    const { data, error } = await supabase
      .from('inventory')
      .select('*')
      .order('id', { ascending: true });
    
    if (error) throw error;
    
    return {
      success: true,
      data
    };
  } catch (error: any) {
    console.error('Error al obtener inventario:', error.message);
    return {
      success: false,
      message: error.message
    };
  }
};

/**
 * Crea un nuevo elemento en el inventario
 */
export const createInventoryItem = async (item: Omit<Inventory, 'id'>): Promise<ServiceResponse> => {
  try {
    const { data, error } = await supabase
      .from('inventory')
      .insert(item)
      .select()
      .single();
    
    if (error) throw error;
    
    return {
      success: true,
      data
    };
  } catch (error: any) {
    console.error('Error al crear elemento:', error.message);
    return {
      success: false,
      message: error.message
    };
  }
};

/**
 * Actualiza un elemento existente en el inventario
 */
export const updateInventoryItem = async (id: number, item: Partial<Inventory>): Promise<ServiceResponse> => {
  try {
    const { data, error } = await supabase
      .from('inventory')
      .update(item)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    return {
      success: true,
      data
    };
  } catch (error: any) {
    console.error('Error al actualizar elemento:', error.message);
    return {
      success: false,
      message: error.message
    };
  }
};

/**
 * Elimina un elemento del inventario
 */
export const deleteInventoryItem = async (id: number): Promise<ServiceResponse> => {
  try {
    const { error } = await supabase
      .from('inventory')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    return {
      success: true
    };
  } catch (error: any) {
    console.error('Error al eliminar elemento:', error.message);
    return {
      success: false,
      message: error.message
    };
  }
};