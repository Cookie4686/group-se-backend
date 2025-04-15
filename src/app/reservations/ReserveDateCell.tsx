'use client'

export default function DateCell({startDate, endDate}:{startDate:Date, endDate:Date}) {
  return (
    <div className="flex w-fit flex-col gap-1">
      <span>{startDate.toLocaleString()}</span>
      <span className="self-center">to</span>
      <span>{endDate.toLocaleString()}</span>
    </div>
  );
}