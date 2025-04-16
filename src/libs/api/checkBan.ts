"use server";

import dbConnect from "../db/dbConnect";
import BanIssue from "../db/models/BanIssue";

export async function checkBanAPI(id: string) {
  await dbConnect();
  try {
    const banIssue = await BanIssue.countDocuments({
      user: id,
      endDate: { $gt: new Date() },
      isResolved: false,
    });
    return { success: true, isBanned: !!banIssue };
  } catch (error) {
    console.error(error);
  }
  return { success: false };
}
