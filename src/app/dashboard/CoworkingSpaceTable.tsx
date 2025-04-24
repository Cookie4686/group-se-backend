import Image from "next/image";
import Link from "next/link";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { getCoworkingSpaces } from "@/libs/coworkingSpace";
import { concatAddress } from "@/utils";
import SearchFieldSP from "@/components/SearchFieldSP";
import TablePaginationSP from "@/components/TablePaginationSP";
import { Session } from "next-auth";
import CoworkingSpaceOptionButton from "@/components/coworkingSpace/OptionButton";

export default async function CWSTable({
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
  const response = await getCoworkingSpaces(
    { name: { $regex: search }, ...(session.user.role != "admin" ? { owner: session.user.id } : {}) },
    page,
    limit
  );
  if (!response.data) return <main>Cannot fetch data</main>;
  const { data: coworkingSpaces } = response;
  return (
    <div className="mx-auto max-w-5xl rounded-3xl border p-8">
      <div className="flex items-center justify-center gap-8 pb-2">
        <SearchFieldSP search={search} />
        <Link href="/dashboard/create">
          <Button type="submit" color="primary" variant="contained">
            + New
          </Button>
        </Link>
      </div>
      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <TableCell align="left">Name</TableCell>
                <TableCell align="left">Status</TableCell>
                <TableCell align="center"></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {coworkingSpaces.map((e) => (
                <TableRow key={e._id} hover role="checkbox" tabIndex={-1}>
                  <TableCell align="left">
                    <div className="flex items-center gap-2">
                      <Image
                        className="aspect-square h-12 rounded-xl object-cover"
                        src={e.picture || "/img/BOT-learning-center.jpg"}
                        alt="coworking image"
                        width={48}
                        height={48}
                      />
                      <div className="flex flex-col gap-1">
                        <span className="font-bold">{e.name}</span>
                        <span>{concatAddress(e)}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell align="left">Status</TableCell>
                  <TableCell align="center">
                    <CoworkingSpaceOptionButton id={e._id} viewInfo viewReserve edit deleteOption />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <TablePaginationSP page={page} limit={limit} total={response.total} />
        </TableContainer>
      </Paper>
    </div>
  );
}
