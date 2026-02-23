import sql from "@/app/api/utils/sql";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const salonId = searchParams.get("salon_id");

    let services;
    if (salonId) {
      services = await sql`
        SELECT * FROM services
        WHERE salon_id = ${salonId}
        ORDER BY price ASC
      `;
    } else {
      services = await sql`
        SELECT * FROM services
        ORDER BY created_at DESC
      `;
    }

    return Response.json(services);
  } catch (error) {
    console.error("Error fetching services:", error);
    return Response.json(
      { error: "Failed to fetch services" },
      { status: 500 },
    );
  }
}
