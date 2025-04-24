import { Suspense } from "react";
import SearchFieldSP from "@/components/SearchFieldSP";
import { readPaginationSearchParams, readSearchParams, SearchParams } from "@/utils";
import FilterDialog from "./FilterDialog";
import ReserveTable, { ReserveTableSkeleton } from "./ReserveTable";
import { auth } from "@/auth";
import { getCoworkingSpace } from "@/libs/coworkingSpace";

export default async function Reservations({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<SearchParams>;
}) {
  const session = await auth();
  if (!session) return <main>Login to view coworking&lsquo;s reservations</main>;

  const [{ id }, sp] = await Promise.all([params, searchParams]);
  const { page, limit = 5 } = readPaginationSearchParams(sp);
  const search = readSearchParams(sp, "search") || "";
  const min = Number(readSearchParams(sp, "min")) || undefined;
  const max = Number(readSearchParams(sp, "max")) || undefined;

  const response = await getCoworkingSpace(id);
  if (!response.data) return <main>Cannot fetch data</main>;
  const { data: coworkingSpace } = response;

  if (session.user.role != "admin" && session.user.id != coworkingSpace.owner)
    return <main>No permission to view this page</main>;

  return (
    <main className="p-4">
      <h1>{coworkingSpace.name}&lsquo;s Reservations</h1>
      <div className="mx-auto max-w-5xl rounded-3xl border p-8">
        <div className="flex items-center justify-center gap-4 pb-2">
          <SearchFieldSP search={search} />
          <FilterDialog />
        </div>
        <Suspense fallback={<ReserveTableSkeleton />}>
          <ReserveTable {...{ id, page, limit, search, min, max, session, coworkingSpace }} />
        </Suspense>
      </div>
    </main>
  );
}
