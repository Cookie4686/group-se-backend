import { getUser } from "@/libs/auth";
import Link from "next/link";
import UserBanForm from "./Form";
import ArrowLeftIcon from "@heroicons/react/24/outline/ArrowLeftIcon";

export default async function BanUser({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const response = await getUser(id);
  if (!response.data) return <main>Cannot fetch User</main>;
  const { data: user } = response;
  return (
    <main className="p-4">
      <div className="mx-auto max-w-5xl rounded-3xl border p-8">
        <h1>Ban {user.name}</h1>
        <UserBanForm id={id} />
        <Link className="flex items-center gap-4" href={`/banIssue`}>
          <ArrowLeftIcon width="1rem" height="1rem" strokeWidth="0.125rem" />
          <span>View Ban Issues</span>
        </Link>
      </div>
    </main>
  );
}
