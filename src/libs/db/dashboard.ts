import mongoose from "mongoose";
import { unstable_cache } from "next/cache";
import Reservation, { ReservationType } from "./models/Reservation";
import dbConnect from "./dbConnect";

export async function getCoworkingSpaceTotalReservationDB(
  filter: mongoose.FilterQuery<ReservationType> = {},
  id: string
) {
  return await unstable_cache(
    async () => {
      await dbConnect();
      return (
        await Reservation.aggregate<
          ({ [P in ReservationType["approvalStatus"]]: number } & { total: number }) | undefined
        >([
          {
            $facet: {
              data: [
                { $match: { ...filter, coworkingSpace: mongoose.Types.ObjectId.createFromHexString(id) } },
                { $group: { _id: "$approvalStatus", count: { $count: {} } } },
                {
                  $group: {
                    _id: null,
                    items: { $push: { k: "$_id", v: "$count" } },
                    total: { $sum: "$count" },
                  },
                },
                {
                  $replaceRoot: {
                    newRoot: { $mergeObjects: [{ $arrayToObject: "$items" }, { total: "$total" }] },
                  },
                },
              ],
            },
          },
          { $replaceRoot: { newRoot: { $ifNull: [{ $arrayElemAt: ["$data", 0] }, { total: 0 }] } } },
          {
            $set: {
              approved: { $ifNull: ["$approved", 0] },
              pending: { $ifNull: ["$pending", 0] },
              canceled: { $ifNull: ["$canceled", 0] },
              rejected: { $ifNull: ["$rejected", 0] },
            },
          },
        ])
      )[0];
    },
    [JSON.stringify(filter), id],
    { revalidate: 600 }
  )();
}

export async function getCoworkingSpaceFrequencyDB(
  filter: mongoose.FilterQuery<ReservationType> = {},
  id: string
) {
  return await unstable_cache(
    async () => {
      await dbConnect();
      return (
        await Reservation.aggregate<
          { data: { label: string; data: number[] }[]; label: string[] } | undefined
        >([
          {
            $match: {
              ...filter,
              coworkingSpace: mongoose.Types.ObjectId.createFromHexString(id),
              $expr: { $gt: ["$endDate", "$startDate"] },
            },
          },
          {
            $replaceRoot: {
              newRoot: {
                data: [
                  {
                    _id: "$_id",
                    time: {
                      $dateFromParts: {
                        year: { $year: "$startDate" },
                        month: { $month: "$startDate" },
                        day: { $dayOfMonth: "$startDate" },
                        hour: { $hour: "$startDate" },
                        minute: {
                          $subtract: [{ $minute: "$startDate" }, { $mod: [{ $minute: "$startDate" }, 30] }],
                        },
                      },
                    },
                  },
                  {
                    _id: "$_id",
                    time: {
                      $dateFromParts: {
                        year: { $year: "$endDate" },
                        month: { $month: "$endDate" },
                        day: { $dayOfMonth: "$endDate" },
                        hour: { $hour: "$endDate" },
                        minute: {
                          $subtract: [{ $minute: "$endDate" }, { $mod: [{ $minute: "$endDate" }, 30] }],
                        },
                      },
                    },
                  },
                ],
              },
            },
          },
          { $unwind: { path: "$data" } },
          { $replaceRoot: { newRoot: "$data" } },
          {
            $densify: {
              field: "time",
              partitionByFields: ["_id"],
              range: { step: 30, unit: "minute", bounds: "partition" },
            },
          },
          { $lookup: { from: "reservations", localField: "_id", foreignField: "_id", as: "reservation" } },
          { $unwind: { path: "$reservation" } },
          {
            $group: {
              _id: { $dateFromParts: { year: 1, hour: { $hour: "$time" }, minute: { $minute: "$time" } } },
              approved: { $sum: { $cond: [{ $eq: ["$reservation.approvalStatus", "approved"] }, 1, 0] } },
              rejected: { $sum: { $cond: [{ $eq: ["$reservation.approvalStatus", "rejected"] }, 1, 0] } },
              pending: { $sum: { $cond: [{ $eq: ["$reservation.approvalStatus", "pending"] }, 1, 0] } },
              canceled: { $sum: { $cond: [{ $eq: ["$reservation.approvalStatus", "canceled"] }, 1, 0] } },
            },
          },
          {
            $densify: {
              field: "_id",
              range: {
                step: 30,
                unit: "minute",
                bounds: [new Date("0001-01-01T00:00:00.000Z"), new Date("0001-01-02T00:00:00.000Z")],
              },
            },
          },
          {
            $fill: {
              sortBy: { _id: 1 },
              output: {
                approved: { value: 0 },
                rejected: { value: 0 },
                canceled: { value: 0 },
                pending: { value: 0 },
              },
            },
          },
          {
            $group: {
              _id: null,
              label: { $push: { $dateToString: { date: "$_id", format: "%H:%M" } } },
              approved: { $push: "$approved" },
              pending: { $push: "$pending" },
              canceled: { $push: "$canceled" },
              rejected: { $push: "$rejected" },
            },
          },
          {
            $replaceRoot: {
              newRoot: {
                data: [
                  { label: "Approved", data: "$approved" },
                  { label: "Rejected", data: "$rejected" },
                  { label: "Pending", data: "$pending" },
                  { label: "Canceled", data: "$canceled" },
                ],
                label: "$label",
              },
            },
          },
        ])
      )[0];
    },
    [JSON.stringify(filter), id],
    { tags: [`coworkingSpaces-${id}-frequency`], revalidate: 1200 }
  )();
}
