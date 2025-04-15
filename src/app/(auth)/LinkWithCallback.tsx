import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React from "react";

export default function LinkWithCallback({
  children,
  targetPath,
}: {
  children: Readonly<React.ReactNode>;
  targetPath: string;
}) {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");

  return (
    <Link
      className="text-blue-400 underline hover:text-blue-600"
      href={`${targetPath}?callbackUrl=${callbackUrl || "/profile"}`}
    >
      {children}
    </Link>
  );
}
