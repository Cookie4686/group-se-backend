"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import { InputAdornment, TextField } from "@mui/material";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

export default function SearchFieldSP({ search }: { search: string }) {
  const [pathname, searchParams] = [usePathname(), useSearchParams()];
  const { replace } = useRouter();

  const handleSearch = useDebouncedCallback((value: string) => {
    if (value == search) return;
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set("search", value);
      params.delete("page");
    } else {
      params.delete("search");
    }
    replace(`${pathname}?${params.toString()}`);
  }, 234);

  return (
    <TextField
      className="w-md"
      variant="outlined"
      placeholder="Search..."
      defaultValue={search}
      onChange={(e) => handleSearch(e.target.value)}
      slotProps={{
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <MagnifyingGlassIcon width="1rem" height="1rem" />
            </InputAdornment>
          ),
        },
      }}
    />
  );
}
