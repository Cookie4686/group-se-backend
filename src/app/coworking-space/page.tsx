import { Suspense } from "react";
import { LinearProgress } from "@mui/material";
import CoworkingSpaceCatalog from "@/app/coworking-space/CoworkingSpaceCatalog";
import { readPaginationSearchParams, readSearchParams } from "@/utils";

export default async function CoworkingSpace({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const search = readSearchParams(params, "search") || "";
  const { page, limit = 25 } = readPaginationSearchParams(params);
  return (
    <main className="flex flex-col items-center gap-8 p-4">
      <h1>Co-working Spaces</h1>
      <Suspense
        fallback={
          <p>
            Loading... <LinearProgress />
          </p>
        }
      >
        <CoworkingSpaceCatalog search={search} page={page} limit={limit} />
      </Suspense>
      <hr className="my-10" />
    </main>
  );
}
