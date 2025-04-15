"use client";

import { CalendarDaysIcon, MapPinIcon } from "@heroicons/react/24/outline";

export default function DetailBody({
  startDate,
  endDate,
  address,
}: {
  startDate: Date;
  endDate: Date;
  address: string;
}) {
  return (
    <div className="mt-8">
      {[
        { Icon: CalendarDaysIcon, text: `Start Date: ${startDate.toLocaleString()}` },
        { Icon: CalendarDaysIcon, text: `End Date: ${endDate.toLocaleString()}` },
        { Icon: MapPinIcon, text: address },
      ].map(({ Icon, text }) => (
        <div className="flex items-center gap-2" key={text}>
          <Icon width="1rem" height="1rem" />
          <span>{text}</span>
        </div>
      ))}
    </div>
  );
}
