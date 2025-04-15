"use client";

import { useState } from "react";
import {
  FilledInput,
  FilledInputProps,
  FormControl,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputLabel,
} from "@mui/material";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

export default function PasswordField({
  props,
  helperText,
}: {
  props: FilledInputProps;
  helperText?: string;
}) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <FormControl className="w-full" variant="outlined">
      <InputLabel htmlFor="password" variant="filled">
        Password
      </InputLabel>
      <FilledInput
        {...props}
        required
        id="password"
        type={showPassword ? "text" : "password"}
        className="w-full"
        endAdornment={
          <InputAdornment position="end">
            <IconButton
              aria-label={showPassword ? "hide the password" : "display the password"}
              onClick={() => setShowPassword((show) => !show)}
              onMouseDown={(e) => e.preventDefault()}
              onMouseUp={(e) => e.preventDefault()}
              edge="end"
            >
              {showPassword ?
                <EyeSlashIcon width="1.5rem" height="1.5rem" />
              : <EyeIcon width="1.5rem" height="1.5rem" />}
            </IconButton>
          </InputAdornment>
        }
      />
      {helperText && <FormHelperText error>{helperText}</FormHelperText>}
    </FormControl>
  );
}
