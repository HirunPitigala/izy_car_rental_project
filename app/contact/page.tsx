import Image from "next/image";
import Link from "next/link";
import { Phone, MapPin, Clock, Star, ArrowLeft } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation / Header Area */}
      <div className="container-custom pt-8 pb-4">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-[#0f0f0f] transition-colors group"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          Back to Dashboard
        </Link>
      </div>

      {/* Main Content Area */}
      <main className="container-custom flex flex-col items-center justify-center py-12 md:py-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
        {/* Logo Section */}
        <div className="mb-12 transition-transform hover:scale-105 duration-500">
          <Image
            src="/logo.png"
            alt="IZY Logo"
            width={180}
            height={60}
            className="h-12 w-auto md:h-16"
            priority
          />
        </div>

        {/* Business Info Card */}
        <div className="w-full max-w-2xl bg-gray-50 rounded-[2.5rem] border border-gray-100 p-8 md:p-14 shadow-premium">
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-black text-[#0f0f0f] tracking-tighter mb-4">
              IZY Rent a car & tours
            </h1>
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="flex items-center gap-0.5 text-yellow-500">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className={`h-4 w-4 ${i === 5 ? 'fill-none text-yellow-500' : 'fill-current'}`} />
                ))}
              </div>
              <span className="text-sm font-black text-[#0f0f0f]">4.8</span>
              <span className="text-xs font-bold text-gray-400">(22 Google reviews)</span>
            </div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-[#dc2626]">
              Car rental agency in Negombo
            </p>
          </div>

          <div className="space-y-8">
            {/* Address */}
            <div className="flex gap-6 group">
              <div className="h-12 w-12 rounded-2xl bg-white flex items-center justify-center text-[#dc2626] shadow-sm border border-gray-100 group-hover:scale-110 transition-transform duration-300">
                <MapPin className="h-6 w-6" />
              </div>
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Our Location</p>
                <p className="text-base font-bold text-[#0f0f0f] leading-relaxed">
                  280/4 C3 daluwakotuwa, <br />
                  Negombo 11549
                </p>
              </div>
            </div>

            {/* Phone */}
            <div className="flex gap-6 group">
              <div className="h-12 w-12 rounded-2xl bg-white flex items-center justify-center text-[#dc2626] shadow-sm border border-gray-100 group-hover:scale-110 transition-transform duration-300">
                <Phone className="h-6 w-6" />
              </div>
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Call Us</p>
                <a 
                  href="tel:0754084563" 
                  className="text-base font-bold text-[#0f0f0f] hover:text-[#dc2626] transition-colors leading-relaxed"
                >
                  075 408 4563
                </a>
              </div>
            </div>

            {/* Hours */}
            <div className="flex gap-6 group">
              <div className="h-12 w-12 rounded-2xl bg-white flex items-center justify-center text-[#dc2626] shadow-sm border border-gray-100 group-hover:scale-110 transition-transform duration-300">
                <Clock className="h-6 w-6" />
              </div>
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Business Hours</p>
                <p className="text-base font-bold text-[#0f0f0f] leading-relaxed">
                  Open 24 hours
                </p>
              </div>
            </div>
          </div>

          <div className="mt-14 flex flex-col gap-4">
            <a 
              href="https://www.google.com/maps/dir/?api=1&destination=280/4+C3+daluwakotuwa,+Negombo+11549"
              target="_blank"
              rel="noopener noreferrer"
              className="h-14 w-full rounded-2xl bg-gray-950 flex items-center justify-center text-sm font-black text-white hover:bg-black transition-all active:scale-[0.98] shadow-xl shadow-gray-200 uppercase tracking-widest"
            >
              Get Directions
            </a>
            <a 
              href="tel:0754084563"
              className="h-14 w-full rounded-2xl bg-white border border-gray-100 flex items-center justify-center text-sm font-black text-[#0f0f0f] hover:bg-gray-50 transition-all active:scale-[0.98] uppercase tracking-widest"
            >
              Contact Now
            </a>
          </div>
        </div>

        <p className="mt-12 text-sm font-bold text-gray-400 uppercase tracking-widest">
          Premium Mobility Experience
        </p>
      </main>
    </div>
  );
}
