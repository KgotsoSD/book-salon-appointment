import { useMemo } from 'react';
import { getBookings } from '../utils/bookings';

export default function ManageBookingsPage() {
  const bookings = useMemo(() => getBookings(), []);
  const sorted = useMemo(() => [...bookings].sort((a, b) => (b.createdAt > a.createdAt ? 1 : -1)), [bookings]);

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-serif font-bold text-[#1a1a1a] mb-2">Manage Bookings</h1>
      <p className="text-[#666] mb-8">All bookings for your salon.</p>

      {sorted.length === 0 ? (
        <div className="rounded-xl border border-[#eee] bg-white p-8 text-center text-[#666]">
          <p>No bookings yet. When customers confirm a booking, it will appear here.</p>
        </div>
      ) : (
        <ul className="space-y-3">
          {sorted.map((b) => (
            <li
              key={b.id}
              className="rounded-xl border border-[#eee] bg-white p-4 flex flex-wrap items-center justify-between gap-2"
            >
              <div>
                <p className="font-medium text-[#1a1a1a]">{b.serviceName}</p>
                <p className="text-sm text-[#666]">
                  {b.userName || b.userEmail || 'Guest'} · {b.time} · ${b.price}
                </p>
                <p className="text-xs text-[#999] mt-1">
                  Booked {new Date(b.createdAt).toLocaleString()}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
