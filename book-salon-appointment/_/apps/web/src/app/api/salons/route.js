import sql from "@/app/api/utils/sql";

export async function GET(request) {
  try {
    const salons = await sql`
      SELECT * FROM salons
      ORDER BY created_at DESC
    `;

    return Response.json(salons);
  } catch (error) {
    console.error("Error fetching salons:", error);
    return Response.json({ error: "Failed to fetch salons" }, { status: 500 });
  }
}
