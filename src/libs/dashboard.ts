import { auth } from "@/auth";
import { getCoworkingSpaceFrequencyDB, getCoworkingSpaceTotalReservationDB } from "./db/dashboard";

export async function getCoworkingSpaceTotalReservation(id: string) {
  const session = await auth();
  if (!session) return { success: false, message: "not logged in" };
  try {
    const result = await getCoworkingSpaceTotalReservationDB(undefined, id);
    if (result) return { success: true, data: result };
  } catch (error) {
    console.error(error);
  }
  return { success: false };
}

export async function getCoworkingSpaceFrequency(id: string) {
  const session = await auth();
  if (!session) return { success: false, message: "not logged in" };
  try {
    const result = await getCoworkingSpaceFrequencyDB(undefined, id);
    if (result) return { success: true, data: result };
  } catch (error) {
    console.error(error);
  }
  return { success: false };
}
