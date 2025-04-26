"use client";

import { CWS } from "@/libs/db/models/CoworkingSpace";
import { concatAddress } from "@/utils";
import Image from "next/image";
import Menu, { ActionItem, LinkItem } from "../Menu";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export function CoworkingSpaceCell({
  coworkingSpace,
  menu,
}: {
  coworkingSpace: CWS;
  menu?: { viewInfo?: boolean; searchReservation?: boolean; manageReservation?: boolean };
}) {
  const [pathname, searchParams] = [usePathname(), useSearchParams()];
  const { replace } = useRouter();

  return (
    <div className="flex items-center gap-4">
      {menu ?
        <Menu
          buttonChildren={
            <Image
              className="aspect-square h-12 rounded object-cover"
              src={coworkingSpace.picture || "/img/BOT-learning-center.jpg"}
              alt="coworking image"
              width={48}
              height={48}
              sizes="96px"
            />
          }
        >
          {menu.viewInfo && (
            <LinkItem text="View CoworkingSpace" href={`/coworking-space/${coworkingSpace._id}`} />
          )}
          {menu.searchReservation && (
            <ActionItem
              text="Search this coworkingspace"
              action={() => {
                const params = new URLSearchParams(searchParams);
                params.set("search", coworkingSpace.name);
                replace(`${pathname}?${params.toString()}`);
              }}
            />
          )}
          {menu.manageReservation && (
            <LinkItem text="Manage Reservations" href={`/dashboard/coworking-space/${coworkingSpace._id}`} />
          )}
        </Menu>
      : <Image
          className="aspect-square h-12 rounded object-cover"
          src={coworkingSpace.picture || "/img/BOT-learning-center.jpg"}
          alt="coworking image"
          width={48}
          height={48}
          sizes="96px"
        />
      }
      <div className="flex flex-col gap-2">
        <span className="font-bold">{coworkingSpace.name}</span>
        <span>{concatAddress(coworkingSpace)}</span>
      </div>
    </div>
  );
}
