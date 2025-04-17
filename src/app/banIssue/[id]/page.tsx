import Link from "next/link";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { getBanIssue } from "@/libs/banIssue";
import AvatarIcon from "@/components/AvatarIcon";
import clsx from "clsx";

export default async function BanIssue({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const response = await getBanIssue(id);
  if (!response.data) return <main>{response.message ? response.message : "Cannot fetch data"}</main>;

  const { banIssue, banAppeals } = response.data;
  const createdAt = new Date(banIssue.createdAt);
  const endDate = new Date(banIssue.endDate);

  return (
    <main className="p-4">
      <div className="mx-auto flex max-w-5xl flex-col gap-8 rounded-3xl border p-8">
        <div className="flex w-full flex-col gap-8">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <h1 className="!text-left">{banIssue.title}</h1>
              <div className="flex items-center gap-2">
                <span
                  className={clsx(
                    "inline-block aspect-square h-2 w-2 justify-self-center rounded-full",
                    banIssue.isResolved ? "bg-green-500" : "bg-red-500"
                  )}
                ></span>
                <span>{banIssue.isResolved ? "Resolved" : "Not Resolved"}</span>
              </div>
            </div>
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-2 rounded border px-4 py-2">
                <span>Issuer: </span>
                <AvatarIcon
                  name={banIssue.admin.name}
                  props={{ sx: { width: "1.25rem", height: "1.25rem", fontSize: "0.75rem" } }}
                />
                <span>{banIssue.admin.name}</span>
              </div>
              <div className="flex items-center gap-2 rounded border px-4 py-2">
                <span>Target: </span>
                <AvatarIcon
                  name={banIssue.user.name}
                  props={{ sx: { width: "1.25rem", height: "1.25rem", fontSize: "0.75rem" } }}
                />
                <span>{banIssue.user.name}</span>
              </div>
            </div>
            <div className="flex w-fit gap-4">
              <span>Issue At: {createdAt.toLocaleString()}</span>
              <span>End At: {endDate.toLocaleString()}</span>
            </div>
          </div>
          <span>Description: {banIssue.description}</span>
        </div>
        <section>
          <span>Appeals: </span>
          {banAppeals.map((e) => (
            <Link href={`/banIssue/${id}/${e._id}`} key={e._id}>
              Appeal: {e.description}
            </Link>
          ))}
        </section>
        <Link className="flex items-center gap-4" href={`/banIssue`}>
          <ArrowLeftIcon width="1rem" height="1rem" strokeWidth="0.125rem" />
          <span>View Ban Issues</span>
        </Link>
      </div>
    </main>
  );
}
