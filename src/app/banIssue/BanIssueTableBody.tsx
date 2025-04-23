"use client";

import { BanIssueType } from "@/libs/db/models/BanIssue";
import { UserType } from "@/libs/db/models/User";
import { TableBody, TableRow, TableCell, Alert } from "@mui/material";
import clsx from "clsx";
import OptionButton from "@/components/OptionButton";
import { resolveBanIssue } from "@/libs/banIssue";
import { useActionState, useEffect } from "react";
import Link from "next/link";
import { Session } from "next-auth";
import { useSnackpackContext } from "@/provider/SnackbarProvider";
import UserInfo from "@/components/UserInfo";

export default function BanIssueTableBody({
  banIssues,
  session,
}: {
  banIssues: (Omit<Omit<BanIssueType, "user">, "admin"> & { user: UserType; admin: UserType })[];
  session: Session;
}) {
  const [editState, editAction, editPending] = useActionState(resolveBanIssue, undefined);
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
              {editState.success ? "Ban Issue resolved" : editState.message || "Error Occur"}
            </Alert>
          ),
        },
      ]);
    }
  }, [editState, setSnackPack]);

  return (
    <TableBody>
      {banIssues.map((e) => {
        const createdAt = new Date(e.createdAt);
        const endDate = new Date(e.endDate);

        return (
          <TableRow key={e._id} hover role="checkbox" tabIndex={-1}>
            <TableCell align="left">
              <UserInfo user={e.user} name email />
            </TableCell>
            <TableCell align="left">{e.title}</TableCell>
            <TableCell align="left">
              <div className="flex w-fit flex-col gap-1">
                <span>Issue At: {createdAt.toLocaleString()}</span>
                <span>End At: {endDate.toLocaleString()}</span>
              </div>
            </TableCell>
            <TableCell align="left">
              <div className="flex items-center gap-2">
                <span
                  className={clsx(
                    "inline-block aspect-square h-2 w-2 justify-self-center rounded-full",
                    e.isResolved ? "bg-green-500" : "bg-red-500"
                  )}
                ></span>
                <span>{e.isResolved ? "Resolved" : "Not Resolved"}</span>
              </div>
            </TableCell>
            <TableCell align="center">
              <OptionButton>
                {[
                  { text: "View Info", href: `/banIssue/${e._id}` },
                  ...(session.user.id == e.user._id ?
                    [{ text: "Make an appeal", href: `/banIssue/${e._id}/appeal` }]
                  : []),
                ].map(({ text, href }) => (
                  <li key={text}>
                    <Link className="inline-block w-full px-4 py-1.5 hover:bg-gray-100" href={href}>
                      {text}
                    </Link>
                  </li>
                ))}
                {session.user.role == "admin" && !e.isResolved && (
                  <li>
                    <form action={editAction}>
                      <input type="text" name="id" value={e._id} hidden readOnly />
                      <button
                        className="w-full cursor-pointer px-4 py-1.5 text-left hover:bg-gray-100"
                        type="submit"
                        disabled={editPending}
                      >
                        Resolve Ban
                      </button>
                    </form>
                  </li>
                )}
              </OptionButton>
            </TableCell>
          </TableRow>
        );
      })}
    </TableBody>
  );
}
