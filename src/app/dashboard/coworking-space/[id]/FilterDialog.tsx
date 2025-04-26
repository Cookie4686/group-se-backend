"use client";

import { useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import Slider from "@mui/material/Slider";
import { AdjustmentsHorizontalIcon, UsersIcon } from "@heroicons/react/24/outline";

export default function FilterDialog() {
  const [pathname, searchParams, { replace }] = [usePathname(), useSearchParams(), useRouter()];
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<number[]>([
    Number(searchParams.get("min")) || 1,
    Number(searchParams.get("max")) || 3,
  ]);

  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleClear = () => {
    const params = new URLSearchParams(searchParams);
    if (params.has("min") || params.has("max")) {
      params.delete("min");
      params.delete("max");
      params.delete("page");
    }
    replace(`${pathname}?${params.toString()}`);
    handleClose();
  };
  const handleSubmit = () => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set("min", value[0].toString());
      params.set("max", value[1].toString());
      params.delete("page");
    } else {
      params.delete("min");
      params.delete("max");
    }
    replace(`${pathname}?${params.toString()}`);
    handleClose();
  };

  return (
    <>
      <IconButton size="small" onClick={handleClickOpen}>
        <AdjustmentsHorizontalIcon width="1rem" height="1rem" />
      </IconButton>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Filters</DialogTitle>
        <DialogContent>
          <div className="py-4">
            <div className="flex items-center gap-4 pt-4">
              <UsersIcon width="2rem" height="2rem" />
              <Slider
                className="min-w-24"
                min={1}
                max={10}
                step={1}
                value={value}
                valueLabelDisplay="auto"
                onChange={(e, value) => setValue(value)}
              />
            </div>
            <Button variant="contained" color="error" onClick={handleClear}>
              Clear Filter
            </Button>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit}>Apply</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
