import { auth } from "@/auth";
import BanIssueTable, { BanIssueTableSkeleton } from "./BanIssueTable";
import { readPaginationSearchParams, readSearchParams } from "@/utils";
import SearchFieldSP from "@/components/SearchFieldSP";
import { Button } from "@mui/material";
import Link from "next/link";
import FilterDialog from "./FilterDialog";
import { Suspense } from "react";

export default async function BanIssues({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const session = await auth();
  if (!session) return <main>You are not logged in</main>;

  const params = await searchParams;

  const { page, limit = 5 } = readPaginationSearchParams(params);
  const search = readSearchParams(params, "search") || "";
  const time = readSearchParams(params, "time") || "";
  const resolve = readSearchParams(params, "resolve") || "";

  return (
    <main className="p-4">
      <h1>Ban Issues</h1>
      <div className="mx-auto max-w-5xl rounded-3xl border p-8">
        <div className="flex items-center justify-center gap-8 pb-2">
          {session.user.role == "admin" ?
            <>
              <SearchFieldSP search={search} />
              <FilterDialog />
              <Link href="/banIssue/create">
                <Button type="submit" color="primary" variant="contained">
                  + New
                </Button>
              </Link>
            </>
          : <FilterDialog />}
        </div>
        <Suspense key={JSON.stringify(params)} fallback={<BanIssueTableSkeleton />}>
          <BanIssueTable {...{ page, limit, search, time, resolve }} session={session} />
        </Suspense>
      </div>
    </main>
  );
}
