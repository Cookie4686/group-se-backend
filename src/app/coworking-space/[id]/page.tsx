import Image from "next/image";
import Link from "next/link";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { getCoworkingSpace } from "@/libs/coworkingSpace";
import ReserveForm from "./ReserveForm";
import DetailBody from "./DetailBody";
import { checkBanAPI } from "@/libs/api/checkBan";
import CoworkingSpaceOptionButton from "@/components/coworkingSpace/OptionButton";
import { auth } from "@/auth";

export default async function CoworkingSpaceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const [{ id }, session] = await Promise.all([params, auth()]);
  const response = await getCoworkingSpace(id, session);
  if (!response.data) return <main>Cannot fetch data</main>;
  const { data: coworkingSpace } = response;

  return (
    <main className="p-4">
      <div className="mx-auto max-w-5xl rounded-3xl border p-8">
        <div className="flex w-full gap-8">
          <Image
            className="w-[50%] rounded-lg"
            src={coworkingSpace.picture || "/img/BOT-learning-center.jpg"}
            alt="CoworkingSpace Image"
            width={0}
            height={0}
            sizes="50vw"
            priority
          />
          <div className="w-[50%]">
            <div className="flex w-full items-center gap-2">
              <div className="flex w-full items-center justify-between">
                <h1 className="!text-left font-bold">{coworkingSpace.name}</h1>
                {coworkingSpace.privilage == "admin" && (
                  <CoworkingSpaceOptionButton id={coworkingSpace._id} edit viewReserve deleteOption />
                )}
              </div>
            </div>
            <span className="mb-8 inline-block">{coworkingSpace.description}</span>
            <DetailBody coworkingSpace={coworkingSpace} />
          </div>
        </div>
        <section className="p-4">
          {session ?
            (await checkBanAPI(session.user.id)).isBanned ?
              <span>You cannot reserve because you are banned</span>
            : <>
                <h2 className="text-center text-xl">Reserve {coworkingSpace.name}</h2>
                <ReserveForm id={id} />
              </>

          : <div className="mt-2 mb-2 text-center text-lg">
              <Link className="hover:text-cyan-600" href={`/login?callbackUrl=/coworking-space/${id}`}>
                Login to reserve
              </Link>
            </div>
          }
        </section>
        <Link className="flex items-center gap-4" href={`/coworking-space`}>
          <ArrowLeftIcon width="1rem" height="1rem" strokeWidth="0.125rem" />
          <span>View Coworking-Spaces</span>
        </Link>
      </div>
    </main>
  );
}
