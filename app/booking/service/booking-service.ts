import { Booking } from "@/lib/models";
import { createClient } from "@/lib/supabase/client";

const supabase = createClient();
const TABLE = "bookings";

export async function getBookings() {
  const { data, error } = await supabase.from(TABLE).select("*");
  if (error) return { success: false, message: error.message };
  return { success: true, data };
}

export async function createBooking(booking: Omit<Booking, "id">) {
  const { data, error } = await supabase.from(TABLE).insert([booking]).select().single();
  if (error) return { success: false, message: error.message };
  return { success: true, data };
}

export async function updateBooking(id: number, booking: Partial<Booking>) {
  const { data, error } = await supabase.from(TABLE).update(booking).eq("id", id).select().single();
  if (error) return { success: false, message: error.message };
  return { success: true, data };
}

export async function deleteBooking(id: number) {
  const { error } = await supabase.from(TABLE).delete().eq("id", id);
  if (error) return { success: false, message: error.message };
  return { success: true };
}