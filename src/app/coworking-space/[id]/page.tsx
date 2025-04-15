import Image from "next/image";
import Link from "next/link";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { auth } from "@/auth";
import { getCoworkingSpace } from "@/libs/coworkingSpace";
import ReserveForm from "./ReserveForm";
import DetailBody from "./DetailBody";

export default async function CoworkingSpaceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const response = await getCoworkingSpace(id);
  if (!response.data) return <main>Cannot fetch data</main>;
  const { data: coworkingSpace } = response;

  const session = await auth();

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
          <DetailBody coworkingSpace={coworkingSpace}></DetailBody>
        </div>
        <section className="p-4">
          {session ?
            <>
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
