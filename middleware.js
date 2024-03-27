import { NextRequest } from "next/server";
import { updateSession } from "./action";
import { cookies } from "next/headers";

export async function middleware(request) {
  "use server";

  const session = cookies().get("session")?.value;

  if (!session && request.nextUrl.pathname.startsWith('/profile')) {
    return Response.redirect(new URL('/login', request.url))
  }

  return await updateSession(request);
}