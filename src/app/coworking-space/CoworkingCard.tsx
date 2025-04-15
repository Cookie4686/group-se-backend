'use client'

import Image from "next/image";
import Link from "next/link";
import { ClockIcon, MapPinIcon } from "@heroicons/react/24/outline";
import { CWS } from "@/libs/db/models/CoworkingSpace";
import { concatAddress } from "@/utils";

export function ProductCard({ coworkingSpace }: { coworkingSpace: CWS }) {
  const openTime = new Date(coworkingSpace.openTime);
  const closeTime = new Date(coworkingSpace.closeTime);
  return (
    <li className="h-80 w-60 rounded-t-2xl rounded-b-xl border shadow-lg transition hover:scale-105 hover:shadow-2xl">
      <Link href={`/coworking-space/${coworkingSpace._id}`}>
        <Image
          className="h-[67%] w-full rounded-t-2xl object-cover"
          src={coworkingSpace.picture ? coworkingSpace.picture : "/img/BOT-learning-center.jpg"}
          alt="CoworkingSpace Picture"
          width={0}
          height={0}
          sizes="40vw"
        />
        <div className="flex h-[33%] w-full flex-col p-2">
          <span className="my-1 inline-block w-full overflow-hidden font-medium text-ellipsis whitespace-nowrap">
            {coworkingSpace.name}
          </span>
          {[
            { Icon: ClockIcon, text: `${openTime.toLocaleTimeString()} - ${closeTime.toLocaleTimeString()}` },
            { Icon: MapPinIcon, text: concatAddress(coworkingSpace) },
          ].map(({ Icon, text }) => (
            <div className="flex items-center gap-2" title={text} key={text}>
              <Icon width="1rem" height="1rem" />
              <span className="inline-block w-full overflow-hidden text-ellipsis whitespace-nowrap">
                {text}
              </span>
            </div>
          ))}
        </div>
      </Link>
    </li>
  );
}