import { Session } from "next-auth";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TablePaginationSP from "@/components/TablePaginationSP";
import { getCoworkingReservations } from "@/libs/reservations";
import ReserveTableBody from "./ReserveTableBody";
import { CWS } from "@/libs/db/models/CoworkingSpace";
import FilterDialog from "@/components/reservations/FilterDialog";
import { CoworkingSpacePrivilage } from "@/libs/coworkingSpace";
import mongoose from "mongoose";

export default async function ReserveTable({
  id,
  page,
  limit,
  min,
  max,
  status,
  coworkingSpace,
  session,
  privilege,
}: {
  id: string;
  page: number;
  limit: number;
  min?: number;
  max?: number;
  status?: string;
  coworkingSpace: CWS;
  session: Session;
  privilege: CoworkingSpacePrivilage;
}) {
  const response = await getCoworkingReservations(
    {
      ...(privilege == "user" ? { user: mongoose.Types.ObjectId.createFromHexString(session.user.id) } : {}),
      ...(min && max ? { personCount: { $gte: min, $lte: max } } : {}),
      ...(status ? { approvalStatus: { $in: status.split(" ") } } : {}),
    },
    page,
    limit,
    id
  );
  if (!response.data) return <main>Cannot fetch data</main>;

  return (
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              <TableCell align="left">User</TableCell>
              <TableCell align="left">Date</TableCell>
              <TableCell align="left">Status</TableCell>
              <TableCell align="center">
                <FilterDialog />
              </TableCell>
            </TableRow>
          </TableHead>
          <ReserveTableBody session={session} reservations={response.data} coworkingSpace={coworkingSpace} />
        </Table>
        <TablePaginationSP page={page} limit={limit} total={response.total} />
      </TableContainer>
    </Paper>
  );
}

export function ReserveTableSkeleton() {
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
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 animate-pulse rounded bg-gray-300"></div>
                  <div className="flex flex-col gap-2">
                    <div className="h-4 w-24 animate-pulse rounded bg-gray-300"></div>
                    <div className="h-4 w-52 animate-pulse rounded bg-gray-300"></div>
                  </div>
                </div>
              </TableCell>
              <TableCell align="left">
                <div className="flex w-fit flex-col items-center gap-1">
                  <div className="h-4 w-36 animate-pulse rounded bg-gray-300"></div>
                  <div className="h-4 w-4 animate-pulse rounded bg-gray-300"></div>
                  <div className="h-4 w-36 animate-pulse rounded bg-gray-300"></div>
                </div>
              </TableCell>
              <TableCell align="left">
                <div className="flex flex-col gap-4">
                  <div className="h-4 w-24 animate-pulse rounded bg-gray-300"></div>
                  <div className="h-4 w-24 animate-pulse rounded bg-gray-300"></div>
                </div>
              </TableCell>
              <TableCell align="left">
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 animate-pulse rounded-full bg-gray-300"></div>
                  <div className="h-4 w-8 animate-pulse rounded bg-gray-300"></div>
                </div>
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
