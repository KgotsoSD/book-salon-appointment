import {
  Calendar,
  Sparkles,
  Clock,
  Heart,
  Phone,
  Mail,
  MapPin,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useTheme } from "../hooks/useTheme";

export default function HomePage() {
  const theme = useTheme();
  const [salon, setSalon] = useState(null);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSalonAndServices();
  }, []);

  const fetchSalonAndServices = async () => {
    try {
      const salonResponse = await fetch("/api/salons/1");
      if (!salonResponse.ok) {
        throw new Error(`Failed to fetch salon: ${salonResponse.status}`);
      }
      const salonData = await salonResponse.json();

      const servicesResponse = await fetch(`/api/services?salon_id=1`);
      if (!servicesResponse.ok) {
        throw new Error(`Failed to fetch services: ${servicesResponse.status}`);
      }
      const servicesData = await servicesResponse.json();

      setSalon(salonData);
      setServices(servicesData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const spinnerClasses =
    "w-16 h-16 border-4 border-[#FFE8F0] border-t-[#FF69B4] rounded-full";

  return (
    <div
      className={`min-h-screen w-full font-playfair ${theme.text.primary}`}
      style={{
        background: theme.background,
      }}
    >
      <div className="fixed top-10 right-10 opacity-20 pointer-events-none">
        <Heart size={120} className="text-[#FFB6D9]" fill="#FFB6D9" />
      </div>
      <div className="fixed bottom-20 left-10 opacity-10 pointer-events-none">
        <Sparkles size={100} className="text-[#FF69B4]" />
      </div>

      <header className="px-4 sm:px-6 md:px-16 py-8 backdrop-blur-sm bg-white/30 border-b border-[#FFD6E8]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div
              className={`w-12 h-12 rounded-full ${theme.bg.accent} flex items-center justify-center`}
            >
              <Sparkles size={24} className="text-white" />
            </div>
            <div>
              <h1 className="font-bold text-2xl md:text-3xl bg-gradient-to-r from-[#FF69B4] to-[#FF1493] bg-clip-text text-transparent">
                {loading ? "Loading..." : salon?.name || "Beauty Salon"}
              </h1>
              <p className={`text-xs ${theme.text.muted}`}>
                Your Beauty Destination
              </p>
            </div>
          </div>
          <a
            href="/my-bookings"
            className={`${theme.bg.accent} ${theme.bg.accentText} px-6 py-3 rounded-full font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105`}
          >
            My Appointments
          </a>
        </div>
      </header>

      <div className="px-4 sm:px-6 md:px-16 py-16 md:py-24">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className={spinnerClasses}></div>
            </div>
          ) : (
            <>
              <div className="text-center mb-16">
                <div className="flex items-center justify-center gap-3 mb-6">
                  <div className="h-[2px] w-16 bg-gradient-to-r from-transparent to-[#FF69B4]"></div>
                  <Sparkles className={theme.text.accent} size={24} />
                  <div className="h-[2px] w-16 bg-gradient-to-l from-transparent to-[#FF69B4]"></div>
                </div>

                <h2 className="text-5xl sm:text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-[#FF69B4] via-[#FF1493] to-[#C71585] bg-clip-text text-transparent">
                  Treat Yourself
                </h2>
                <p
                  className={`${theme.text.secondary} text-lg md:text-xl mb-8 max-w-2xl mx-auto`}
                >
                  {salon?.description ||
                    "Experience luxury beauty services tailored just for you"}
                </p>

                <div className="flex flex-wrap justify-center gap-6 mb-12">
                  {salon?.location && (
                    <div
                      className={`flex items-center gap-2 ${theme.text.muted}`}
                    >
                      <MapPin size={18} className={theme.text.accent} />
                      <span>{salon.location}</span>
                    </div>
                  )}
                  {salon?.phone && (
                    <div
                      className={`flex items-center gap-2 ${theme.text.muted}`}
                    >
                      <Phone size={18} className={theme.text.accent} />
                      <span>{salon.phone}</span>
                    </div>
                  )}
                  {salon?.email && (
                    <div
                      className={`flex items-center gap-2 ${theme.text.muted}`}
                    >
                      <Mail size={18} className={theme.text.accent} />
                      <span>{salon.email}</span>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <div className="text-center mb-12">
                  <h3 className="text-3xl sm:text-4xl font-bold mb-3">
                    Our Services
                  </h3>
                  <p className={theme.text.muted}>
                    Choose your perfect treatment
                  </p>
                </div>

                {services.length === 0 ? (
                  <div className={`text-center py-20 ${theme.text.muted}`}>
                    <p className="text-lg">
                      No services available at the moment.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {services.map((service) => (
                      <div
                        key={service.id}
                        className={`group ${theme.bg.card} backdrop-blur-sm border-2 ${theme.bg.border} rounded-3xl overflow-hidden ${theme.hover.bg} hover:border-[#FF69B4] transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-[#FFB6D9]/20`}
                      >
                        <div
                          className={`${theme.bg.accentSoft} p-8 border-b-2 ${theme.bg.border}`}
                        >
                          <div className="flex items-center justify-between mb-4">
                            <div
                              className={`w-12 h-12 rounded-full ${theme.bg.accent} flex items-center justify-center shadow-lg`}
                            >
                              <Sparkles size={20} className="text-white" />
                            </div>
                            <div
                              className={`text-2xl font-bold ${theme.text.accent}`}
                            >
                              ${parseFloat(service.price).toFixed(0)}
                            </div>
                          </div>
                          <h4 className="text-xl font-bold mb-2">
                            {service.name}
                          </h4>
                          <div
                            className={`flex items-center gap-2 ${theme.text.muted} text-sm`}
                          >
                            <Clock size={16} />
                            <span>{service.duration_minutes} minutes</span>
                          </div>
                        </div>

                        <div className="p-6">
                          {service.description && (
                            <p
                              className={`${theme.text.secondary} text-sm mb-6 line-clamp-3`}
                            >
                              {service.description}
                            </p>
                          )}
                          <a
                            href={`/book?salon_id=${salon.id}&service_id=${service.id}`}
                            className={`block w-full text-center ${theme.bg.accent} ${theme.bg.accentText} px-6 py-3 rounded-full font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105`}
                          >
                            Book Now
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700;800&family=Poppins:wght@300;400;500;600&display=swap');
        
        .font-playfair {
          font-family: 'Playfair Display', serif;
        }
        
        .font-poppins {
          font-family: 'Poppins', sans-serif;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
