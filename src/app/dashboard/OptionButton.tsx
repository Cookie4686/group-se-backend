"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { IconButton, Menu } from "@mui/material";
import { EllipsisHorizontalIcon } from "@heroicons/react/24/outline";
import { deleteCoworkingSpace } from "@/libs/coworkingSpace";
import { CWS } from "@/libs/db/models/CoworkingSpace";

export default function OptionButton({ coworkingSpace }: { coworkingSpace: CWS }) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [state, action, pending] = useActionState(deleteCoworkingSpace, undefined);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  return (
    <div>
      <IconButton
        onClick={handleClick}
        id="basic-button"
        size="small"
        aria-controls={open ? "basic-menu" : undefined}
        aria-expanded={open ? "true" : undefined}
        aria-haspopup="true"
      >
        <EllipsisHorizontalIcon width="1rem" height="1rem" />
      </IconButton>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        transformOrigin={{ horizontal: "center", vertical: "top" }}
        anchorOrigin={{ horizontal: "left", vertical: "bottom" }}
      >
        <LinkItem href={`/coworking-space/${coworkingSpace._id}`} onClick={handleClose}>
          View Info
        </LinkItem>
        <LinkItem href={`/coworking-space/${coworkingSpace._id}/edit`} onClick={handleClose}>
          Edit
        </LinkItem>
        <li onClick={handleClose}>
          <form action={action}>
            <input type="text" name="id" value={coworkingSpace._id} hidden readOnly />
            <button
              className="w-full cursor-pointer px-4 py-1.5 text-left hover:bg-gray-100"
              type="submit"
              disabled={pending}
            >
              Delete
            </button>
          </form>
        </li>
      </Menu>
    </div>
  );
}

function LinkItem({
  href,
  onClick,
  children,
}: {
  href: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <li onClick={onClick}>
      <Link className="inline-block w-full px-4 py-1.5 hover:bg-gray-100" href={href}>
        {children}
      </Link>
    </li>
  );
}
