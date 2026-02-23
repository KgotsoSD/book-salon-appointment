import sql from "@/app/api/utils/sql";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const customerEmail = searchParams.get("customer_email");
    const salonId = searchParams.get("salon_id");
    const status = searchParams.get("status");

    let query = `
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
      WHERE 1=1
    `;

    const params = [];
    let paramIndex = 1;

    if (customerEmail) {
      query += ` AND LOWER(b.customer_email) = LOWER($${paramIndex})`;
      params.push(customerEmail);
      paramIndex++;
    }

    if (salonId) {
      query += ` AND b.salon_id = $${paramIndex}`;
      params.push(salonId);
      paramIndex++;
    }

    if (status) {
      query += ` AND b.status = $${paramIndex}`;
      params.push(status);
      paramIndex++;
    }

    query += ` ORDER BY b.booking_date DESC, b.booking_time DESC`;

    const bookings = await sql(query, params);

    return Response.json(bookings);
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return Response.json(
      { error: "Failed to fetch bookings" },
      { status: 500 },
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      salon_id,
      service_id,
      customer_name,
      customer_email,
      customer_phone,
      booking_date,
      booking_time,
      notes,
    } = body;

    // Validate required fields
    if (
      !salon_id ||
      !service_id ||
      !customer_name ||
      !customer_email ||
      !customer_phone ||
      !booking_date ||
      !booking_time
    ) {
      return Response.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Create booking with pending status
    const result = await sql`
      INSERT INTO bookings (
        salon_id,
        service_id,
        customer_name,
        customer_email,
        customer_phone,
        booking_date,
        booking_time,
        notes,
        status
      ) VALUES (
        ${salon_id},
        ${service_id},
        ${customer_name},
        ${customer_email},
        ${customer_phone},
        ${booking_date},
        ${booking_time},
        ${notes || null},
        'pending'
      )
      RETURNING *
    `;

    return Response.json(result[0], { status: 201 });
  } catch (error) {
    console.error("Error creating booking:", error);
    return Response.json(
      { error: "Failed to create booking" },
      { status: 500 },
    );
  }
}
