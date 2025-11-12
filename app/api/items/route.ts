import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { createItemSchema } from "@/app/lib/validation";

export async function GET(request: NextRequest) {
  try {
    const items = await prisma.item.findMany({
      orderBy: { name: "asc" },
    });
    return NextResponse.json(items);
  } catch (error) {
    console.error("Error fetching items:", error);
    return NextResponse.json(
      { error: "Failed to fetch items" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = createItemSchema.parse(body);

    // Check for duplicate item name (case-insensitive)
    // The database will also enforce this via unique index, but we provide a better error message here
    const existingItems = await prisma.item.findMany({
      where: {
        name: {
          mode: "insensitive",
          equals: validated.name,
        },
      },
    });

    if (existingItems.length > 0) {
      return NextResponse.json(
        {
          error: "Item already exists",
          details: `An item with the name "${validated.name}" already exists. Please use a different name.`,
        },
        { status: 409 } // Conflict status code
      );
    }

    const item = await prisma.item.create({
      data: validated,
    });

    return NextResponse.json(item, { status: 201 });
  } catch (error: any) {
    console.error("Error creating item:", error);
    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: "Invalid input", details: error.errors },
        { status: 400 }
      );
    }
    // Handle unique constraint violation from database
    if (error.code === "P2002") {
      return NextResponse.json(
        {
          error: "Item already exists",
          details: `An item with this name already exists. Please use a different name.`,
        },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: "Failed to create item" },
      { status: 500 }
    );
  }
}
