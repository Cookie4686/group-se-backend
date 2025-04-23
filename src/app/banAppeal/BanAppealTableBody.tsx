"use client";

import UserInfo from "@/components/UserInfo";
import { Alert, TableBody, TableCell, TableRow } from "@mui/material";
import clsx from "clsx";
import OptionButton from "@/components/OptionButton";
import { BanAppealType } from "@/libs/db/models/BanAppeal";
import { BanIssueType } from "@/libs/db/models/BanIssue";
import { UserType } from "@/libs/db/models/User";
import { Session } from "next-auth";
import { resolveBanAppeal } from "@/libs/banAppeal";
import { useActionState, useEffect } from "react";
import Link from "next/link";
import { useSnackpackContext } from "@/provider/SnackbarProvider";

export default function BanAppealTableBody({
  banAppeals,
  session,
}: {
  banAppeals: (Omit<Omit<BanAppealType, "comment">, "banIssue"> & {
    banIssue: Omit<BanIssueType, "user"> & { user: UserType };
  })[];
  session: Session;
}) {
  const [editState, editAction, editPending] = useActionState(resolveBanAppeal, undefined);
  const [, setSnackPack] = useSnackpackContext();

  useEffect(() => {
    if (editState) {
      setSnackPack((prev) => [
        ...prev,
        {
          anchorOrigin: { vertical: "bottom", horizontal: "right" },
          key: new Date().getTime(),
          children: (
            <Alert severity={editState.success ? "success" : "error"} variant="filled" sx={{ width: "100%" }}>
              {editState.success ?
                `Ban Appeal ${editState.data?.resolveStatus}`
              : editState.message || "Error Occur"}
            </Alert>
          ),
        },
      ]);
    }
  }, [editState, setSnackPack]);

  return (
    <TableBody>
      {banAppeals.map((e) => {
        const createdAt = new Date(e.banIssue.createdAt);
        const endDate = new Date(e.banIssue.endDate);
        const appealDate = new Date(e.createdAt);

        return (
          <TableRow key={e._id} hover role="checkbox" tabIndex={-1}>
            <TableCell align="left">
              <UserInfo user={e.banIssue.user} name email />
            </TableCell>
            <TableCell align="left">{e.banIssue.title}</TableCell>
            <TableCell align="left">
              <div className="flex w-fit flex-col gap-1">
                <span>Issue At: {createdAt.toLocaleString()}</span>
                <span>End At: {endDate.toLocaleString()}</span>
              </div>
            </TableCell>
            <TableCell align="left">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <span
                    className={clsx(
                      "inline-block aspect-square h-2 w-2 justify-self-center rounded-full",
                      e.resolveStatus == "pending" && "bg-amber-300",
                      e.resolveStatus == "denied" && "bg-red-500",
                      e.resolveStatus == "resolved" && "bg-green-500"
                    )}
                  ></span>
                  <span>{e.resolveStatus}</span>
                </div>
                <span>Appeal at: {appealDate.toLocaleString()}</span>
              </div>
            </TableCell>
            <TableCell align="center">
              <OptionButton>
                <li>
                  <Link
                    className="inline-block w-full px-4 py-1.5 hover:bg-gray-100"
                    href={`/banIssue/${e.banIssue._id}/${e._id}`}
                  >
                    View Info
                  </Link>
                </li>
                {session.user.role == "admin"
                  && e.resolveStatus == "pending"
                  && [
                    { text: "Approve", status: "resolved" },
                    { text: "Deny", status: "denied" },
                  ].map(({ text, status }) => (
                    <li key={text}>
                      <form action={editAction}>
                        <input type="text" name="id" value={e._id} hidden readOnly />
                        <input type="text" name="status" value={status} hidden readOnly />
                        <button
                          className="w-full cursor-pointer px-4 py-1.5 text-left hover:bg-gray-100"
                          type="submit"
                          disabled={editPending}
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
