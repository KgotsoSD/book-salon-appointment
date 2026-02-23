import sql from "@/app/api/utils/sql";

export async function GET(request, { params }) {
  try {
    const { id } = params;

    const bookings = await sql`
      SELECT 
        b.*,
        s.name as salon_name,
        s.location as salon_location,
        sv.name as service_name,
        sv.duration_minutes,
        sv.price
      FROM bookings b
      JOIN salons s ON b.salon_id = s.id
      JOIN services sv ON b.service_id = sv.id
      WHERE b.id = ${id}
    `;

    if (bookings.length === 0) {
      return Response.json({ error: "Booking not found" }, { status: 404 });
    }

    return Response.json(bookings[0]);
  } catch (error) {
    console.error("Error fetching booking:", error);
    return Response.json({ error: "Failed to fetch booking" }, { status: 500 });
  }
}

export async function PATCH(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();
    const { status, notes } = body;

    // Build update query dynamically
    let updateQuery = "UPDATE bookings SET ";
    const updates = [];
    const values = [];
    let paramIndex = 1;

    if (status) {
      updates.push(`status = $${paramIndex}`);
      values.push(status);
      paramIndex++;
    }

    if (notes !== undefined) {
      updates.push(`notes = $${paramIndex}`);
      values.push(notes);
      paramIndex++;
    }

    if (updates.length === 0) {
      return Response.json({ error: "No fields to update" }, { status: 400 });
    }

    updateQuery += updates.join(", ");
    updateQuery += ` WHERE id = $${paramIndex} RETURNING *`;
    values.push(id);

    const result = await sql(updateQuery, values);

    if (result.length === 0) {
      return Response.json({ error: "Booking not found" }, { status: 404 });
    }

    return Response.json(result[0]);
  } catch (error) {
    console.error("Error updating booking:", error);
    return Response.json(
      { error: "Failed to update booking" },
      { status: 500 },
    );
  }
}
