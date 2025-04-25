"use client";

import { TableBody, TableRow, TableCell } from "@mui/material";
import { Session } from "next-auth";
import Alert from "@mui/material/Alert";
import { deleteReservation, getUserReservations, updateReservationStatus } from "@/libs/reservations";
import { useSnackpackContext } from "@/provider/SnackbarProvider";
import { useActionState, useEffect } from "react";
import ReservationOptionButton from "@/components/reservations/OptionButton";
import {
  ReserveCoworkingCell,
  ReserveDateCell,
  ReserveStatusCell,
} from "@/components/reservations/TableBodyCell";

export default function ReserveTableBody({
  session,
  reservations,
}: {
  session: Session;
  reservations: Exclude<Awaited<ReturnType<typeof getUserReservations>>["data"], undefined>;
}) {
  const [editState, editAction, editPending] = useActionState(updateReservationStatus, undefined);
  const [deleteState, deleteAction, deletePending] = useActionState(deleteReservation, undefined);
  const [, setSnackPack] = useSnackpackContext();

  useEffect(() => {
    if (editState || deleteState) {
      const success = editState?.success || deleteState?.success;
      const message = editState?.message || deleteState?.message;
      setSnackPack((prev) => [
        ...prev,
        {
          anchorOrigin: { vertical: "bottom", horizontal: "right" },
          key: new Date().getTime(),
          children: (
            <Alert severity={success ? "success" : "error"} variant="filled" sx={{ width: "100%" }}>
              {success ?
                `Reservation ${editState?.success ? editState.data?.approvalStatus : "Deleted"}`
              : message || "Error Occur"}
            </Alert>
          ),
        },
      ]);
    }
  }, [editState, deleteState, setSnackPack]);

  return (
    <TableBody>
      {reservations.map((e) => {
        const startDate = new Date(e.startDate);
        const endDate = new Date(e.endDate);
        const adminPermission = session.user.role == "admin" || session.user.id == e.coworkingSpace.owner;
        return (
          <TableRow key={e._id} hover role="checkbox" tabIndex={-1}>
            <TableCell align="left">
              <ReserveCoworkingCell coworkingSpace={e.coworkingSpace} />
            </TableCell>
            <TableCell align="left">
              <ReserveDateCell {...{ startDate, endDate }} />
            </TableCell>
            <TableCell align="left">
              <ReserveStatusCell approvalStatus={e.approvalStatus} personCount={e.personCount} />
            </TableCell>
            <TableCell align="center">
              <ReservationOptionButton
                id={e._id}
                view
                edit={
                  e.approvalStatus == "pending" ?
                    {
                      cancel: session.user.id == e.user._id,
                      approve: adminPermission,
                      reject: adminPermission,
                      action: editAction,
                      pending: editPending,
                    }
                  : undefined
                }
                deleteOption={
                  e.approvalStatus == "pending" && adminPermission ?
                    { action: deleteAction, pending: deletePending }
                  : undefined
                }
              />
            </TableCell>
          </TableRow>
        );
      })}
    </TableBody>
  );
}
