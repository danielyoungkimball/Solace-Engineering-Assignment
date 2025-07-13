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
    const like = (col: string) => `${col} ILIKE '%${q}%'`;
    whereClause = sql.raw(
      [
        like("first_name"),
        like("last_name"),
        like("city"),
        like("degree"),
        `payload::text ILIKE '%${q}%'`,
        `CAST(years_of_experience AS TEXT) ILIKE '%${q}%'`,
        `CAST(phone_number AS TEXT) ILIKE '%${q}%'`,
      ].join(" OR ")
    );
  }

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
  const total = Number(countResult[0]?.count) || 0;

  return Response.json({
    data,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  });
}
