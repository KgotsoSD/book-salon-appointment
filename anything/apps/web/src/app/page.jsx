import { Link } from 'react-router';
import { salon } from './data/salons';

export default function HomePage() {
  return (
    <div className="max-w-3xl mx-auto text-center py-12 sm:py-16">
      <h1 className="text-4xl sm:text-5xl font-serif font-bold text-[#1a1a1a] mb-4">
        Welcome to {salon.name}
      </h1>
      <p className="text-lg text-[#666] mb-10 max-w-xl mx-auto">
        Book your next appointment with us. Choose a service, pick a time, and we’ll take care of the rest.
      </p>
      <Link
        to="/book"
        className="inline-flex items-center gap-2 py-3 px-6 rounded-xl bg-[#c45c6a] text-white font-medium no-underline hover:bg-[#a84a56] transition-colors"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        Book appointment
      </Link>
    </div>
  );
}
