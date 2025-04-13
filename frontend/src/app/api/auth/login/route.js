import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ message: "Logged in successfully" });

  response.cookies.set("isLoggedIn", "true", {
    httpOnly: true,
    path: "/",
  });

  return response;
}
