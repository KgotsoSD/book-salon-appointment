import { Link } from 'react-router';
import { useSession } from '../../utils/session';
import { getBookingsForUser } from '../utils/bookings';
import { useMemo } from 'react';

export default function MyBookingsPage() {
  const { data: session, status } = useSession();
  const userId = session?.user?.id ?? session?.user?.email ?? null;
  const bookings = useMemo(() => (userId ? getBookingsForUser(userId) : []), [userId]);
  const sorted = useMemo(() => [...bookings].sort((a, b) => (b.createdAt > a.createdAt ? 1 : -1)), [bookings]);

  if (status === 'loading') {
    return (
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-serif font-bold text-[#1a1a1a] mb-2">My Bookings</h1>
        <p className="text-[#666]">Loading…</p>
      </div>
    );
  }

  if (!userId) {
    return (
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-serif font-bold text-[#1a1a1a] mb-2">My Bookings</h1>
        <p className="text-[#666] mb-6">Sign in to view your bookings.</p>
        <Link
          to="/account/signin"
          className="inline-flex py-3 px-4 rounded-xl bg-[#c45c6a] text-white font-medium no-underline hover:bg-[#a84a56]"
        >
          Sign in
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-serif font-bold text-[#1a1a1a] mb-2">My Bookings</h1>
      <p className="text-[#666] mb-8">Your upcoming and past appointments.</p>

      {sorted.length === 0 ? (
        <div className="rounded-xl border border-[#eee] bg-white p-8 text-center text-[#666]">
          <p>You have no bookings yet.</p>
          <Link to="/book" className="mt-4 inline-block text-[#c45c6a] font-medium no-underline hover:underline">
            Book an appointment →
          </Link>
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
                  {b.time} · ${b.price}
                </p>
                <p className="text-xs text-[#999] mt-1">
                  {new Date(b.createdAt).toLocaleDateString()}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
