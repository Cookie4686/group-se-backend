import mongoose from "mongoose";
const ReservationSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.ObjectId, ref: "User", required: true },
    coworkingSpace: { type: mongoose.Schema.ObjectId, ref: "CoworkingSpace", required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    personCount: { type: Number, required: true },
    approvalStatus: { type: String, enum: ["pending", "canceled", "approved", "rejected"], default: "pending" },
    createdAt: { type: Date, default: Date.now },
});
const model = mongoose.model("Reservation", ReservationSchema);
export default model;
