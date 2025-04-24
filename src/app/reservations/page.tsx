import { Suspense } from "react";
import SearchFieldSP from "@/components/SearchFieldSP";
import { readPaginationSearchParams, readSearchParams, SearchParams } from "@/utils";
import FilterDialog from "./FilterDialog";
import ReserveTable, { ReserveTableSkeleton } from "./ReserveTable";
import { auth } from "@/auth";

export default async function Reservations({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const session = await auth();
  if (!session) return <main>Login to view reservations</main>;

  const params = await searchParams;
  const { page, limit = 5 } = readPaginationSearchParams(params);
  const search = readSearchParams(params, "search") || "";
  const min = Number(readSearchParams(params, "min")) || undefined;
  const max = Number(readSearchParams(params, "max")) || undefined;

  return (
    <main className="p-4">
      <h1>My Reservations</h1>
      <div className="mx-auto max-w-5xl rounded-3xl border p-8">
        <div className="flex items-center justify-center gap-4 pb-2">
          <SearchFieldSP search={search} />
          <FilterDialog />
        </div>
        <Suspense fallback={<ReserveTableSkeleton />}>
          <ReserveTable {...{ page, limit, search, min, max, session }} />
        </Suspense>
      </div>
    </main>
  );
}
