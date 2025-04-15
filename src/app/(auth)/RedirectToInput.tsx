"use client";

import { useSearchParams } from "next/navigation";

export default function RedirectToInput() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");
  return <input type="text" value={callbackUrl || "/profile"} name="redirectTo" readOnly hidden />;
}
