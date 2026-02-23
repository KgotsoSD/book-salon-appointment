import sql from "@/app/api/utils/sql";

export async function GET(request, { params }) {
  try {
    const { id } = params;

    const services = await sql`
      SELECT * FROM services
      WHERE id = ${id}
    `;

    if (services.length === 0) {
      return Response.json({ error: "Service not found" }, { status: 404 });
    }

    return Response.json(services[0]);
  } catch (error) {
    console.error("Error fetching service:", error);
    return Response.json({ error: "Failed to fetch service" }, { status: 500 });
  }
}
