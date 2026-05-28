import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const auth = req.cookies.get("soulj-admin")?.value;

  if (!auth || auth !== process.env.ADMIN_PASSWORD) {
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin",
    "/admin/products",
    "/admin/products/(.*)",
    "/admin/orders",
    "/admin/emails",
    "/admin/theme",
  ],
};
