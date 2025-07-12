import db from "../../../db";
import { advocates } from "../../../db/schema";
import { advocateData } from "../../../db/seed/advocates";

export async function POST() {
  try {
    // Check if database is properly configured
    if (!process.env.DATABASE_URL) {
      return Response.json(
        { error: "Database not configured. Please set DATABASE_URL in .env" },
        { status: 400 }
      );
    }

    // Check if db has insert method (properly configured database)
    if (!('insert' in db)) {
      return Response.json(
        { error: "Database not properly configured" },
        { status: 500 }
      );
    }

    const records = await db.insert(advocates).values(advocateData).returning();
    return Response.json({ advocates: records });
  } catch (error) {
    console.error("Error seeding database:", error);
    return Response.json(
      { error: "Failed to seed database" },
      { status: 500 }
    );
  }
}
