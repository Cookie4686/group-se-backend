"use server";

import { auth } from "@/auth";
import dbConnect from "@/libs/db/dbConnect";
import BanAppeal from "@/libs/db/models/BanAppeal";
import { z } from "zod";
import BanIssue from "./db/models/BanIssue";

const BanAppealSchema = z.object({
  banIssue: z.string(),
  description: z.string().max(500, { message: "Description can not be more than 500 characters" }),
});
export async function CreateBanAppeal(formState: unknown, formData: FormData) {
  const session = await auth();
  if (!session) return { success: false, message: "unauthorized" };
  const data = Object.fromEntries(formData.entries());
  const validatedFields = await BanAppealSchema.safeParseAsync(data);
  if (validatedFields.success) {
    await dbConnect();
    try {
      const banIssue = (await BanIssue.findById(validatedFields.data.banIssue))?.toObject();
      if (!banIssue) return { success: false, message: "ban issue not found" };
      if (session.user.id != banIssue._id)
        return { success: false, message: "You are not this ban issue target" };
      const banAppeal = await BanAppeal.insertOne(validatedFields.data);
      if (banAppeal) {
        return { success: true, data: banAppeal };
      }
    } catch (err) {
      console.error(err);
    }
    return { success: false };
  }
  return { success: false, error: validatedFields.error.flatten(), data };
}
