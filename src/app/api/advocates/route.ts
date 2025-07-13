import { and, or, ilike, sql } from "drizzle-orm";
import db from "../../../db";
import { advocates } from "../../../db/schema";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.toLowerCase() || "";
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "10", 10);
  const offset = (page - 1) * limit;

  let whereClause;
  if (q) {
    whereClause = or(
      ilike(advocates.firstName, `%${q}%`),
      ilike(advocates.lastName, `%${q}%`),
      ilike(advocates.city, `%${q}%`),
      ilike(advocates.degree, `%${q}%`)
    );
  }

  // Paginated results
  let data;
  if (whereClause) {
    data = await db
      .select()
      .from(advocates)
      .where(whereClause)
      .orderBy(advocates.id)
      .limit(limit)
      .offset(offset);
  } else {
    data = await db
      .select()
      .from(advocates)
      .orderBy(advocates.id)
      .limit(limit)
      .offset(offset);
  }

  // Total count
  let countResult;
  if (whereClause) {
    countResult = await db
      .select({ count: sql`COUNT(*)::int` })
      .from(advocates)
      .where(whereClause);
  } else {
    countResult = await db
      .select({ count: sql`COUNT(*)::int` })
      .from(advocates);
  }
  const total = countResult[0]?.count || 0;

  return Response.json({
    data,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(Number(total) / limit),
    },
  });
}
