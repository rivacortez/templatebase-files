import { createClient } from '@supabase/supabase-js';
import { Database } from './database.types';

// Inicialización del cliente Supabase usando variables de entorno
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_KEY || '';

// Creación del cliente de Supabase
export const supabase = createClient<Database>(supabaseUrl, supabaseKey);

// Servicios para interactuar con las tablas

// Servicio para Inventory
export const inventoryService = {
  getAll: async () => {
    const { data, error } = await supabase.from('inventory').select('*');
    if (error) throw error;
    return data;
  },
  getById: async (id: number) => {
    const { data, error } = await supabase.from('inventory').select('*').eq('id', id).single();
    if (error) throw error;
    return data;
  },
  create: async (inventory: Omit<any, 'id'>) => {
    const { data, error } = await supabase.from('inventory').insert(inventory).select();
    if (error) throw error;
    return data[0];
  },
  update: async (id: number, inventory: Partial<any>) => {
    const { data, error } = await supabase.from('inventory').update(inventory).eq('id', id).select();
    if (error) throw error;
    return data[0];
  },
  delete: async (id: number) => {
    const { error } = await supabase.from('inventory').delete().eq('id', id);
    if (error) throw error;
    return true;
  }
};

// Servicio para Rooms
export const roomsService = {
  getAll: async () => {
    const { data, error } = await supabase.from('rooms').select('*');
    if (error) throw error;
    return data;
  },
  getById: async (id: number) => {
    const { data, error } = await supabase.from('rooms').select('*').eq('id', id).single();
    if (error) throw error;
    return data;
  },
  create: async (room: Omit<any, 'id'>) => {
    const { data, error } = await supabase.from('rooms').insert(room).select();
    if (error) throw error;
    return data[0];
  },
  update: async (id: number, room: Partial<any>) => {
    const { data, error } = await supabase.from('rooms').update(room).eq('id', id).select();
    if (error) throw error;
    return data[0];
  },
  delete: async (id: number) => {
    const { error } = await supabase.from('rooms').delete().eq('id', id);
    if (error) throw error;
    return true;
  }
};

// Servicio para Customers
export const customersService = {
  getAll: async () => {
    const { data, error } = await supabase.from('customers').select('*');
    if (error) throw error;
    return data;
  },
  getById: async (id: number) => {
    const { data, error } = await supabase.from('customers').select('*').eq('id', id).single();
    if (error) throw error;
    return data;
  },
  create: async (customer: Omit<any, 'id'>) => {
    const { data, error } = await supabase.from('customers').insert(customer).select();
    if (error) throw error;
    return data[0];
  },
  update: async (id: number, customer: Partial<any>) => {
    const { data, error } = await supabase.from('customers').update(customer).eq('id', id).select();
    if (error) throw error;
    return data[0];
  },
  delete: async (id: number) => {
    const { error } = await supabase.from('customers').delete().eq('id', id);
    if (error) throw error;
    return true;
  }
};

// Servicio para Bookings
export const bookingsService = {
  getAll: async () => {
    const { data, error } = await supabase.from('bookings').select('*');
    if (error) throw error;
    return data;
  },
  getById: async (id: number) => {
    const { data, error } = await supabase.from('bookings').select('*').eq('id', id).single();
    if (error) throw error;
    return data;
  },
  create: async (booking: Omit<any, 'id'>) => {
    const { data, error } = await supabase.from('bookings').insert(booking).select();
    if (error) throw error;
    return data[0];
  },
  update: async (id: number, booking: Partial<any>) => {
    const { data, error } = await supabase.from('bookings').update(booking).eq('id', id).select();
    if (error) throw error;
    return data[0];
  },
  delete: async (id: number) => {
    const { error } = await supabase.from('bookings').delete().eq('id', id);
    if (error) throw error;
    return true;
  }
};

// Servicio para BookingInventory
export const bookingInventoryService = {
  getByBookingId: async (bookingId: number) => {
    const { data, error } = await supabase
      .from('booking_inventory')
      .select('*')
      .eq('booking_id', bookingId);
    if (error) throw error;
    return data;
  },
  create: async (bookingInventory: any) => {
    const { data, error } = await supabase
      .from('booking_inventory')
      .insert(bookingInventory)
      .select();
    if (error) throw error;
    return data[0];
  },
  update: async (bookingId: number, inventoryId: number, quantity: number) => {
    const { data, error } = await supabase
      .from('booking_inventory')
      .update({ quantity })
      .eq('booking_id', bookingId)
      .eq('inventory_id', inventoryId)
      .select();
    if (error) throw error;
    return data[0];
  },
  delete: async (bookingId: number, inventoryId: number) => {
    const { error } = await supabase
      .from('booking_inventory')
      .delete()
      .eq('booking_id', bookingId)
      .eq('inventory_id', inventoryId);
    if (error) throw error;
    return true;
  }
};