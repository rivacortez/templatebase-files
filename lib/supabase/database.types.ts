export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      inventory: {
        Row: {
          id: number
          name: string
          type: string
          unit_price: number
          stock: number
        }
        Insert: {
          id?: number
          name: string
          type: string
          unit_price: number
          stock: number
        }
        Update: {
          id?: number
          name?: string
          type?: string
          unit_price?: number
          stock?: number
        }
      }
      rooms: {
        Row: {
          id: number
          customer_id: number
          room_number: string
          type: string
          capacity: number
          price: number
          state: string
        }
        Insert: {
          id?: number
          customer_id: number
          room_number: string
          type: string
          capacity: number
          price: number
          state: string
        }
        Update: {
          id?: number
          customer_id?: number
          room_number?: string
          type?: string
          capacity?: number
          price?: number
          state?: string
        }
      }
      customers: {
        Row: {
          id: number
          name: string
          contact_name: string
          phone: string
          email: string
          address: string
          state: string
        }
        Insert: {
          id?: number
          name: string
          contact_name: string
          phone: string
          email: string
          address: string
          state: string
        }
        Update: {
          id?: number
          name?: string
          contact_name?: string
          phone?: string
          email?: string
          address?: string
          state?: string
        }
      }
      bookings: {
        Row: {
          id: number
          customer_id: number
          room_id: number
          start_date: string
          end_date: string
          total_price: number
          state: string
        }
        Insert: {
          id?: number
          customer_id: number
          room_id: number
          start_date: string
          end_date: string
          total_price: number
          state: string
        }
        Update: {
          id?: number
          customer_id?: number
          room_id?: number
          start_date?: string
          end_date?: string
          total_price?: number
          state?: string
        }
      }
      booking_inventory: {
        Row: {
          booking_id: number
          inventory_id: number
          quantity: number
        }
        Insert: {
          booking_id: number
          inventory_id: number
          quantity: number
        }
        Update: {
          booking_id?: number
          inventory_id?: number
          quantity?: number
        }
      }
    }
  }
}