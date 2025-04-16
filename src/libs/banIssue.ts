"use server";

import { z } from "zod";
import { auth } from "@/auth";
import dbConnect from "./db/dbConnect";
import User, { User as UserType } from "./db/models/User";
import BanIssue, { type BanIssue as BanIssueType } from "./db/models/BanIssue";
import { revalidateTag, unstable_cache } from "next/cache";
import { FilterQuery } from "mongoose";
import mongoose from "mongoose";

export async function getBanIssues(
  filter: FilterQuery<BanIssueType> = {},
  page: number = 0,
  limit: number = 5,
  search: string = ""
) {
  const session = await auth();
  if (session) {
    if (session.user.role != "admin")
      filter.user = mongoose.Types.ObjectId.createFromHexString(session.user.id);
    return await unstable_cache(
      async () => {
        await dbConnect();
        try {
          const result = (
            await BanIssue.aggregate<{
              data: (BanIssueType & { user: UserType; admin: UserType })[];
              total: number;
            }>([
              { $match: filter },
              {
                $lookup: {
                  from: "users",
                  localField: "user",
                  foreignField: "_id",
                  as: "user",
                  pipeline: [
                    { $match: { $or: [{ name: { $regex: search } }, { email: { $regex: search } }] } },
                  ],
                },
              },
              { $lookup: { from: "users", localField: "admin", foreignField: "_id", as: "admin" } },
              { $match: { user: { $not: { $size: 0 } } } },
              { $set: { user: { $arrayElemAt: ["$user", 0] }, admin: { $arrayElemAt: ["$admin", 0] } } },
              {
                $set: {
                  _id: { $toString: "$_id" },
                  "user._id": { $toString: "$user._id" },
                  "admin._id": { $toString: "$admin._id" },
                },
              },
              { $group: { _id: null, data: { $push: "$$ROOT" }, total: { $count: {} } } },
              { $project: { _id: 0, data: { $slice: ["$data", 0, 5] }, total: 1 } },
            ])
          )[0];
          const data = result?.data || [];
          const total = result?.total || 0;
          return { success: true, total, count: data.length, data };
        } catch (err) {
          console.error(err);
        }
        return { success: false };
      },
      [session.user.role, JSON.stringify(filter), page.toString(), limit.toString(), search],
      { tags: ["banIssues"], revalidate: 300 }
    )();
  }
  return { success: false };
}

export async function getBanIssue(id: string) {
  const session = await auth();
  if (session) {
    return unstable_cache(
      async () => {
        await dbConnect();
        try {
          const banIssue = (
            await BanIssue.findById(id).populate<{ user: UserType; admin: UserType }>(["user", "admin"])
          )?.toObject();
          if (banIssue) {
            if (banIssue.user._id == session.user.id || session.user.role == "admin") {
              return { success: true, data: banIssue };
            }
          } else {
            return { success: false, message: "Ban Issue not found" };
          }
        } catch (error) {
          console.log(error);
        }
        return { success: false };
      },
      [id, session.user.id, session.user.role],
      { tags: ["banIssues"], revalidate: 450 }
    )();
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
    await dbConnect();
    try {
      const user = await User.findOne({ email: validatedFields.data.user });
      if (!user) return { success: false, message: "user not found", data };
      const isBanned = await BanIssue.countDocuments({
        user: user._id,
        endDate: { $gt: new Date() },
        isResolved: false,
      });
      if (isBanned) return { success: false, message: "user is already banned", data };

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

export async function resolveBanIssue(id: string) {
  const session = await auth();
  if (!session || session.user.role != "admin") return { success: false, message: "unauthorized" };
  await dbConnect();
  try {
    const banIssue = await BanIssue.findByIdAndUpdate(
      id,
      { isResolved: true },
      { new: true, runValidators: true }
    );
    if (banIssue) {
      revalidateTag("banIssues");
      return { success: true, data: banIssue.toObject() };
    }
  } catch (err) {
    console.error(err);
  }
  return { success: false };
}
