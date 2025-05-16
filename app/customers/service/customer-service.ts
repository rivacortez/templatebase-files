import { Customer } from '@/lib/models';
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
 * Obtiene todos los clientes
 */
export const getCustomers = async (): Promise<ServiceResponse> => {
  try {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .order('id', { ascending: true });
    
    if (error) throw error;
    
    return {
      success: true,
      data
    };
  } catch (error: any) {
    console.error('Error al obtener clientes:', error.message);
    return {
      success: false,
      message: error.message
    };
  }
};

/**
 * Crea un nuevo cliente
 */
export const createCustomer = async (customer: Omit<Customer, 'id'>): Promise<ServiceResponse> => {
  try {
    const { data, error } = await supabase
      .from('customers')
      .insert(customer)
      .select()
      .single();
    
    if (error) throw error;
    
    return {
      success: true,
      data
    };
  } catch (error: any) {
    console.error('Error al crear cliente:', error.message);
    return {
      success: false,
      message: error.message
    };
  }
};

/**
 * Actualiza un cliente existente
 */
export const updateCustomer = async (id: number, customer: Partial<Customer>): Promise<ServiceResponse> => {
  try {
    const { data, error } = await supabase
      .from('customers')
      .update(customer)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    return {
      success: true,
      data
    };
  } catch (error: any) {
    console.error('Error al actualizar cliente:', error.message);
    return {
      success: false,
      message: error.message
    };
  }
};

/**
 * Elimina un cliente
 */
export const deleteCustomer = async (id: number): Promise<ServiceResponse> => {
  try {
    const { error } = await supabase
      .from('customers')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    return {
      success: true
    };
  } catch (error: any) {
    console.error('Error al eliminar cliente:', error.message);
    return {
      success: false,
      message: error.message
    };
  }
};