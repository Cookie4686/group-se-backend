"use client";

import { useActionState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Button, TextField } from "@mui/material";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { createBanAppeal } from "@/libs/banAppeal";

export default function CreateBanAppeal() {
  const [state, action, pending] = useActionState(createBanAppeal, undefined);
  const { id } = useParams();
  const router = useRouter();

  useEffect(() => {
    if (state?.success && state.data) {
      router.push(`/banIssue/${state.data.banIssue}/${state.data._id}`);
    }
  }, [state, router]);

  return (
    <main className="p-4">
      <h1 className="text-center text-2xl font-bold">Make an appeal</h1>
      <div className="mx-auto max-w-5xl rounded-3xl border p-8">
        <form className="mb-8 flex w-full flex-col gap-8" action={action}>
          <input type="text" name="banIssue" value={id} hidden readOnly />
          <TextField
            name="description"
            label="Appeal Description"
            variant="standard"
            className="w-full font-bold"
            error={!!state?.error?.fieldErrors.description}
            helperText={state?.error?.fieldErrors.description?.join() || null}
            defaultValue={state?.data?.description || null}
          />
          <Button variant="contained" type="submit" disabled={pending}>
            Make an appeal
          </Button>
          {state?.message && <span>{state.message}</span>}
        </form>
        <Link className="flex items-center gap-4" href={`/banIssue/${id}`}>
          <ArrowLeftIcon width="1rem" height="1rem" strokeWidth="0.125rem" />
          <span>View Ban Issue</span>
        </Link>
      </div>
    </main>
  );
}
