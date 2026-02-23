import sql from "@/app/api/utils/sql";

export async function GET(request, { params }) {
  try {
    const { id } = params;

    const salons = await sql`
      SELECT * FROM salons
      WHERE id = ${id}
    `;

    if (salons.length === 0) {
      return Response.json({ error: "Salon not found" }, { status: 404 });
    }

    return Response.json(salons[0]);
  } catch (error) {
    console.error("Error fetching salon:", error);
    return Response.json({ error: "Failed to fetch salon" }, { status: 500 });
  }
}
