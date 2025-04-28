import { Router } from "express";
import { protect, readToken } from "../middleware.js";
import {
  getReservations,
  getReservation,
  createReservation,
  updateReservation,
  deleteReservation,
} from "../controllers/reservations.js";

const router = Router();

router.route("/").get(readToken, protect, getReservations).post(readToken, protect, createReservation);
router
  .route("/:id")
  .get(readToken, protect, getReservation)
  .put(readToken, protect, updateReservation)
  .delete(readToken, protect, deleteReservation);

export default router;
