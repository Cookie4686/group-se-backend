"use client";

import { useState } from "react";
import { LocalizationProvider, TimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";

export default function TimeField({
  name,
  label,
  defaultValue,
  helperText,
}: {
  name: string;
  label?: string;
  defaultValue?: Date;
  helperText?: string;
}) {
  const [time, setTime] = useState<Dayjs | null>((defaultValue && dayjs(defaultValue)) || null);

  return (
    <>
      <input type="text" name={name} value={time?.toISOString() || ""} hidden readOnly />
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <TimePicker
          label={label}
          value={time}
          onChange={(value) => setTime(value)}
          slotProps={{ textField: { helperText, error: !!helperText } }}
        />
      </LocalizationProvider>
    </>
  );
}
