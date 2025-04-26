import { Suspense } from "react";
import { authLoggedIn, readPaginationSearchParams, readSearchParams, SearchParams } from "@/utils";
import ReserveTable, { ReserveTableSkeleton } from "./ReserveTable";

export default async function Reservations({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const [params, session] = await Promise.all([searchParams, authLoggedIn("/reservations")]);
  const { page, limit = 5 } = readPaginationSearchParams(params);
  const search = readSearchParams(params, "search") || "";
  const min = Number(readSearchParams(params, "min")) || undefined;
  const max = Number(readSearchParams(params, "max")) || undefined;

  return (
    <main className="p-4">
      <h1>My Reservations</h1>
      <div className="mx-auto max-w-5xl rounded-3xl border p-8">
        <Suspense key={JSON.stringify(params)} fallback={<ReserveTableSkeleton />}>
          <ReserveTable {...{ page, limit, search, min, max, session }} />
        </Suspense>
      </div>
    </main>
  );
}
