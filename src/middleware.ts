// middleware.ts
import { NextResponse } from "next/server";

export function middleware(req: any) {
  const jwt = req.cookies.get("jwt")?.value;
  const role = req.cookies.get("role")?.value;

  // Kiểm tra điều kiện
  if (!jwt || !role || role !== "Admin") {
    return NextResponse.redirect(new URL("/", req.url)); // Redirect đến trang chủ
  }

  return NextResponse.next(); // Cho phép tiếp tục request
}

// Chỉ định các route cần bảo vệ
export const config = {
  matcher: ["/admin/:path*"], // Ví dụ: chỉ định các route admin cần bảo vệ
};
