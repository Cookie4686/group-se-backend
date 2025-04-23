import clsx from "clsx";
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import AvatarIcon from "@/components/AvatarIcon";
import TablePaginationSP from "@/components/TablePaginationSP";
import DateCell from "./DateCell";
import { getBanAppeals } from "@/libs/banAppeal";
import OptionButton from "./OptionButton";
import { Session } from "next-auth";

export default async function BanAppealTable({
  page,
  limit,
  search,
  session,
}: {
  page: number;
  limit: number;
  search: string;
  session: Session;
}) {
  const response = await getBanAppeals({}, page, limit, search);
  if (!response.data) return <main>Cannot fetch data</main>;
  const { data: banAppeal } = response;

  return (
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              <TableCell align="left">User</TableCell>
              <TableCell align="left">Issue Title</TableCell>
              <TableCell align="left">Issue Date</TableCell>
              <TableCell align="left">Appeal Status</TableCell>
              <TableCell align="center"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {banAppeal.map((e) => {
              const createdAt = new Date(e.banIssue.createdAt);
              const endDate = new Date(e.banIssue.endDate);
              const appealDate = new Date(e.createdAt);

              return (
                <TableRow key={e._id} hover role="checkbox" tabIndex={-1}>
                  <TableCell align="left">
                    <div className="flex items-center gap-2">
                      <AvatarIcon name={e.banIssue.user.name} />
                      <div className="flex flex-col gap-1">
                        <span className="font-bold">{e.banIssue.user.name}</span>
                        <span>{e.banIssue.user.email}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell align="left">{e.banIssue.title}</TableCell>
                  <TableCell align="left">
                    <DateCell createdAt={createdAt} endDate={endDate} />
                  </TableCell>
                  <TableCell align="left">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                        <span
                          className={clsx(
                            "inline-block aspect-square h-2 w-2 justify-self-center rounded-full",
                            e.resolveStatus == "pending" && "bg-amber-300",
                            e.resolveStatus == "denied" && "bg-red-500",
                            e.resolveStatus == "resolved" && "bg-green-500"
                          )}
                        ></span>
                        <span>{e.resolveStatus}</span>
                      </div>
                      <span>Appeal at: {appealDate.toLocaleString()}</span>
                    </div>
                  </TableCell>
                  <TableCell align="center">
                    <OptionButton banAppeal={e} session={session} />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        <TablePaginationSP page={page} limit={limit} total={response.total} />
      </TableContainer>
    </Paper>
  );
}

export function BanAppealTableSkeleton() {
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
                <div className="flex flex-col gap-2">
                  <div className="h-4 w-20 animate-pulse rounded bg-gray-300"></div>
                  <div className="h-4 w-48 animate-pulse rounded bg-gray-300"></div>
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
