import mongoose from "mongoose";

const BanAppealSchema = new mongoose.Schema(
  {
    banIssue: { type: mongoose.Schema.ObjectId, ref: "BanIssue", required: true },
    description: {
      type: String,
      required: true,
      maxlength: [500, "Description can not be more than 500 characters"],
    },
    createdAt: { type: Date, default: Date.now },
    resolveStatus: { type: String, enum: ["pending", "denied", "resolved"], default: "pending" },
    resolvedAt: { type: Date },
    comment: [
      new mongoose.Schema({
        user: { type: mongoose.Schema.ObjectId, ref: "User", required: true },
        text: {
          type: String,
          required: true,
          maxlength: [500, "Comment can not be more than 500 characters"],
        },
        createdAt: { type: Date, default: Date.now },
      }),
    ],
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

const model = mongoose.model("BanAppeal", BanAppealSchema);
export type BanAppealType = InstanceType<typeof model>;

export default model;
