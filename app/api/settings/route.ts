import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { updateSettingsSchema } from "@/app/lib/validation";

export async function GET() {
  try {
    // Get or create settings (there should only be one settings record)
    let settings = await prisma.settings.findFirst();

    if (!settings) {
      // Create default settings if none exist
      settings = await prisma.settings.create({
        data: {},
      });
    }

    return NextResponse.json(settings);
  } catch (error: any) {
    console.error("Error fetching settings:", error);
    return NextResponse.json(
      { error: "Failed to fetch settings" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = updateSettingsSchema.parse(body);

    // Get or create settings
    let settings = await prisma.settings.findFirst();

    if (!settings) {
      settings = await prisma.settings.create({
        data: validated,
      });
    } else {
      settings = await prisma.settings.update({
        where: { id: settings.id },
        data: validated,
      });
    }

    return NextResponse.json(settings);
  } catch (error: any) {
    console.error("Error updating settings:", error);
    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: "Invalid input", details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to update settings" },
      { status: 500 }
    );
  }
}
