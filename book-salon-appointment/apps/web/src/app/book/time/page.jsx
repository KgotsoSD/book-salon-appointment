import { Link, useSearchParams } from 'react-router';
import { salon } from '../../data/salons';

const MOCK_SLOTS = ['9:00 AM', '10:00 AM', '11:00 AM', '2:00 PM', '3:00 PM', '4:00 PM'];

export default function PickTimePage() {
  const [searchParams] = useSearchParams();
  const serviceId = searchParams.get('service');

  if (!serviceId) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <p className="text-[#666] mb-4">Please select a service first.</p>
        <Link to="/book" className="text-[#c45c6a] font-medium no-underline hover:underline">
          ← Choose service
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Link to="/book" className="inline-flex items-center gap-1 text-[#666] text-sm mb-6 no-underline hover:text-[#c45c6a]">
        ← Back to services
      </Link>
      <h1 className="text-3xl font-serif font-bold text-[#1a1a1a] mb-2">Pick Time</h1>
      <p className="text-[#666] mb-8">Choose a slot at {salon.name}</p>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {MOCK_SLOTS.map((slot) => (
          <Link
            key={slot}
            to={`/book/confirm?service=${serviceId}&time=${encodeURIComponent(slot)}`}
            className="p-4 rounded-xl border border-[#eee] bg-white text-center font-medium hover:border-[#e8b4bc] hover:bg-[#fef8f9] transition-all no-underline text-[#1a1a1a]"
          >
            {slot}
          </Link>
        ))}
      </div>
    </div>
  );
}
