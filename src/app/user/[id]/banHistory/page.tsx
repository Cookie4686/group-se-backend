import { auth } from "@/auth";
import { readPaginationSearchParams, readSearchParams, SearchParams } from "@/utils";
import { Suspense } from "react";
import BanHistoryTable, { BanHistoryTableSkeleton } from "./BanIssueTable";
import { getUser } from "@/libs/auth";

export default async function BanHistory({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<SearchParams>;
}) {
  const [{ id }, sp, session] = await Promise.all([params, searchParams, auth()]);
  if (!session) return <main>You are not logged in</main>;

  const response = await getUser(id);
  if (!response.data) return <main>Cannot fetch User</main>;
  const { data: user } = response;

  const { page, limit = 5 } = readPaginationSearchParams(sp);
  const search = readSearchParams(sp, "search") || "";

  return (
    <main className="p-4">
      <h1>{user.name}&lsquo;s Ban History</h1>
      <div className="mx-auto max-w-5xl rounded-3xl border p-8">
        <Suspense key={JSON.stringify(sp)} fallback={<BanHistoryTableSkeleton />}>
          <BanHistoryTable {...{ page, limit, search, session, id }} />
        </Suspense>
      </div>
    </main>
  );
}
