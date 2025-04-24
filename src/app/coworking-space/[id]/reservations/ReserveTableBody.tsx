"use client";

import Image from "next/image";
import clsx from "clsx";
import { concatAddress } from "@/utils";
import { UserGroupIcon, UserIcon, UsersIcon } from "@heroicons/react/24/outline";
import { TableBody, TableRow, TableCell } from "@mui/material";
import { Session } from "next-auth";
import Alert from "@mui/material/Alert";
import { deleteReservation, getCoworkingReservations, updateReservationStatus } from "@/libs/reservations";
import { useSnackpackContext } from "@/provider/SnackbarProvider";
import { useActionState, useEffect } from "react";
import UserInfo from "@/components/UserInfo";
import { CWS } from "@/libs/db/models/CoworkingSpace";
import ReservationOptionButton from "@/components/reservations/OptionButton";

export default function ReserveTableBody({
  session,
  coworkingSpace,
  reservations,
}: {
  session: Session;
  coworkingSpace: CWS;
  reservations: Exclude<Awaited<ReturnType<typeof getCoworkingReservations>>["data"], undefined>;
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
        const adminPermission = session.user.role == "admin" || session.user.id == coworkingSpace.owner;

        return (
          <TableRow key={e._id} hover role="checkbox" tabIndex={-1}>
            <TableCell align="left">
              <div className="flex items-center gap-4">
                <Image
                  className="aspect-square h-12 rounded object-cover"
                  src={coworkingSpace.picture || "/img/BOT-learning-center.jpg"}
                  alt="coworking image"
                  width={48}
                  height={48}
                  sizes="96px"
                />
                <div className="flex flex-col gap-2">
                  <span className="font-bold">{coworkingSpace.name}</span>
                  <span>{concatAddress(coworkingSpace)}</span>
                </div>
              </div>
            </TableCell>
            <TableCell align="left">
              <div className="flex w-fit flex-col gap-1">
                <span>{startDate.toLocaleString()}</span>
                <span className="self-center">to</span>
                <span>{endDate.toLocaleString()}</span>
              </div>
            </TableCell>
            <TableCell align="left">
              <div className="grid w-fit grid-cols-[auto_auto] grid-rows-[auto_auto] items-center gap-2">
                {e.personCount == 1 ?
                  <UserIcon width="1rem" height="1rem" />
                : e.personCount == 2 ?
                  <UsersIcon width="1rem" height="1rem" />
                : <UserGroupIcon width="1rem" height="1rem" />}
                <span>{e.personCount}</span>
                <span
                  className={clsx(
                    "inline-block aspect-square h-2 w-2 justify-self-center rounded-full",
                    e.approvalStatus == "pending" && "bg-amber-300",
                    e.approvalStatus == "canceled" && "bg-red-300",
                    e.approvalStatus == "rejected" && "bg-red-500",
                    e.approvalStatus == "approved" && "bg-green-500"
                  )}
                ></span>
                <span>{e.approvalStatus.charAt(0).toUpperCase() + e.approvalStatus.slice(1)}</span>
              </div>
            </TableCell>
            <TableCell align="left">
              <UserInfo
                user={e.user}
                name
                avatarIconProps={{ sx: { width: 24, height: 24, fontSize: "0.875rem" } }}
              />
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
