import { Link } from 'react-router';
import { salon, services } from '../data/salons';

export default function ChooseServicePage() {
  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-serif font-bold text-[#1a1a1a] mb-2">Choose Service</h1>
      <p className="text-[#666] mb-8">Select a service at {salon.name}</p>

      <ul className="space-y-3">
        {services.map((service) => (
          <li key={service.id}>
            <Link
              to={`/book/time?service=${service.id}`}
              className="flex items-center justify-between p-4 rounded-xl border border-[#eee] bg-white hover:border-[#e8b4bc] hover:shadow transition-all no-underline text-[#1a1a1a]"
            >
              <div>
                <span className="font-medium">{service.name}</span>
                <span className="text-[#666] text-sm ml-2">· {service.duration}</span>
              </div>
              <span className="font-medium text-[#8b3a44]">${service.price}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
