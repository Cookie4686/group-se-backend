import mongoose from "mongoose";
import { BanIssueType } from "./db/models/BanIssue";

export const ActiveBanFilter: mongoose.FilterQuery<BanIssueType> = {
  endDate: { $gt: new Date() },
  isResolved: false,
};
