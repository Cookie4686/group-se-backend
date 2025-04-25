"use server";

import { z } from "zod";
import { auth } from "@/auth";
import dbConnect from "./db/dbConnect";
import User, { UserType } from "./db/models/User";
import BanIssue, { type BanIssueType as BanIssueType } from "./db/models/BanIssue";
import { revalidateTag } from "next/cache";
import mongoose from "mongoose";
import { getBanIssuesDB, getBanIssueDB } from "./db/banIssue";
import { validateRegex } from "@/utils";
import { Session } from "next-auth";

/**
 * "admin": System Admin (view, create, edit)
 *
 * "target": Ban issue's target User (view)
 *
 * "user": Other User or Guest (none)
 */
type BanIssuePrivilege = "admin" | "target" | "user";

function getPrivilege(
  banIssue: Omit<Omit<BanIssueType, "user">, "admin"> & { user: UserType; admin: UserType },
  session?: Session | null
): BanIssuePrivilege {
  return (
    session ?
      session.user.id == banIssue.user._id ? "target"
      : session.user.role == "admin" ? "admin"
      : "user"
    : "user"
  );
}

export async function getBanIssues(
  filter: mongoose.FilterQuery<BanIssueType> = {},
  page: number = 0,
  limit: number = 5,
  search: string = "",
  session: Session,
  userID?: string
) {
  if (userID || session.user.role !== "admin") {
    filter.user = mongoose.Types.ObjectId.createFromHexString(userID || session.user.id);
  }
  try {
    const { data, total } = await getBanIssuesDB(filter, page, limit, validateRegex(search));
    return { success: true, total, count: data.length, data };
  } catch (err) {
    console.error(err);
  }
  return { success: false };
}

export async function getBanIssue(id: string, session: Session) {
  try {
    const result = await getBanIssueDB(id);
    if (!result) return { success: false, message: "Ban Issue not found" };
    const privilege = getPrivilege(result.banIssue, session);
    if (privilege == "user") return { success: false, message: "No permission to view this ban issue" };
    return { success: true, data: result, privilege };
  } catch (error) {
    console.log(error);
  }
  return { success: false };
}

const BanIssueSchema = z.object({
  user: z.string(),
  title: z.string().max(50, { message: "Title can not be more than 50 characters" }),
  description: z.string().max(500, { message: "Description can not be more than 500 characters" }),
  endDate: z.string().datetime(),
});
export async function createBanIssue(formState: unknown, formData: FormData) {
  const session = await auth();
  if (!session || session.user.role != "admin") return { success: false, message: "Not authorized" };
  const data = Object.fromEntries(formData.entries());
  const validatedFields = await BanIssueSchema.safeParseAsync(data);
  if (validatedFields.success) {
    if (new Date(validatedFields.data.endDate) <= new Date(Date.now())) {
      return { success: false, message: "You cannot pick time in the past" };
    }
    await dbConnect();
    try {
      const user = await User.findOne({ email: validatedFields.data.user });
      if (!user) return { success: false, message: "user not found", data };
      const isBanned = await BanIssue.countDocuments({
        user: user._id,
        endDate: { $gt: new Date() },
        isResolved: false,
      });
      if (isBanned > 0) return { success: false, message: "user is already banned", data };

      const banIssue = await BanIssue.insertOne({
        ...validatedFields.data,
        user: user._id,
        admin: session.user.id,
      });
      if (banIssue) {
        revalidateTag("banIssues");
        return { success: true, data: banIssue.toObject() };
      }
    } catch (err) {
      console.error(err);
    }
    return { success: false };
  }
  return { success: false, error: validatedFields.error.flatten(), data };
}

export async function resolveBanIssue(formState: unknown, formData: FormData) {
  const session = await auth();
  if (!session || session.user.role != "admin") return { success: false, message: "unauthorized" };
  const id = formData.get("id")?.toString();
  if (!id) return { success: false, message: "Invalid input" };
  await dbConnect();
  try {
    const banIssue = await BanIssue.findByIdAndUpdate(
      id,
      { isResolved: true },
      { new: true, runValidators: true }
    );
    if (banIssue) {
      revalidateTag("banIssues");
      revalidateTag(`banIssues-${id}`);
      return { success: true, data: banIssue.toObject() };
    }
  } catch (err) {
    console.error(err);
  }
  return { success: false };
}

export async function resolveExpiredBan() {
  try {
    await dbConnect();
    const result = await BanIssue.updateMany({ isResolved: false, endDate: { $lte: Date.now() } }, [
      { $set: { isResolved: true, resolvedAt: "$endDate" } },
    ]);
    if (result.matchedCount) {
      revalidateTag("banIssues");
    }
    return { success: true };
  } catch (error) {
    return { success: false, message: error };
  }
}
