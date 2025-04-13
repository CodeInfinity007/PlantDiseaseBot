import { NextResponse } from "next/server";

export async function GET(req) {
  const isLoggedIn = req.cookies.get("isLoggedIn") === "true";
  return NextResponse.json({ isLoggedIn });
}
