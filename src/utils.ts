import { CWS } from "./libs/db/models/CoworkingSpace";

const protectedPages = [
  "/banIssue.*",
  "/banAppeal",
  "/coworking-space/.*/edit",
  "/reservations.*",
  "/dashboard.*",
];
const protectedPathnameRegex = RegExp(`^(${protectedPages.flatMap((p) => p).join("|")})/?$`, "i");
export function isProtectedPage(pathname: string) {
  return protectedPathnameRegex.test(pathname);
}

export function concatAddress(coworkingSpace: CWS) {
  return `${coworkingSpace.address} ${coworkingSpace.district} ${coworkingSpace.subDistrict} ${coworkingSpace.province}, ${coworkingSpace.postalcode}`;
}

type SearchParams = { [key: string]: string | string[] | undefined };

export function readSearchParams(params: SearchParams, key: string) {
  return params[key] instanceof Array ? params[key][0] : params[key];
}

export function readPaginationSearchParams(params: SearchParams) {
  return {
    page: (Number(readSearchParams(params, "page")) || 1) - 1,
    limit: Number(readSearchParams(params, "limit")) || undefined,
  };
}

export function validateRegex(value: string) {
  try {
    new RegExp(value);
  } catch {
    return "^$.";
  }
  return value;
}
