import express from "express";

// const {
//   getCoWorkingSpaces,
//   getCoWorkingSpace,
//   createCoWorkingSpace,
//   updateCoWorkingSpace,
//   deleteCoWorkingSpace,
// } = require("../controllers/co-working-spaces");

// const reservationRouter = require("./reservations");

// const router = express.Router();

// const { protect, authorize } = require("../middleware/auth");

//Re-route into other resource routers
// router.use("/:coWorkingSpaceId/reservations/", reservationRouter);

// router
//   .route("/")
//   .get(getCoWorkingSpaces)
//   .post(protect, authorize("admin"), createCoWorkingSpace);
// router
//   .route("/:id")
//   .get(getCoWorkingSpace)
//   .put(protect, authorize("admin"), updateCoWorkingSpace)
//   .delete(protect, authorize("admin"), deleteCoWorkingSpace);

// module.exports = router;

/**
 * @swagger
 * /co-working-spaces:
 *   post:
 *     summary: Create a new co-working-space
 *     tags: [CoWorkingSpaces]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CoWorkingSpace'
 *     responses:
 *       201:
 *         description: The co-working-space was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CoWorkingSpace'
 *       500:
 *         description: Some server error
 */

/**
 * @swagger
 * /co-working-spaces/{id}:
 *   delete:
 *     summary: Remove the co-working space by id
 *     tags: [CoWorkingSpaces]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The co-working-space id
 *
 *     responses:
 *       200:
 *         description: The co-working-space was deleted
 *       404:
 *         description: The co-working-space was not found
 */
