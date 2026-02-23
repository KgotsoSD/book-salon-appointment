const STORAGE_KEY = 'salon_bookings';

export function getBookings() {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveBooking(booking) {
  const list = getBookings();
  const next = [...list, { ...booking, id: crypto.randomUUID(), createdAt: new Date().toISOString() }];
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  return next;
}

export function getBookingsForUser(userId) {
  const list = getBookings();
  if (!userId) return [];
  return list.filter((b) => b.userId === userId);
}
