"use client";

import { useState } from "react";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";

export default function DateTimeField({
  name,
  label,
  defaultValue,
  helperText,
}: {
  name: string;
  label?: string;
  defaultValue?: string | null;
  helperText?: string;
}) {
  const [date, setDate] = useState<Dayjs | null>((defaultValue && dayjs(defaultValue)) || null);

  return (
    <>
      <input type="text" name={name} value={date?.toISOString() || ""} hidden readOnly />
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DateTimePicker
          label={label}
          value={date}
          onChange={(value) => setDate(value)}
          slotProps={{ textField: { helperText, error: !!helperText } }}
        />
      </LocalizationProvider>
    </>
  );
}
