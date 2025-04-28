import { RequestHandler } from "express";
import dbConnect from "../dbConnect.js";
import CoworkingSpace, { CoworkingSpaceType } from "../models/CoworkingSpace.js";
import Reservation from "../models/Reservation.js";
import { UserType } from "../models/User.js";

/**
 * "admin": Admin or coworkingSpace's Owner (view, edit, delete)
 *
 * "user": Normal User
 */
type CoworkingSpacePrivilage = "admin" | "user";
function getPrivilage(coworkingSpace: CoworkingSpaceType, user: UserType | null): CoworkingSpacePrivilage {
  return user && (user.role == "admin" || user.id == coworkingSpace.owner) ? "admin" : "user";
}

export const getCoWorkingSpaces: RequestHandler = async (req, res) => {
  await dbConnect();
  try {
    const [total, coworkingSpaces] = await Promise.all([
      CoworkingSpace.countDocuments(),
      CoworkingSpace.find(),
    ]);
    if (coworkingSpaces) {
      res.status(200).json({
        success: true,
        total: total,
        count: coworkingSpaces.length,
        data: coworkingSpaces.map((e) => ({ ...e.toObject(), privilage: getPrivilage(e, req.user!) })),
      });
      return;
    }
  } catch (error) {
    console.error(error);
  }
  res.status(500).json({ success: false });
};

export const getCoWorkingSpace: RequestHandler = async (req, res) => {
  await dbConnect();
  try {
    const coWorkingSpace = await CoworkingSpace.findById(req.params.id);
    if (coWorkingSpace) {
      res.status(200).json({ success: true, data: coWorkingSpace });
    } else {
      res.status(400).json({ success: false });
    }
  } catch (err) {
    res.status(500).json({ success: false });
  }
};

export const createCoWorkingSpace: RequestHandler = async (req, res) => {
  await dbConnect();
  try {
    const coworkingSpace = await CoworkingSpace.insertOne({ ...req.body, owner: req.user!.id });
    if (coworkingSpace) {
      res.status(201).json({ success: true, data: coworkingSpace });
      return;
    }
  } catch (error) {
    console.error(error);
  }
  res.status(500).json({ success: false });
};

export const updateCoWorkingSpace: RequestHandler = async (req, res) => {
  await dbConnect();
  try {
    const coWorkingSpace = await CoworkingSpace.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidator: true,
    });

    if (coWorkingSpace) {
      res.status(200).json({ success: true, data: coWorkingSpace });
    } else {
      res.status(404).json({ successs: false });
    }
  } catch (err) {
    res.status(500).json({ success: false });
  }
};

export const deleteCoWorkingSpace: RequestHandler = async (req, res) => {
  await dbConnect();
  try {
    const coWorkingSpace = await CoworkingSpace.findById(req.params.id);
    if (coWorkingSpace) {
      await Reservation.deleteMany({ coWorkingSpace: req.params.id });
      await CoworkingSpace.deleteOne({ _id: req.params.id });
      res.status(200).json({ success: true });
    } else {
      res.status(404).json({ success: false });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false });
  }
};
