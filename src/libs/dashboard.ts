import { auth } from "@/auth";
import { getCoworkingSpaceFrequencyDB, getCoworkingSpaceTotalReservationDB } from "./db/dashboard";
import mongoose from "mongoose";
import { ReservationType } from "./db/models/Reservation";

export async function getCoworkingSpaceTotalReservation(
  filter: mongoose.FilterQuery<ReservationType> = {},
  id: string
) {
  const session = await auth();
  if (!session) return { success: false, message: "not logged in" };
  try {
    const result = await getCoworkingSpaceTotalReservationDB(filter, id);
    if (result) return { success: true, data: result };
  } catch (error) {
    console.error(error);
  }
  return { success: false };
}

export async function getCoworkingSpaceFrequency(
  filter: mongoose.FilterQuery<ReservationType> = {},
  id: string
) {
  const session = await auth();
  if (!session) return { success: false, message: "not logged in" };
  try {
    const result = await getCoworkingSpaceFrequencyDB(filter, id);
    if (result) return { success: true, data: result };
  } catch (error) {
    console.error(error);
  }
  return { success: false };
}
