"use server";

type APIResponse =
  | {
      success: true;
      token: string;
      data: { _id: string; name: string; email: string; role: "user" | "admin" };
    }
  | { success: false; data: null };

export async function registerAPI(payload: {
  [P in "name" | "email" | "phone" | "password"]: string;
}): Promise<APIResponse> {
  return (await fetch(`${process.env.API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    cache: "no-cache",
  }).then((e) => e.json())) as APIResponse;
}

export async function loginAPI(payload: { email: string; password: string }): Promise<APIResponse> {
  return (await fetch(`${process.env.API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    cache: "no-cache",
  }).then((e) => e.json())) as APIResponse;
}
