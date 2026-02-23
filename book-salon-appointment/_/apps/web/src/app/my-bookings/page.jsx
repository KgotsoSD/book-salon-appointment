import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Heart,
  XCircle,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useTheme } from "../../hooks/useTheme";

export default function MyBookingsPage() {
  const theme = useTheme();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [searchEmail, setSearchEmail] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedEmail = localStorage.getItem("customer_email");
      if (savedEmail) {
        setSearchEmail(savedEmail);
        fetchBookings(savedEmail);
      } else {
        setLoading(false);
      }
    }
  }, []);

  const fetchBookings = async (customerEmail) => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/bookings?customer_email=${encodeURIComponent(customerEmail)}`,
      );
      if (!response.ok) {
        throw new Error("Failed to fetch bookings");
      }
      const data = await response.json();
      setBookings(data);
      if (typeof window !== "undefined") {
        localStorage.setItem("customer_email", customerEmail);
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSearchEmail(email);
      fetchBookings(email);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "confirmed":
        return <Heart size={20} className="text-[#FF69B4]" fill="#FF69B4" />;
      case "rejected":
      case "cancelled":
        return <XCircle size={20} className="text-red-400" />;
      case "completed":
        return (
          <Heart size={20} className={theme.text.muted} fill="currentColor" />
        );
      default:
        return <AlertCircle size={20} className="text-[#FFB6D9]" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed":
        return "bg-[#FFE8F0] border-[#FF69B4] text-[#FF1493]";
      case "rejected":
      case "cancelled":
        return "bg-red-50 border-red-300 text-red-600";
      case "completed":
        return "bg-gray-50 border-gray-300 text-gray-600";
      default:
        return "bg-[#FFF5F7] border-[#FFD6E8] text-[#FF69B4]";
    }
  };

  const spinnerClasses =
    "w-16 h-16 border-4 border-[#FFE8F0] border-t-[#FF69B4] rounded-full";

  return (
    <div
      className={`min-h-screen w-full font-playfair ${theme.text.primary}`}
      style={{ background: theme.background }}
    >
      <div className="fixed top-10 right-10 opacity-10">
        <Heart size={120} className="text-[#FFB6D9]" fill="#FFB6D9" />
      </div>

      <header className="px-4 sm:px-6 md:px-16 py-6 backdrop-blur-sm bg-white/30 border-b border-[#FFD6E8]">
        <div className="max-w-7xl mx-auto">
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
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="h-[2px] w-16 bg-gradient-to-r from-transparent to-[#FF69B4]"></div>
              <Heart className={theme.text.accent} size={24} fill="#FF69B4" />
              <div className="h-[2px] w-16 bg-gradient-to-l from-transparent to-[#FF69B4]"></div>
            </div>

            <h1 className="text-4xl sm:text-5xl font-bold mb-3 bg-gradient-to-r from-[#FF69B4] to-[#FF1493] bg-clip-text text-transparent">
              My Appointments
            </h1>
            <p className={`${theme.text.secondary} font-poppins`}>
              View all your beauty appointments
            </p>
          </div>

          {!searchEmail && (
            <div className="max-w-2xl mx-auto mb-12">
              <div
                className={`${theme.bg.card} backdrop-blur-sm border-2 ${theme.bg.border} rounded-3xl p-8 shadow-xl`}
              >
                <p
                  className={`${theme.text.secondary} mb-6 text-center font-poppins`}
                >
                  Enter your email to view your bookings
                </p>
                <form
                  onSubmit={handleSearch}
                  className="flex flex-col sm:flex-row gap-4"
                >
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                    className={`flex-1 ${theme.bg.card} border-2 ${theme.bg.border} rounded-full px-6 py-3 ${theme.text.primary} placeholder-[#C9B3CA] focus:border-[#FF69B4] focus:outline-none transition-all duration-200 font-poppins`}
                  />
                  <button
                    type="submit"
                    className={`${theme.bg.accent} ${theme.bg.accentText} px-8 py-3 rounded-full font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 font-poppins`}
                  >
                    Find Bookings
                  </button>
                </form>
              </div>
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className={spinnerClasses}></div>
            </div>
          ) : searchEmail && bookings.length === 0 ? (
            <div className={`text-center py-20 ${theme.text.muted}`}>
              <Sparkles size={64} className="mx-auto mb-4 text-[#FFB6D9]" />
              <p className="text-lg mb-4 font-poppins">
                No bookings found for {searchEmail}
              </p>
              <button
                onClick={() => {
                  setSearchEmail("");
                  setEmail("");
                  if (typeof window !== "undefined") {
                    localStorage.removeItem("customer_email");
                  }
                }}
                className={`${theme.bg.card} border-2 ${theme.bg.border} px-8 py-3 rounded-full transition-all duration-300 hover:scale-105 hover:border-[#FF69B4] font-poppins`}
              >
                Try Different Email
              </button>
            </div>
          ) : searchEmail ? (
            <div>
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
                <p className={`${theme.text.secondary} font-poppins`}>
                  Showing bookings for:{" "}
                  <span className="font-semibold text-[#FF69B4]">
                    {searchEmail}
                  </span>
                </p>
                <button
                  onClick={() => {
                    setSearchEmail("");
                    setEmail("");
                    setBookings([]);
                    if (typeof window !== "undefined") {
                      localStorage.removeItem("customer_email");
                    }
                  }}
                  className={`${theme.bg.card} border-2 ${theme.bg.border} px-6 py-2 rounded-full text-sm transition-all duration-300 hover:scale-105 hover:border-[#FF69B4] font-poppins`}
                >
                  Change Email
                </button>
              </div>

              <div className="space-y-6">
                {bookings.map((booking) => (
                  <div
                    key={booking.id}
                    className={`${theme.bg.card} backdrop-blur-sm border-2 ${theme.bg.border} rounded-3xl p-6 hover:border-[#FF69B4] transition-all duration-300 hover:shadow-xl`}
                  >
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                      <div className="flex-1 font-poppins">
                        <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
                          <Sparkles className={theme.text.accent} size={20} />
                          {booking.salon_name}
                        </h3>
                        <p className={`${theme.text.secondary} mb-3 text-lg`}>
                          {booking.service_name}
                        </p>
                        <div className="flex flex-wrap gap-4 text-sm">
                          <div
                            className={`flex items-center gap-2 ${theme.text.muted}`}
                          >
                            <Calendar size={16} className={theme.text.accent} />
                            <span>
                              {new Date(
                                booking.booking_date,
                              ).toLocaleDateString("en-US", {
                                month: "long",
                                day: "numeric",
                                year: "numeric",
                              })}
                            </span>
                          </div>
                          <div
                            className={`flex items-center gap-2 ${theme.text.muted}`}
                          >
                            <Clock size={16} className={theme.text.accent} />
                            <span>{booking.booking_time}</span>
                          </div>
                          <div
                            className={`flex items-center gap-2 ${theme.text.muted}`}
                          >
                            <MapPin size={16} className={theme.text.accent} />
                            <span>{booking.salon_location}</span>
                          </div>
                        </div>
                      </div>

                      <div
                        className={`flex items-center gap-2 px-5 py-3 rounded-full border-2 ${getStatusColor(booking.status)} font-poppins shadow-sm`}
                      >
                        {getStatusIcon(booking.status)}
                        <span className="font-semibold capitalize text-sm">
                          {booking.status}
                        </span>
                      </div>
                    </div>

                    {booking.notes && (
                      <div
                        className={`${theme.bg.accentSoft} rounded-2xl p-4 mt-4`}
                      >
                        <p
                          className={`text-sm ${theme.text.secondary} font-poppins`}
                        >
                          <span className="font-semibold">
                            Special Requests:
                          </span>{" "}
                          {booking.notes}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : null}
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
      `}</style>
    </div>
  );
}
