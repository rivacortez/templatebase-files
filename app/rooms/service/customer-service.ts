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

/**
 * Obtiene todos los clientes
 */
export const getCustomers = async (): Promise<ServiceResponse> => {
  try {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .order('name', { ascending: true });
    
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