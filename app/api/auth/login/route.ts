import { NextResponse } from "next/server";

const MOCK_USER = {
  id: "user-001",
  name: "Aroosha Fatima",
  email: "arooshafatima1006@gmail.com",
  cnic: "3720363404654",
  role: "SUPER_ADMIN",
};

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { email, cnic, password } = body;

    if (!email || !cnic || !password) {
      return NextResponse.json(
        {
          success: false,
          message: "All fields are required.",
        },
        { status: 400 }
      );
    }

    // Mock user credentials
    if (
      email !== "arooshafatima1006@gmail.com" ||
      cnic !== "0000987654321" ||
      password !== "123456789"
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid email, CNIC, or password.",
        },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Login successful.",
      user: MOCK_USER,
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong. Please try again.",
      },
      { status: 500 }
    );
  }
}