'use client'

import {ClockIcon, MapPinIcon, PhoneIcon } from "@heroicons/react/24/outline";
import { concatAddress } from "@/utils";
import { CWS } from "@/libs/db/models/CoworkingSpace";

export default function detailBody ({coworkingSpace}:{coworkingSpace: CWS}) {
  const openTime = new Date(coworkingSpace.openTime);
  const closeTime = new Date(coworkingSpace.closeTime);
  return (
  <div>
    <h1 className="!text-left font-bold">{coworkingSpace.name}</h1>
      <span className="mb-8 inline-block">{coworkingSpace.description}</span>
        {[
          { Icon: PhoneIcon, text: coworkingSpace.tel },
          {
            Icon: ClockIcon,
            text: `${openTime.toLocaleTimeString()} - ${closeTime.toLocaleTimeString()}`,
          },
          { Icon: MapPinIcon, text: concatAddress(coworkingSpace) },
        ].map(({ Icon, text }) => (
          <div className="flex items-center gap-2" key={text}>
            <Icon width="1rem" height="1rem" />
            <span>{text}</span>
          </div>
        ))}
  </div>
  )
}