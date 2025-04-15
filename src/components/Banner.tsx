"use client";
import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function Banner() {
  const covers = ["/img/cover.jpg", "/img/cover2.jpg", "/img/cover3.jpg"];
  const [index, setIndex] = useState(0);
  const router = useRouter();
  const { data: session } = useSession();

  return (
    <div className="relative h-[80vh] w-screen p-1" onClick={() => setIndex(index + 1)}>
      <Image src={covers[index % 3]} alt="cover" fill={true} objectFit="cover" />
      <div className="relative top-2/5 z-10 -translate-y-1/2 text-center">
        <h1 className="text-4xl font-medium">Co-working Space</h1>
        <h3 className="font-serif text-xl">Find Co-working Space and Meeting Rooms</h3>
      </div>
      {session ?
        <div className="absolute top-5 right-10 z-30 text-xl font-semibold text-cyan-800">
          Hello {session.user?.name}
        </div>
      : null}
      <button
        className="absolute right-0 bottom-0 z-30 m-2 rounded border border-cyan-600 bg-white px-2 py-2 font-semibold text-cyan-600 hover:border-transparent hover:bg-cyan-600 hover:text-white"
        onClick={(e) => {
          e.stopPropagation();
          router.push("/coworking-space");
        }}
      >
        Select Your Co-working Space NOW
      </button>
    </div>
  );
}
