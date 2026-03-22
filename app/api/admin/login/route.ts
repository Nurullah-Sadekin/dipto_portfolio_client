import { NextRequest, NextResponse } from "next/server";
import { areAdminCredentialsValid, createAdminSession } from "@/lib/adminAuth";

type LoginPayload = {
  username?: string;
  password?: string;
};

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as LoginPayload;
    const username = body.username?.trim() ?? "";
    const password = body.password ?? "";

    if (!username || !password) {
      return NextResponse.json(
        { error: "Username and password are required." },
        { status: 400 },
      );
    }

    if (!areAdminCredentialsValid(username, password)) {
      return NextResponse.json(
        { error: "Username or password does not match." },
        { status: 401 },
      );
    }

    await createAdminSession();
    return NextResponse.json({ authenticated: true });
  } catch {
    return NextResponse.json({ error: "Login failed." }, { status: 400 });
  }
}
