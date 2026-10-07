import { NextResponse } from "next/server";
import { tenants } from "@/data/tenants";

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      data: tenants,
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch tenants.",
      },
      { status: 500 }
    );
  }
}