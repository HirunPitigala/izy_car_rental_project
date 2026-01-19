import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import { DollarSign, MapPin, Shield } from "lucide-react";


export default function Home() {
  return (
    <>
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-[600px] w-full">
        <Image
          src="/hero.png"
          alt="Premium Car Rental"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/50" />
        <div className="relative z-10 flex h-full items-center justify-center px-4">
          <div className="max-w-4xl text-center text-white">
            <h1 className="mb-6 text-5xl font-bold leading-tight md:text-6xl lg:text-7xl">
              Premium Car Rental Service in Sri Lanka
            </h1>
            <p className="mb-8 text-xl md:text-2xl text-gray-200">
              Rent the perfect vehicle for weddings, airport transfers, and daily travel at the best price.
            </p>
            <Link
              href="/rent"
              className="inline-block rounded-lg bg-[#fbbf24] px-8 py-4 text-lg font-semibold text-black transition-all duration-300 hover:bg-[#f59e0b] hover:shadow-xl hover:scale-105"
            >
              Explore Cars
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gray-50 py-20 px-4">
        <div className="mx-auto max-w-7xl">
          <h2 className="mb-12 text-center text-4xl font-bold text-gray-900">
            Why Choose Us?
          </h2>
          <div className="grid gap-8 md:grid-cols-3">
            {/* Card 1 */}
            <div className="rounded-xl bg-white p-8 shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#fbbf24]">
                <DollarSign className="h-8 w-8 text-white" />
              </div>
              <h3 className="mb-3 text-2xl font-bold text-gray-900">
                Competitive Rates
              </h3>
              <p className="text-gray-600">
                Best prices with no hidden charges
              </p>
            </div>

            {/* Card 2 */}
            <div className="rounded-xl bg-white p-8 shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#fbbf24]">
                <MapPin className="h-8 w-8 text-white" />
              </div>
              <h3 className="mb-3 text-2xl font-bold text-gray-900">
                Available Everywhere
              </h3>
              <p className="text-gray-600">
                Service available all around Sri Lanka
              </p>
            </div>

            {/* Card 3 */}
            <div className="rounded-xl bg-white p-8 shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#fbbf24]">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h3 className="mb-3 text-2xl font-bold text-gray-900">
                Trusted Service
              </h3>
              <p className="text-gray-600">
                Hundreds of happy customers and trusted vehicles
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 px-4">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 md:grid-cols-2 items-center">
            {/* Left - Image */}
            <div className="relative h-[500px] md:h-[600px] rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="/about.png"
                alt="About Our Car Rental Service"
                fill
                className="object-cover"
              />
            </div>

            {/* Right - Content */}
            <div>
              <h2 className="mb-6 text-4xl font-bold text-gray-900">
                About Our Car Rental Service
              </h2>
              <p className="text-lg leading-relaxed text-gray-700">
                We are Sri Lanka's premier car rental service, offering reliable and professional transportation solutions for all your needs. Whether you're planning a dream wedding and need elegant vehicles, require seamless airport pickups and transfers, or looking for comfortable daily rentals, we've got you covered. Our fleet consists of well-maintained, modern vehicles driven by experienced and professional drivers who prioritize your safety and comfort. With transparent pricing, no hidden fees, and a commitment to excellence, we've earned the trust of hundreds of satisfied customers across the island. Experience the difference of true premium service with every journey.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
