import { Link, useLocation } from 'react-router';
import { useSession } from '@auth/create/react';
import useAuth from '../../utils/useAuth';

const NAV = [
  { to: '/book', label: 'Book Appointment', icon: 'calendar' },
  { to: '/my-bookings', label: 'My Bookings', icon: 'clock' },
  { to: '/salon-dashboard', label: 'Salon Dashboard', icon: 'grid' },
  { to: '/manage-bookings', label: 'Manage Bookings', icon: 'list' },
  { to: '/salon-setup', label: 'Salon Setup', icon: 'settings' },
];

const STEPS = [
  { key: 'service', label: 'Choose Service', icon: 'scissors', path: '/book' },
  { key: 'time', label: 'Pick Time', icon: 'clock', path: '/book/time' },
  { key: 'confirm', label: 'Confirm', icon: 'check', path: '/book/confirm' },
];

function NavIcon({ name }) {
  const icons = {
    calendar: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    clock: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    grid: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
      </svg>
    ),
    list: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
      </svg>
    ),
    settings: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 2.31.826 1.37 1.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 2.31-1.37 1.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-2.31-.826-1.37-1.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-2.31 1.37-1.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    home: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
    scissors: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879M12 12L9.121 9.121m0 5.758a3 3 0 10-4.243 4.243 3 3 0 004.243-4.243zm0-5.758a3 3 0 10-4.243-4.243 3 3 0 004.243 4.243z" />
      </svg>
    ),
    check: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    ),
  };
  return icons[name] || null;
}

export function AppLayout({ children }) {
  const location = useLocation();
  const pathname = location?.pathname ?? '';
  const isBookFlow = pathname.startsWith('/book');
  const { data: session, status } = useSession();
  const { signOut } = useAuth();
  const isAuthenticated = status === 'authenticated' && session?.user;

  return (
    <div className="min-h-screen bg-[#fafafa] font-sans text-[#1a1a1a]">
      {/* Header */}
      <header className="bg-white border-b border-[#eee] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-14">
          <Link to="/" className="flex items-center gap-2 text-[#1a1a1a] font-bold text-lg no-underline">
            <span className="text-[#c45c6a]">★</span>
            <span>SalonBooker</span>
          </Link>
          <nav className="flex items-center gap-4 sm:gap-6">
            {NAV.map(({ to, label, icon }) => (
              <Link
                key={to}
                to={to}
                className="flex items-center gap-1.5 text-sm text-[#444] hover:text-[#c45c6a] no-underline transition-colors"
              >
                <NavIcon name={icon} />
                <span className="hidden sm:inline">{label}</span>
              </Link>
            ))}
            {isAuthenticated ? (
              <button
                type="button"
                onClick={() => signOut({ callbackUrl: '/' })}
                className="flex items-center gap-1.5 text-sm text-[#444] hover:text-[#c45c6a] transition-colors bg-transparent border-none cursor-pointer"
              >
                <span className="hidden sm:inline">Sign out</span>
                <span className="sm:hidden">Out</span>
              </button>
            ) : (
              <Link
                to="/account/signin"
                className="flex items-center gap-1.5 text-sm text-[#444] hover:text-[#c45c6a] no-underline transition-colors"
              >
                <span className="hidden sm:inline">Sign in</span>
                <span className="sm:hidden">In</span>
              </Link>
            )}
          </nav>
        </div>
      </header>

      {/* Booking progress (only in book flow) */}
      {isBookFlow && (
        <div className="bg-[#f0f0f0] border-b border-[#e5e5e5]">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              {STEPS.map((step, i) => {
                const isActive =
                  step.path === '/book'
                    ? pathname === '/book'
                    : pathname.startsWith(step.path);
                return (
                  <div key={step.key} className="flex flex-1 items-center">
                    <div className="flex flex-col items-center flex-1">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${
                          isActive ? 'bg-[#e8b4bc] border-[#c45c6a] text-[#8b3a44]' : 'bg-white border-[#ddd] text-[#666]'
                        }`}
                      >
                        <NavIcon name={step.icon} />
                      </div>
                      <span className={`mt-1 text-xs font-medium ${isActive ? 'text-[#8b3a44]' : 'text-[#666]'}`}>
                        {step.label}
                      </span>
                    </div>
                    {i < STEPS.length - 1 && (
                      <div className="flex-1 h-0.5 mx-1 bg-[#ddd] max-w-[60px] sm:max-w-[80px]" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">{children}</main>
    </div>
  );
}
