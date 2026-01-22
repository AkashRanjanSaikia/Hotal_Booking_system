"use server";

import { revalidatePath } from "next/cache";

export async function revalidateHotels(hotelId) {
  revalidatePath("/hotels");
  
  revalidatePath("/manager/dashboard");
  if (hotelId) {
    revalidatePath(`/hotels/${hotelId}`);
  }
}
