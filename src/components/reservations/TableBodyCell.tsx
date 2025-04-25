"use client";

import Image from "next/image";
import clsx from "clsx";
import UserIcon from "@heroicons/react/24/outline/UserIcon";
import UsersIcon from "@heroicons/react/24/outline/UsersIcon";
import UserGroupIcon from "@heroicons/react/24/outline/UserGroupIcon";
import { CWS } from "@/libs/db/models/CoworkingSpace";
import { ReservationType } from "@/libs/db/models/Reservation";
import { concatAddress } from "@/utils";

export function ReserveCoworkingCell({ coworkingSpace }: { coworkingSpace: CWS }) {
  return (
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
  );
}

export function ReserveDateCell({ startDate, endDate }: { startDate: Date; endDate: Date }) {
  return (
    <div className="flex w-fit flex-col gap-1">
      <span>{startDate.toLocaleString()}</span>
      <span className="self-center">to</span>
      <span>{endDate.toLocaleString()}</span>
    </div>
  );
}

export function ReserveStatusCell({
  personCount,
  approvalStatus,
}: {
  personCount: number;
  approvalStatus: ReservationType["approvalStatus"];
}) {
  return (
    <div className="grid w-fit grid-cols-[auto_auto] grid-rows-[auto_auto] items-center gap-2">
      {personCount == 1 ?
        <UserIcon width="1rem" height="1rem" />
      : personCount == 2 ?
        <UsersIcon width="1rem" height="1rem" />
      : <UserGroupIcon width="1rem" height="1rem" />}
      <span>{personCount}</span>
      <span
        className={clsx(
          "inline-block aspect-square h-2 w-2 justify-self-center rounded-full",
          approvalStatus == "pending" && "bg-amber-300",
          approvalStatus == "canceled" && "bg-red-300",
          approvalStatus == "rejected" && "bg-red-500",
          approvalStatus == "approved" && "bg-green-500"
        )}
      ></span>
      <span>{approvalStatus.charAt(0).toUpperCase() + approvalStatus.slice(1)}</span>
    </div>
  );
}
