import { Session } from "next-auth";
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { getBanIssues, resolveExpiredBan } from "@/libs/banIssue";
import TablePaginationSP from "@/components/TablePaginationSP";
import { FilterQuery } from "mongoose";
import { BanIssueType } from "@/libs/db/models/BanIssue";
import BanIssueTableBody from "./BanIssueTableBody";

export default async function BanIssueTable({
  page,
  limit,
  search,
  time,
  resolve,
  session,
}: {
  page: number;
  limit: number;
  search: string;
  time: string;
  resolve: string;
  session: Session;
}) {
  // * Refactor this
  const filter: FilterQuery<BanIssueType> = {};
  if (time == "current") {
    filter.endDate = { $gte: new Date() };
  } else if (time == "past") {
    filter.endDate = { $lte: new Date() };
  }
  if (resolve == "yes") {
    filter.isResolved = true;
  } else if (resolve == "no") {
    filter.isResolved = false;
  }
  await resolveExpiredBan();
  const response = await getBanIssues(filter, page, limit, search);
  if (!response.data) return <main>Cannot fetch data</main>;
  const { data: banIssues } = response;

  return (
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              <TableCell align="left">User</TableCell>
              <TableCell align="left">Issue Title</TableCell>
              <TableCell align="left">Issue Date</TableCell>
              <TableCell align="left">Status</TableCell>
              <TableCell align="center"></TableCell>
            </TableRow>
          </TableHead>
          <BanIssueTableBody banIssues={banIssues} session={session} />
        </Table>
        <TablePaginationSP page={page} limit={limit} total={response.total} />
      </TableContainer>
    </Paper>
  );
}

export function BanIssueTableSkeleton() {
  return (
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {[...Array(4)].map((e, i) => (
                <TableCell align="left" key={i}>
                  <div className="h-4 w-12 animate-pulse rounded bg-gray-300"></div>
                </TableCell>
              ))}
              <TableCell align="center"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow hover role="checkbox" tabIndex={-1}>
              <TableCell align="left">
                <div className="flex items-center gap-2">
                  <div className="h-10 w-10 animate-pulse rounded-full bg-gray-300"></div>
                  <div className="flex flex-col gap-1">
                    <div className="h-4 w-8 animate-pulse rounded bg-gray-300"></div>
                    <div className="h-4 w-24 animate-pulse rounded bg-gray-300"></div>
                  </div>
                </div>
              </TableCell>
              <TableCell align="left">
                <div className="h-4 w-36 animate-pulse rounded bg-gray-300"></div>
              </TableCell>
              <TableCell align="left">
                <div className="flex flex-col gap-1">
                  <div className="h-4 w-52 animate-pulse rounded bg-gray-300"></div>
                  <div className="h-4 w-52 animate-pulse rounded bg-gray-300"></div>
                </div>
              </TableCell>
              <TableCell align="left">
                <div className="h-4 w-24 animate-pulse rounded bg-gray-300"></div>
              </TableCell>
              <TableCell align="center">
                <div className="h-2 w-4 animate-pulse rounded-full bg-gray-300"></div>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}
