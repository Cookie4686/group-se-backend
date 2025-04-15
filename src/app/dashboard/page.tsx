import { auth } from "@/auth";
import { readPaginationSearchParams, readSearchParams } from "@/utils";
import CWSTable from "./CoworkingSpaceTable";

export default async function Dashboard({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const session = await auth();
  if (session && session.user.role != "admin") return <main>You don&lsquo;t have access to this page</main>;

  const params = await searchParams;
  const { page, limit = 15 } = readPaginationSearchParams(params);
  const search = readSearchParams(params, "search") || "";
  return (
    <main className="p-4">
      <h1>Coworking-Spaces</h1>
      <CWSTable page={page} limit={limit} search={search} />
    </main>
  );
}
