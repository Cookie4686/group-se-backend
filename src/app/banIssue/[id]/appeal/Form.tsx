"use client";

import { useActionState, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button, TextField } from "@mui/material";
import { createBanAppeal } from "@/libs/banAppeal";
import { checkBanIssue } from "@/libs/api/checkBan";

export default function CreateAppealForm() {
  const [state, action, pending] = useActionState(createBanAppeal, undefined);
  const { id } = useParams();
  const router = useRouter();

  useEffect(() => {
    if (state?.success && state.data) {
      router.push(`/banIssue/${state.data.banIssue}/${state.data._id}`);
    }
  }, [state, router]);

  const [isBanned, setBanned] = useState<boolean | undefined>(undefined);
  useEffect(() => {
    if (id) {
      checkBanIssue(id.toString()).then((e) => {
        if (e.success) {
          setBanned(e.isBanned);
        }
      });
    }
  });

  return (
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
        multiline
      />
      {isBanned ?
        <Button variant="contained" type="submit" disabled={pending}>
          Make an appeal
        </Button>
      : <div className="text-center text-lg font-semibold text-green-600">Already Resolved</div>}
      {state?.message && <span>{state.message}</span>}
    </form>
  );
}
