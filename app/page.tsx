import Image from "next/image";
import Link from "next/link";
import { DollarSign, MapPin, Shield, CheckCircle2, ArrowRight } from "lucide-react";

import { getSession } from "@/lib/auth";

export default async function Home() {
  const session = await getSession();
  const isEmployee = session?.role === "employee";

  return (
    <>
      {/* Hero Section */}
      <section className="relative h-[650px] w-full overflow-hidden">
        <Image
          src="/hero.png"
          alt="Premium Car Rental"
          fill
          className="object-cover transition-transform duration-1000 hover:scale-105"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0f0f0f]/90 via-[#0f0f0f]/60 to-transparent" />

        <div className="relative z-10 container-custom flex h-full items-center">
          <div className="max-w-2xl">

            <h1 className="mb-6 text-2xl font-extrabold leading-[1.1] text-white">
              Drive Your <br />
              <span className="text-[#dc2626]">Dream Journey.</span>
            </h1>
            <p className="mb-10 text-lg leading-relaxed text-gray-300 md:text-xl md:max-w-xl">
              From elegant wedding cars to reliable airport transfers, discover the perfect ride with our premium fleet and professional service.
            </p>
            <div className="flex flex-wrap gap-4">
              {isEmployee ? (
                <Link
                  href="/employee"
                  className="h-14 px-10 rounded-xl bg-white flex items-center gap-2 text-base font-bold text-[#0f0f0f] transition-all shadow-xl shadow-white/5 hover:bg-gray-100 active:scale-[0.98]"
                >
                  Manage Requested Bookings
                  <ArrowRight className="h-5 w-5" />
                </Link>
              ) : (
                <Link
                  href="/rent"
                  className="h-14 px-10 rounded-xl bg-[#dc2626] flex items-center gap-2 text-base font-bold text-white transition-all shadow-xl shadow-red-600/20 hover:bg-[#b91c1c] active:scale-[0.98]"
                >
                  Book Now
                  <ArrowRight className="h-5 w-5" />
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-24">
        <div className="container-custom">
          <div className="mb-16 text-center max-w-3xl mx-auto">
            <h2 className="mb-4 text-sm font-bold uppercase tracking-[0.2em] text-[#dc2626]">
              Why Choose IZY
            </h2>
            <h3 className="text-2xl font-extrabold text-[#0f0f0f]">
              We provide the best experience <br /> for your travel needs.
            </h3>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                icon: <DollarSign className="h-7 w-7" />,
                title: "Best Price Guarantee",
                desc: "Transparent pricing with zero hidden charges. We match any competitor quotes.",
                color: "bg-[#0f0f0f]"
              },
              {
                icon: <MapPin className="h-7 w-7" />,
                title: "All-Island Service",
                desc: "Whether it's Colombo or Jaffna, our professional drivers are ready for you.",
                color: "bg-[#dc2626]"
              },
              {
                icon: <Shield className="h-7 w-7" />,
                title: "Secure & Trusted",
                desc: "Fully insured premium vehicles maintained to the highest safety standards.",
                color: "bg-[#0f0f0f]"
              }
            ].map((feature, idx) => (
              <div key={idx} className="ek-card group p-10 border border-gray-100 hover:border-red-100">
                <div className={`mb-8 flex h-14 w-14 items-center justify-center rounded-2xl ${feature.color} text-white shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6`}>
                  {feature.icon}
                </div>
                <h4 className="mb-4 text-2xl font-extrabold text-[#0f0f0f]">
                  {feature.title}
                </h4>
                <p className="text-gray-500 leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="bg-gray-50 py-24">
        <div className="container-custom">
          <div className="grid gap-16 lg:grid-cols-2 items-center">
            {/* Left - Image */}
            <div className="relative h-[500px] md:h-[600px] rounded-[32px] overflow-hidden shadow-2xl">
              <Image
                src="/about.png"
                alt="About IZY"
                fill
                className="object-cover"
              />

            </div>

            {/* Right - Content */}
            <div className="lg:pl-8">
              <h2 className="mb-4 text-sm font-bold uppercase tracking-[0.2em] text-[#dc2626]">
                Our Passion
              </h2>
              <h3 className="mb-8 text-2xl font-extrabold text-[#0f0f0f] leading-tight">
                Sri Lankas Premier <br /> Car Rental Authority
              </h3>
              <p className="mb-8 text-lg leading-relaxed text-gray-600">
                IZY is more than just a car rental; we are your dedicated travel partner. Since our inception, we have focused on delivering excellence in transportation across Sri Lanka.
              </p>

              {!isEmployee && (
                <>
                  <div className="space-y-6">
                    {[
                      "Luxury Wedding Fleet for your special day",
                      "Punctual & Professional Airport Transfers",
                      "Experienced English-speaking chauffeurs",
                      "24/7 Customer Support & Roadside Assistance"
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-red-100 text-[#dc2626]">
                          <CheckCircle2 className="h-4 w-4" />
                        </div>
                        <span className="font-semibold text-[#0f0f0f]">{item}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-12 flex gap-4">
                    <Link
                      href="/contact"
                      className="h-14 px-10 rounded-xl bg-[#0f0f0f] flex items-center text-base font-bold text-white transition-all hover:bg-[#262626] active:scale-[0.98] shadow-xl shadow-gray-200/20"
                    >
                      Contact Us
                    </Link>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
