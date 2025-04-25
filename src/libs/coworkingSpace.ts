"use server";

import { revalidateTag, unstable_cache } from "next/cache";
import { FilterQuery } from "mongoose";
import { z } from "zod";
import { auth } from "@/auth";
import dbConnect from "./db/dbConnect";
import CoworkingSpace, { CWS } from "./db/models/CoworkingSpace";
import Reservation from "./db/models/Reservation";
import provinceData from "@/province";
import { Session } from "next-auth";

const NotLoggedInText = "You are not logged in";

/**
 * "user": Normal User or Guest (view)
 *
 * "admin": Admin or coworkingSpace's Owner (view, edit, delete)
 */
type CoworkingSpacePrivilage = "admin" | "user";

function getPrivilage(coworkingSpace: CWS, session?: Session | null): CoworkingSpacePrivilage {
  return session && (session.user.role == "admin" || session.user.id == coworkingSpace.owner) ?
      "admin"
    : "user";
}

export async function getCoworkingSpaces<T extends CoworkingSpacePrivilage>(
  filter: FilterQuery<CWS> = {},
  page: number = 0,
  limit: number = 15,
  session: T extends "admin" ? Session : Session | undefined | null,
  privilage?: T
) {
  if (privilage == "admin" && session) {
    filter = { ...filter, ...(session.user.role != "admin" ? { owner: session.user.id } : {}) };
  }
  try {
    const result = await unstable_cache(
      async () => {
        await dbConnect();
        const [total, coworkingSpaces] = await Promise.all([
          CoworkingSpace.countDocuments(filter),
          CoworkingSpace.find(filter, {}, { skip: page * limit, limit }),
        ]);
        return { total, data: coworkingSpaces.map((e) => e.toObject()) };
      },
      [JSON.stringify(filter), page.toString(), limit.toString()],
      { tags: ["coworkingSpaces"], revalidate: 60 }
    )();
    if (result) {
      return {
        success: true,
        total: result.total,
        count: result.data.length,
        data: result.data.map((e) => ({ ...e, privilage: privilage || getPrivilage(e, session) })),
        session,
      };
    }
  } catch (error) {
    console.error(error);
  }
  return { success: false };
}

export async function getCoworkingSpace(id: string, session?: Session | null) {
  try {
    const result = await unstable_cache(
      async () => {
        await dbConnect();
        return (await CoworkingSpace.findById(id))?.toObject();
      },
      [id],
      { tags: ["coworkingSpaces"], revalidate: 300 }
    )();
    if (result) return { success: true, data: { ...result, privilage: getPrivilage(result, session) } };
  } catch (err) {
    console.error(err);
  }
  return { success: false };
}

const editableFields = {
  name: z.string().max(50, { message: "Name can not be more than 50 characters" }),
  description: z.string().max(250, { message: "Description can not be more than 250 characters" }),
  openTime: z.string().datetime(),
  closeTime: z.string().datetime(),
  tel: z.string().optional(),
  picture: z.string().url("Please enter a valid url").optional(),
};

const CreateCoworkingSpaceForm = z
  .object({
    ...editableFields,
    address: z.string(),
    province: z.string(),
    district: z.string(),
    subDistrict: z.string(),
    postalcode: z.string().max(5, { message: "Postal code can not be more than 5 digits" }),
  })
  // TODO: Refactor to use superRefine for more error information
  .refine(
    (schema) =>
      provinceData.find(
        (e) =>
          e.name == schema.province
          && e.amphure.find(
            (e) =>
              e.name == schema.district
              && e.tambon.find(
                (e) => e.name == schema.subDistrict && e.postalCode.toString() == schema.postalcode
              )
          )
      ),
    { message: "Invalid address data" }
  );

export async function createCoworkingSpace(formState: unknown, formData: FormData) {
  const session = await auth();
  if (!session) return { success: false, message: NotLoggedInText };
  const data = Object.fromEntries(formData.entries());
  const validatedFields = await CreateCoworkingSpaceForm.safeParseAsync(data);
  if (validatedFields.success) {
    await dbConnect();
    try {
      const coworkingSpace = await CoworkingSpace.create({ ...validatedFields.data, owner: session.user.id });
      if (coworkingSpace) {
        revalidateTag("coworkingSpaces");
        return { success: true, data: coworkingSpace.toObject() };
      }
    } catch (error) {
      // TODO: Show error message from database to user
      console.error(error);
    }
    return { success: false, data };
  }
  return { success: false, error: validatedFields.error.flatten(), data };
}

const EditCoworkingSpaceForm = z.object(editableFields);
export async function editCoworkingSpace(formState: unknown, formData: FormData) {
  const session = await auth();
  if (!session) return { success: false, message: NotLoggedInText };
  const id = formData.get("id")?.toString();
  if (!id) return { success: false, message: "Invalid input (111)" };
  const data = Object.fromEntries(formData.entries());
  const validatedFields = await EditCoworkingSpaceForm.safeParseAsync(data);
  if (!validatedFields.success) return { success: false, error: validatedFields.error.flatten(), data };
  await dbConnect();
  try {
    const coworkingSpace = (await CoworkingSpace.findById(id))?.toObject();
    if (!coworkingSpace) return { success: false, message: "Coworking Space not found", data };
    const privilage = getPrivilage(coworkingSpace, session);
    if (privilage != "admin") return { success: false, message: "No Permission", data };
    const updatedCoworkingSpace = (
      await CoworkingSpace.findByIdAndUpdate(id, validatedFields.data, { new: true, runValidator: true })
    )?.toObject();
    if (updatedCoworkingSpace) {
      revalidateTag("coworkingSpaces");
      return { success: true, data: updatedCoworkingSpace, permission: privilage };
    }
  } catch (error) {
    // TODO: Show error message from database to user
    console.error(error);
  }
  return { success: false };
}

export async function deleteCoworkingSpace(id: string) {
  const session = await auth();
  if (!session) return { success: false, message: NotLoggedInText };
  await dbConnect();
  try {
    const coworkingSpace = (await CoworkingSpace.findById(id))?.toObject();
    if (!coworkingSpace) return { success: false, message: "Coworking Space not found" };
    if (getPrivilage(coworkingSpace, session) != "admin") return { success: false, message: "No Permission" };
    const [coworkingResult, reservationsResult] = await Promise.all([
      CoworkingSpace.deleteOne({ _id: id }),
      Reservation.deleteMany({ coworkingSpace: id }),
    ]);
    if (coworkingResult.acknowledged || reservationsResult.acknowledged) {
      if (coworkingResult.acknowledged) revalidateTag("coworkingSpaces");
      if (reservationsResult.acknowledged) revalidateTag("reservations");
      if (coworkingResult.acknowledged != reservationsResult.acknowledged)
        console.error("FATAL: Data is not in sync");
      return { success: true };
    }
  } catch (error) {
    console.error(error);
  }
  return { success: false };
}
