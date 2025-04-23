import { Button } from "@mui/material";
import { getUser, userLogout } from "@/libs/auth";
import AvatarIcon from "@/components/AvatarIcon";
import UserDetail from "./userDetail";

export default async function Profile({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getUser(id);
  if (!user.data) return <main>Cannot fetch User</main>;

  return (
    <main className="p-4">
      <h1>Profile</h1>
      <div className="mx-auto mt-4 mb-12 flex w-[650px] flex-col items-center gap-8 rounded-xl border py-4 pb-16 shadow-2xl">
        <div className="flex flex-col gap-2">
          <AvatarIcon props={{ sx: { width: 150, height: 150, fontSize: "6rem" } }} name={user.data.name} />
          <span className="text-center text-3xl">{user.data.name}</span>
        </div>
        <UserDetail phone={user.data.phone} email={user.data.email} since={new Date(user.data.createdAt)} />
        <form action={userLogout.bind(undefined, "/profile")}>
          <Button type="submit" color="error" variant="contained">
            Logout
          </Button>
        </form>
      </div>
    </main>
  );
}
