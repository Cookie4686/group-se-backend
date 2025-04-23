"use client";

import Image from "next/image";
import clsx from "clsx";
import { concatAddress } from "@/utils";
import { UserGroupIcon, UserIcon, UsersIcon } from "@heroicons/react/24/outline";
import { CWS } from "@/libs/db/models/CoworkingSpace";
import { ReservationType } from "@/libs/db/models/Reservation";
import { UserType } from "@/libs/db/models/User";
import { TableBody, TableRow, TableCell } from "@mui/material";
import { Session } from "next-auth";
import Alert from "@mui/material/Alert";
import { deleteReservation, updateReservationStatus } from "@/libs/reservations";
import OptionButton from "@/components/OptionButton";
import Link from "next/link";
import { useSnackpackContext } from "@/provider/SnackbarProvider";
import { useActionState, useEffect } from "react";
import UserInfo from "@/components/UserInfo";

export default function ReserveTableBody({
  session,
  reservations,
}: {
  session: Session;
  reservations: (Omit<Omit<ReservationType, "coworkingSpace">, "user"> & {
    user: UserType;
    coworkingSpace: CWS;
  })[];
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
        return (
          <TableRow key={e._id} hover role="checkbox" tabIndex={-1}>
            <TableCell align="left">
              <div className="flex items-center gap-4">
                <Image
                  className="aspect-square h-12 object-cover"
                  src={e.coworkingSpace.picture || "/img/BOT-learning-center.jpg"}
                  alt="coworking image"
                  width={48}
                  height={48}
                />
                <div className="flex flex-col gap-2">
                  <span className="font-bold">{e.coworkingSpace.name}</span>
                  <span>{concatAddress(e.coworkingSpace)}</span>
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
              <OptionButton>
                <li>
                  <Link
                    className="inline-block w-full px-4 py-1.5 hover:bg-gray-100"
                    href={`/reservations/${e._id}`}
                  >
                    View Info
                  </Link>
                </li>
                {e.approvalStatus == "pending"
                  && [
                    ...(session.user.id == e.user._id ? [{ status: "canceled", text: "Cancel" }] : []),
                    ...(session.user.role == "admin" || session.user.id == e.coworkingSpace.owner ?
                      [
                        { status: "approved", text: "Approve" },
                        { status: "rejected", text: "Reject" },
                        { text: "Delete" },
                      ]
                    : []),
                  ].map(({ status, text }) => (
                    <li key={text}>
                      <form action={status ? editAction : deleteAction}>
                        <input type="text" name="id" value={e._id} hidden readOnly />
                        {status && <input type="text" name="approvalStatus" value={status} hidden readOnly />}
                        <button
                          className="w-full cursor-pointer px-4 py-1.5 text-left hover:bg-gray-100"
                          type="submit"
                          disabled={status ? editPending : deletePending}
                        >
                          {text}
                        </button>
                      </form>
                    </li>
                  ))}
              </OptionButton>
            </TableCell>
          </TableRow>
        );
      })}
    </TableBody>
  );
}
