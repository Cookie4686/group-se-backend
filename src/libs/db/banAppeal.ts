import mongoose from "mongoose";
import BanAppeal, { BanAppealType, Comment } from "./models/BanAppeal";
import { BanIssueType } from "./models/BanIssue";
import { UserType } from "./models/User";
import { unstable_cache } from "next/cache";
import dbConnect from "./dbConnect";

export async function getBanAppealDB(id: string) {
  return unstable_cache(
    async (id: string) => {
      await dbConnect();
      return (
        await BanAppeal.aggregate<
          | (Omit<Omit<BanAppealType, "banIssue">, "comment"> & {
              banIssue: BanIssueType;
              comment: (Omit<Comment, "user"> & { user: UserType })[];
            })
          | undefined
        >([
          { $match: { _id: mongoose.Types.ObjectId.createFromHexString(id) } },
          { $lookup: { from: "banissues", localField: "banIssue", foreignField: "_id", as: "banIssue" } },
          { $set: { banIssue: { $arrayElemAt: ["$banIssue", 0] } } },
          {
            $set: {
              _id: { $toString: "$_id" },
              "banIssue._id": { $toString: "$banIssue._id" },
              "banIssue.user": { $toString: "$banIssue.user" },
              "banIssue.admin": { $toString: "$banIssue.admin" },
            },
          },
          { $unwind: { path: "$comment", preserveNullAndEmptyArrays: true } },
          { $lookup: { from: "users", localField: "comment.user", foreignField: "_id", as: "comment.user" } },
          { $set: { "comment.user": { $arrayElemAt: ["$comment.user", 0] } } },
          {
            $set: {
              "comment._id": { $toString: "$comment._id" },
              "comment.user._id": { $toString: "$comment.user._id" },
            },
          },
          {
            $group: {
              _id: { $unsetField: { field: "comment", input: "$$ROOT" } },
              comment: { $push: "$comment" },
            },
          },
          { $replaceRoot: { newRoot: { $mergeObjects: ["$_id", { comment: "$comment" }] } } },
          {
            $set: {
              comment: {
                $cond: [
                  { $eq: [{ $getField: { field: "_id", input: { $arrayElemAt: ["$comment", 0] } } }, null] },
                  [],
                  "$comment",
                ],
              },
            },
          },
          { $project: { _id: 0 } },
        ])
      )[0];
    },
    undefined,
    { tags: [`banAppeal-${id}`], revalidate: 450 }
  )(id);
}
