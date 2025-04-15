import { readPaginationSearchParams, readSearchParams } from "@/utils";
import ReservationTable from "./ReservationTable";

export default async function Reservations({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const { page, limit = 5 } = readPaginationSearchParams(params);
  const search = readSearchParams(params, "search") || "";
  const min = Number(readSearchParams(params, "min")) || undefined;
  const max = Number(readSearchParams(params, "max")) || undefined;

  return (
    <main className="p-4">
      <h1>Reservations</h1>
      <ReservationTable page={page} limit={limit} search={search} min={min} max={max} />
    </main>
  );
}
