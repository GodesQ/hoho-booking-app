import { NextRequest } from "next/server";
import { updateSession } from "./action";

export async function middleware(request) {
  "use server";
  return await updateSession(request);
}