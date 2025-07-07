import { AuthResponse } from "@/lib/hooks/useAuthMutation";
import { revalidatePath } from "next/cache";
// app/api/auth/set-cookie/route.ts
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  if (req.method !== "POST")
    new NextResponse("Method Not Allowed", { status: 405 });

  // 1) Parse JSON body
  const { token, userId, expiresAt } = (await req.json()) as AuthResponse;

  if (!token || !userId || !expiresAt) {
    return new NextResponse("Bad Request", { status: 400 });
  }

  // 2) Create a response object
  const res = NextResponse.json({ ok: true });

  // 3) Set cookies
  // HTTP‑only token cookie (not readable by JS)
  const cookieStore = await cookies();
  cookieStore.set("token", token, {
    httpOnly: true,
    //for development, you can set secure to false
    secure: false, // Set to true in production
    sameSite: "lax", // "lax" is a good default for CSRF protection
    path: "/", // cookie is valid for the entire site
    expires: new Date(expiresAt), // Set cookie expiration based on expiresAt
  });

  // Optional userId cookie (readable by client)
  cookieStore.set("userId", String(userId), {
    path: "/",
    expires: new Date(expiresAt), // Set cookie expiration based on expiresAt
  });

  revalidatePath("/", "layout");

  return res;
}
