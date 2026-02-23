import {
  ArrowLeft,
  Calendar,
  Clock,
  User,
  Mail,
  Phone,
  MessageSquare,
  Heart,
  Sparkles,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useTheme } from "../../hooks/useTheme";

export default function BookingPage() {
  const theme = useTheme();
  const [searchParams, setSearchParams] = useState({});
  const [salon, setSalon] = useState(null);
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    customer_name: "",
    customer_email: "",
    customer_phone: "",
    booking_date: "",
    booking_time: "",
    notes: "",
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const salonId = params.get("salon_id");
      const serviceId = params.get("service_id");
      setSearchParams({ salon_id: salonId, service_id: serviceId });

      if (salonId && serviceId) {
        fetchBookingDetails(salonId, serviceId);
      }
    }
  }, []);

  const fetchBookingDetails = async (salonId, serviceId) => {
    try {
      const [salonRes, serviceRes] = await Promise.all([
        fetch(`/api/salons/${salonId}`),
        fetch(`/api/services/${serviceId}`),
      ]);

      if (!salonRes.ok || !serviceRes.ok) {
        throw new Error("Failed to fetch booking details");
      }

      const salonData = await salonRes.json();
      const serviceData = await serviceRes.json();

      setSalon(salonData);
      setService(serviceData);
    } catch (error) {
      console.error("Error fetching booking details:", error);
      setError("Failed to load booking details");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          salon_id: parseInt(searchParams.salon_id),
          service_id: parseInt(searchParams.service_id),
          ...formData,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create booking");
      }

      setSuccess(true);
    } catch (error) {
      console.error("Error creating booking:", error);
      setError("Failed to create booking. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const spinnerClasses =
    "w-16 h-16 border-4 border-[#FFE8F0] border-t-[#FF69B4] rounded-full";

  if (loading) {
    return (
      <div
        className={`min-h-screen w-full font-playfair ${theme.text.primary} flex items-center justify-center`}
        style={{ background: theme.background }}
      >
        <div className={spinnerClasses}></div>
      </div>
    );
  }

  if (success) {
    return (
      <div
        className={`min-h-screen w-full font-playfair ${theme.text.primary}`}
        style={{ background: theme.background }}
      >
        <div className="fixed top-20 right-20 opacity-20 animate-float">
          <Heart size={100} className="text-[#FFB6D9]" fill="#FFB6D9" />
        </div>

        <header className="px-4 sm:px-6 md:px-16 py-6 backdrop-blur-sm bg-white/30 border-b border-[#FFD6E8]">
          <div className="max-w-4xl mx-auto">
            <a
              href="/"
              className={`flex items-center gap-3 ${theme.hover.text} transition-colors duration-200 w-fit font-poppins`}
            >
              <ArrowLeft size={18} />
              <span className="font-medium">Back to Home</span>
            </a>
          </div>
        </header>

        <div className="px-4 sm:px-6 md:px-16 py-12">
          <div className="max-w-2xl mx-auto text-center">
            <div
              className={`w-24 h-24 mx-auto mb-6 rounded-full ${theme.bg.accent} flex items-center justify-center shadow-2xl`}
            >
              <Heart size={48} className="text-white" fill="white" />
            </div>
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-[#FF69B4] to-[#FF1493] bg-clip-text text-transparent">
              You're All Set!
            </h1>
            <p className={`${theme.text.secondary} text-lg mb-8 font-poppins`}>
              Your booking request has been sent to {salon?.name}. We'll send
              you a confirmation email once your appointment is confirmed! 💕
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/"
                className={`${theme.bg.card} backdrop-blur-sm border-2 ${theme.bg.border} px-8 py-4 rounded-full font-medium transition-all duration-300 hover:scale-105 hover:border-[#FF69B4] font-poppins`}
              >
                Back to Home
              </a>
              <a
                href="/my-bookings"
                className={`${theme.bg.accent} ${theme.bg.accentText} px-8 py-4 rounded-full font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 font-poppins`}
              >
                View My Appointments
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen w-full font-playfair ${theme.text.primary}`}
      style={{ background: theme.background }}
    >
      <div className="fixed top-10 right-10 opacity-10">
        <Sparkles size={120} className="text-[#FF69B4]" />
      </div>

      <header className="px-4 sm:px-6 md:px-16 py-6 backdrop-blur-sm bg-white/30 border-b border-[#FFD6E8]">
        <div className="max-w-4xl mx-auto">
          <a
            href="/"
            className={`flex items-center gap-3 ${theme.hover.text} transition-colors duration-200 w-fit font-poppins`}
          >
            <ArrowLeft size={18} />
            <span className="font-medium">Back to Services</span>
          </a>
        </div>
      </header>

      <div className="px-4 sm:px-6 md:px-16 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="h-[2px] w-16 bg-gradient-to-r from-transparent to-[#FF69B4]"></div>
              <Heart className={theme.text.accent} size={24} fill="#FF69B4" />
              <div className="h-[2px] w-16 bg-gradient-to-l from-transparent to-[#FF69B4]"></div>
            </div>

            <h1 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-[#FF69B4] to-[#FF1493] bg-clip-text text-transparent">
              Book Your Appointment
            </h1>
            <p className={`${theme.text.secondary} font-poppins`}>
              We can't wait to pamper you!
            </p>
          </div>

          {salon && service && (
            <div
              className={`${theme.bg.card} backdrop-blur-sm border-2 ${theme.bg.border} rounded-3xl p-8 mb-8 shadow-xl`}
            >
              <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                <Sparkles className={theme.text.accent} size={24} />
                Your Selection
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-poppins">
                <div>
                  <p className={`${theme.text.muted} text-sm mb-1`}>Salon</p>
                  <p className="font-semibold text-lg">{salon.name}</p>
                </div>
                <div>
                  <p className={`${theme.text.muted} text-sm mb-1`}>Service</p>
                  <p className="font-semibold text-lg">{service.name}</p>
                </div>
                <div>
                  <p className={`${theme.text.muted} text-sm mb-1`}>Duration</p>
                  <p className="font-semibold">
                    {service.duration_minutes} minutes
                  </p>
                </div>
                <div>
                  <p className={`${theme.text.muted} text-sm mb-1`}>Price</p>
                  <p className={`font-semibold text-xl ${theme.text.accent}`}>
                    ${parseFloat(service.price).toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-poppins">
              <div>
                <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                  <User size={16} className={theme.text.accent} />
                  Full Name *
                </label>
                <input
                  type="text"
                  name="customer_name"
                  value={formData.customer_name}
                  onChange={handleChange}
                  required
                  className={`w-full ${theme.bg.card} backdrop-blur-sm border-2 ${theme.bg.border} rounded-2xl px-4 py-3 ${theme.text.primary} placeholder-[#C9B3CA] focus:border-[#FF69B4] focus:outline-none transition-all duration-200 shadow-sm`}
                  placeholder="Jane Doe"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                  <Mail size={16} className={theme.text.accent} />
                  Email *
                </label>
                <input
                  type="email"
                  name="customer_email"
                  value={formData.customer_email}
                  onChange={handleChange}
                  required
                  className={`w-full ${theme.bg.card} backdrop-blur-sm border-2 ${theme.bg.border} rounded-2xl px-4 py-3 ${theme.text.primary} placeholder-[#C9B3CA] focus:border-[#FF69B4] focus:outline-none transition-all duration-200 shadow-sm`}
                  placeholder="jane@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                  <Phone size={16} className={theme.text.accent} />
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="customer_phone"
                  value={formData.customer_phone}
                  onChange={handleChange}
                  required
                  className={`w-full ${theme.bg.card} backdrop-blur-sm border-2 ${theme.bg.border} rounded-2xl px-4 py-3 ${theme.text.primary} placeholder-[#C9B3CA] focus:border-[#FF69B4] focus:outline-none transition-all duration-200 shadow-sm`}
                  placeholder="+1 (555) 123-4567"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                  <Calendar size={16} className={theme.text.accent} />
                  Preferred Date *
                </label>
                <input
                  type="date"
                  name="booking_date"
                  value={formData.booking_date}
                  onChange={handleChange}
                  required
                  min={new Date().toISOString().split("T")[0]}
                  className={`w-full ${theme.bg.card} backdrop-blur-sm border-2 ${theme.bg.border} rounded-2xl px-4 py-3 ${theme.text.primary} focus:border-[#FF69B4] focus:outline-none transition-all duration-200 shadow-sm`}
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                  <Clock size={16} className={theme.text.accent} />
                  Preferred Time *
                </label>
                <input
                  type="time"
                  name="booking_time"
                  value={formData.booking_time}
                  onChange={handleChange}
                  required
                  className={`w-full ${theme.bg.card} backdrop-blur-sm border-2 ${theme.bg.border} rounded-2xl px-4 py-3 ${theme.text.primary} focus:border-[#FF69B4] focus:outline-none transition-all duration-200 shadow-sm`}
                />
              </div>
            </div>

            <div className="font-poppins">
              <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                <MessageSquare size={16} className={theme.text.accent} />
                Special Requests (Optional)
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={4}
                className={`w-full ${theme.bg.card} backdrop-blur-sm border-2 ${theme.bg.border} rounded-2xl px-4 py-3 ${theme.text.primary} placeholder-[#C9B3CA] focus:border-[#FF69B4] focus:outline-none transition-all duration-200 resize-none shadow-sm`}
                placeholder="Any special requests or preferences..."
              ></textarea>
            </div>

            {error && (
              <div className="bg-red-100 border-2 border-red-300 rounded-2xl p-4">
                <p className="text-red-600 font-poppins">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className={`w-full ${theme.bg.accent} ${theme.bg.accentText} px-8 py-5 rounded-full font-medium shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 text-lg font-poppins flex items-center justify-center gap-2`}
            >
              {submitting ? (
                "Booking..."
              ) : (
                <>
                  <Heart size={20} fill="white" />
                  Confirm Booking
                </>
              )}
            </button>

            <p
              className={`${theme.text.muted} text-sm text-center font-poppins`}
            >
              We'll send you a confirmation email once your appointment is
              confirmed! 💕
            </p>
          </form>
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
