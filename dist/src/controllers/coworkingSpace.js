import dbConnect from "../dbConnect.js";
import CoworkingSpace from "../models/CoworkingSpace.js";
import Reservation from "../models/Reservation.js";
function getPrivilage(user, coworkingSpace) {
    return user && (user.role == "admin" || user.id == coworkingSpace.owner) ? "admin" : "user";
}
export const getCoWorkingSpaces = async (req, res, next) => {
    await dbConnect();
};
export const getCoWorkingSpace = async (req, res, next) => {
    await dbConnect();
    try {
        const coWorkingSpace = await CoworkingSpace.findById(req.params.id);
        if (coWorkingSpace) {
            res.status(200).json({ success: true, data: coWorkingSpace });
        }
        else {
            res.status(400).json({ success: false });
        }
    }
    catch (err) {
        res.status(500).json({ success: false });
    }
};
export const createCoWorkingSpace = async (req, res, next) => {
    await dbConnect();
    const coWorkingSpace = await CoworkingSpace.create(req.body);
    res.status(201).json({ success: true, data: coWorkingSpace });
};
export const updateCoWorkingSpace = async (req, res, next) => {
    await dbConnect();
    try {
        const coWorkingSpace = await CoworkingSpace.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidator: true,
        });
        if (coWorkingSpace) {
            res.status(200).json({ success: true, data: coWorkingSpace });
        }
        else {
            res.status(400).json({ successs: false });
        }
    }
    catch (err) {
        res.status(500).json({ success: false });
    }
};
export const deleteCoWorkingSpace = async (req, res, next) => {
    await dbConnect();
    try {
        const coWorkingSpace = await CoworkingSpace.findById(req.params.id);
        if (coWorkingSpace) {
            await Reservation.deleteMany({ coWorkingSpace: req.params.id });
            await CoworkingSpace.deleteOne({ _id: req.params.id });
            res.status(200).json({ success: true, data: {} });
        }
        else {
            res
                .status(404)
                .json({ success: false, message: `Co-working space not found with id of ${req.params.id}` });
        }
    }
    catch (err) {
        res.status(400).json({ success: false });
    }
};
