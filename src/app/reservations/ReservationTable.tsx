import Image from "next/image";
import clsx from "clsx";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TablePaginationSP from "@/components/TablePaginationSP";
import { auth } from "@/auth";
import { getReservations } from "@/libs/reservations";
import { concatAddress } from "@/utils";
import { UserGroupIcon, UserIcon, UsersIcon } from "@heroicons/react/24/outline";
import SearchFieldSP from "@/components/SearchFieldSP";
import AvatarIcon from "@/components/AvatarIcon";
import DateCell from "./ReserveDateCell";
import FilterDialog from "./FilterDialog";
import OptionButton from "./OptionButton";

export default async function ReservationTable({
  page,
  limit,
  search,
  min,
  max,
}: {
  page: number;
  limit: number;
  search: string;
  min?: number;
  max?: number;
}) {
  const response = await getReservations(
    min && max ? { personCount: { $gte: min, $lte: max } } : {},
    page,
    limit,
    search
  );
  if (!response.data) return <main>Cannot fetch data</main>;

  const session = await auth();
  if (!session) return <main>Login to view reservations</main>;

  return (
    <div className="mx-auto max-w-5xl rounded-3xl border p-8">
      <div className="flex items-center justify-center gap-4 pb-2">
        <SearchFieldSP search={search} />
        <FilterDialog />
      </div>
      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <TableCell align="left">Name</TableCell>
                <TableCell align="left">Date</TableCell>
                <TableCell align="left">Status</TableCell>
                <TableCell align="left">User</TableCell>
                <TableCell align="center"></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {response.data.map((e) => {
                const startDate = new Date(e.startDate);
                const endDate = new Date(e.endDate);
                return (
                  <TableRow key={e._id} hover role="checkbox" tabIndex={-1}>
                    <TableCell align="left">
                      <div className="flex items-center gap-4">
                        <Image
                          className="aspect-square h-12 object-cover"
                          src={e.coworkingSpace.picture || "/img/BOT-learning-center.jpg"}
                          alt="coworking image"
                          width={48}
                          height={48}
                        />
                        <div className="flex flex-col gap-2">
                          <span className="font-bold">{e.coworkingSpace.name}</span>
                          <span>{concatAddress(e.coworkingSpace)}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell align="left">
                      <DateCell startDate={startDate} endDate={endDate}></DateCell>
                    </TableCell>
                    <TableCell align="left">
                      <div className="grid w-fit grid-cols-[auto_auto] grid-rows-[auto_auto] items-center gap-2">
                        {(e.personCount == 1 && <UserIcon width="1rem" height="1rem" />)
                          || (e.personCount == 2 && <UsersIcon width="1rem" height="1rem" />) || (
                            <UserGroupIcon width="1rem" height="1rem" />
                          )}
                        <span>{e.personCount}</span>
                        <span
                          className={clsx(
                            "inline-block aspect-square h-2 w-2 justify-self-center rounded-full",
                            e.approvalStatus == "pending" && "bg-amber-300",
                            e.approvalStatus == "canceled" && "bg-red-300",
                            e.approvalStatus == "rejected" && "bg-red-500",
                            e.approvalStatus == "approved" && "bg-green-500"
                          )}
                        ></span>
                        <span>{e.approvalStatus}</span>
                      </div>
                    </TableCell>
                    <TableCell align="left">
                      <div className="flex items-center gap-2">
                        <AvatarIcon
                          props={{ sx: { width: 24, height: 24, fontSize: "0.875rem" } }}
                          name={e.user.name}
                        />
                        <span>{e.user.name}</span>
                      </div>
                    </TableCell>
                    <TableCell align="center">
                      <OptionButton reservation={e} session={session} />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          <TablePaginationSP page={page} limit={limit} total={response.total} />
        </TableContainer>
      </Paper>
    </div>
  );
}
