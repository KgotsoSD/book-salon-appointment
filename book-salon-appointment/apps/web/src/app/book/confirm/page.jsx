import { Link, useSearchParams, useNavigate } from 'react-router';
import { useSession } from '../../../utils/session';
import { toast } from 'sonner';
import { salon, services } from '../../data/salons';
import { saveBooking } from '../../utils/bookings';

const servicesById = Object.fromEntries(services.map((s) => [s.id, s]));

export default function ConfirmPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { data: session } = useSession();
  const serviceId = searchParams.get('service');
  const time = searchParams.get('time');
  const service = serviceId ? servicesById[serviceId] : null;

  function handleConfirm() {
    const userId = session?.user?.id ?? session?.user?.email ?? 'guest';
    const userEmail = session?.user?.email ?? '';
    const userName = session?.user?.name ?? 'Guest';
    const timeStr = decodeURIComponent(time || '');
    saveBooking({
      userId,
      userEmail,
      userName,
      serviceName: service.name,
      serviceId,
      time: timeStr,
      price: service.price,
    });
    toast.success('Booking confirmed');
    navigate('/', { replace: true });
  }

  if (!service || !time) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <p className="text-[#666] mb-4">Missing booking details. Please start over.</p>
        <Link to="/book" className="text-[#c45c6a] font-medium no-underline hover:underline">
          ← Choose service
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto">
      <Link to={`/book/time?service=${serviceId}`} className="inline-flex items-center gap-1 text-[#666] text-sm mb-6 no-underline hover:text-[#c45c6a]">
        ← Back to time
      </Link>
      <h1 className="text-3xl font-serif font-bold text-[#1a1a1a] mb-6">Confirm</h1>

      <div className="rounded-xl border border-[#eee] bg-white p-6 mb-6">
        <p className="text-[#666] text-sm mb-1">Salon</p>
        <p className="font-semibold text-[#1a1a1a]">{salon.name}</p>
        <p className="text-[#666] text-sm mt-4 mb-1">Service</p>
        <p className="font-semibold text-[#1a1a1a]">{service.name}</p>
        <p className="text-[#666] text-sm mt-4 mb-1">Time</p>
        <p className="font-semibold text-[#1a1a1a]">{decodeURIComponent(time)}</p>
        <p className="text-[#666] text-sm mt-4 mb-1">Price</p>
        <p className="font-semibold text-[#8b3a44]">${service.price}</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <button
          type="button"
          onClick={handleConfirm}
          className="flex-1 py-3 px-4 rounded-xl bg-[#c45c6a] text-white font-medium hover:bg-[#a84a56] transition-colors"
        >
          Confirm booking
        </button>
        <Link
          to="/book"
          className="flex-1 py-3 px-4 rounded-xl border border-[#ddd] text-center text-[#444] font-medium no-underline hover:bg-[#f5f5f5] transition-colors"
        >
          Cancel
        </Link>
      </div>
    </div>
  );
}
