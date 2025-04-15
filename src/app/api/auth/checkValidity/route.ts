import { checkValidityAPI } from "@/libs/api/checkValidity";
import { NextRequest, NextResponse } from "next/server";

// authjs middleware edge runtime bypass
export async function POST(request: NextRequest) {
  const data = await request.json();
  const { email, password } = data;
  return NextResponse.json(await checkValidityAPI(email, password));
}
