'use client';

import { useState, useEffect } from 'react';
import { Phone, Mail, MapPin, Calendar, CheckCircle2, Car, Heart, Loader2, ArrowRight } from 'lucide-react';
import { getWeddingCars, createWeddingCarInquiry } from '@/lib/actions/weddingActions';
import Link from 'next/link';

interface WeddingCar {
    vehicleId: number;
    brand: string | null;
    model: string | null;
    image: string | null;
    rentPerDay: string | null;
    seatingCapacity: number;
    status: string | null;
    description: string | null;
}

const adminContact = {
    phone: '+94 77 123 4567',
    email: 'admin@carrental.com',
    address: 'No 123, Galle Road, Colombo 03, Sri Lanka',
};

export default function WeddingRentalPage() {
    const [cars, setCars] = useState<WeddingCar[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCar, setSelectedCar] = useState<number | null>(null);
    const [selectedDate, setSelectedDate] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        pickupLocation: '',
        message: '',
    });

    useEffect(() => {
        async function fetchCars() {
            setLoading(true);
            const result = await getWeddingCars();
            if (result.success) {
                setCars(result.data as any);
            }
            setLoading(false);
        }
        fetchCars();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!selectedCar || !selectedDate) {
            setError('Please select a vehicle and a date.');
            return;
        }

        setIsSubmitting(true);

        const result = await createWeddingCarInquiry({
            vehicleId: selectedCar,
            customerName: formData.fullName,
            email: formData.email,
            phone: formData.phone,
            eventDate: selectedDate,
            pickupLocation: formData.pickupLocation,
            message: formData.message || undefined,
        });

        setIsSubmitting(false);

        if (result.success) {
            setIsSuccess(true);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            setError(result.error || 'Failed to submit inquiry');
        }
    };

    const selectedCarDetails = cars.find(c => c.vehicleId === selectedCar);

    // Success Screen
    if (isSuccess) {
        return (
            <div className="container-custom py-16 min-h-[60vh] flex items-center justify-center">
                <div className="ek-card p-12 text-center max-w-lg w-full animate-in fade-in zoom-in duration-500">
                    <div className="h-20 w-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 className="h-10 w-10 text-green-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-[#0f0f0f] mb-4">Request Submitted Successfully</h2>
                    <p className="text-gray-600 mb-8">
                        Your wedding car inquiry has been sent successfully. Our team will contact you soon.
                    </p>
                    <Link
                        href="/wedding"
                        className="ek-button ek-button-secondary w-full"
                    >
                        Return to Wedding Page
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="container-custom py-12">
            {/* Header */}
            <div className="text-center max-w-3xl mx-auto mb-16">
                <div className="inline-flex items-center gap-2 bg-amber-50 text-amber-700 px-4 py-2 rounded-full text-sm font-bold mb-4 border border-amber-100">
                    <Heart className="h-4 w-4 fill-amber-500" />
                    Wedding Special Collection
                </div>
                <h1 className="text-2xl font-bold text-[#0f0f0f] mb-4">Premium Wedding Car Rental</h1>
                <p className="text-lg text-gray-500">
                    Make your special day unforgettable with our luxurious fleet of wedding cars.
                    Select your dream vehicle and let us handle the rest.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

                {/* Left Column: Vehicle Selection & Date */}
                <div className="lg:col-span-2 space-y-12">

                    {/* Step 1: Select Vehicle */}
                    <section>
                        <div className="flex items-center gap-3 mb-6">
                            <div className="h-10 w-10 rounded-full bg-[#0f0f0f] text-white flex items-center justify-center font-bold">1</div>
                            <h2 className="text-xl font-bold text-[#0f0f0f]">Select Your Vehicle</h2>
                        </div>

                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-20">
                                <Loader2 className="h-10 w-10 text-amber-500 animate-spin mb-4" />
                                <p className="text-gray-400 font-medium">Loading wedding fleet...</p>
                            </div>
                        ) : cars.length === 0 ? (
                            <div className="ek-card p-12 text-center">
                                <Heart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                                <h3 className="text-lg font-bold text-gray-400 mb-2">No Wedding Cars Available</h3>
                                <p className="text-gray-400">Please check back later or contact us directly.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {cars.map((car) => (
                                    <div
                                        key={car.vehicleId}
                                        onClick={() => setSelectedCar(car.vehicleId)}
                                        className={`ek-card overflow-hidden cursor-pointer transition-all duration-300 group ${selectedCar === car.vehicleId
                                            ? 'ring-2 ring-amber-500 shadow-premium'
                                            : 'hover:border-amber-200'
                                            }`}
                                    >
                                        <div className="relative h-48 w-full bg-gray-100">
                                            {car.image ? (
                                                <img
                                                    src={car.image}
                                                    alt={`${car.brand} ${car.model}`}
                                                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                />
                                            ) : (
                                                <div className="h-full w-full flex items-center justify-center text-gray-300">
                                                    <Car className="h-12 w-12" />
                                                </div>
                                            )}
                                            <div className="absolute top-3 left-3 bg-amber-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                                                <Heart className="h-3 w-3 fill-white" />
                                                Wedding Special
                                            </div>
                                            {car.rentPerDay && (
                                                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-[#0f0f0f]">
                                                    LKR {Number(car.rentPerDay).toLocaleString()} / day
                                                </div>
                                            )}
                                        </div>
                                        <div className="p-5">
                                            <h3 className="font-bold text-lg text-[#0f0f0f] mb-1">{car.brand} {car.model}</h3>
                                            <p className="text-sm text-gray-500 mb-4">{car.seatingCapacity} Seats • {car.status}</p>
                                            <div className="flex justify-between items-center">
                                                <span className={`h-8 px-4 rounded-lg flex items-center text-sm font-semibold transition-colors ${selectedCar === car.vehicleId
                                                    ? 'bg-amber-500 text-white'
                                                    : 'bg-gray-100 text-gray-600 group-hover:bg-amber-50 group-hover:text-amber-700'
                                                    }`}>
                                                    {selectedCar === car.vehicleId ? 'Selected' : 'Select Vehicle'}
                                                </span>
                                                <Link
                                                    href={`/wedding/${car.vehicleId}`}
                                                    onClick={(e) => e.stopPropagation()}
                                                    className="h-8 px-4 rounded-lg flex items-center text-sm font-semibold text-gray-500 hover:text-amber-600 transition-colors gap-1"
                                                >
                                                    View Details <ArrowRight className="h-3 w-3" />
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>

                    {/* Step 2: Select Date */}
                    <section>
                        <div className="flex items-center gap-3 mb-6">
                            <div className="h-10 w-10 rounded-full bg-[#0f0f0f] text-white flex items-center justify-center font-bold">2</div>
                            <h2 className="text-xl font-bold text-[#0f0f0f]">Select Date</h2>
                        </div>
                        <div className="ek-card p-8">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Wedding / Event Date</label>
                            <input
                                type="date"
                                className="ek-input w-full max-w-sm"
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                                min={new Date().toISOString().split('T')[0]}
                            />
                        </div>
                    </section>
                </div>

                {/* Right Column: Inquiry Form & Contact */}
                <div className="lg:col-span-1 space-y-8">

                    {/* Admin Contact Card */}
                    <div className="ek-card p-6 bg-[#0f0f0f] text-white border-none">
                        <h3 className="font-bold text-lg mb-6">Contact Administrator</h3>
                        <div className="space-y-4">
                            <div className="flex items-start gap-4">
                                <div className="h-8 w-8 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                                    <Phone className="h-4 w-4 text-amber-400" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 mb-0.5">Call Us</p>
                                    <p className="text-sm font-medium">{adminContact.phone}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="h-8 w-8 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                                    <Mail className="h-4 w-4 text-amber-400" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 mb-0.5">Email Us</p>
                                    <a href={`mailto:${adminContact.email}`} className="text-sm font-medium hover:text-amber-400 transition-colors">{adminContact.email}</a>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="h-8 w-8 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                                    <MapPin className="h-4 w-4 text-amber-400" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 mb-0.5">Visit Us</p>
                                    <p className="text-sm font-medium text-gray-300">{adminContact.address}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Step 3: Inquiry Form */}
                    <div className="ek-card p-6 sticky top-24">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="h-8 w-8 rounded-full bg-[#0f0f0f] text-white flex items-center justify-center font-bold text-sm">3</div>
                            <h2 className="text-lg font-bold text-[#0f0f0f]">Request Wedding Car</h2>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">

                            {/* Selected Summary */}
                            <div className="p-4 bg-amber-50/50 rounded-xl space-y-3 mb-6 border border-amber-100">
                                <div className="flex items-center gap-3">
                                    <Car className="h-4 w-4 text-amber-500" />
                                    <span className={`text-sm font-medium ${selectedCar ? 'text-[#0f0f0f]' : 'text-gray-400 italic'}`}>
                                        {selectedCarDetails ? `${selectedCarDetails.brand} ${selectedCarDetails.model}` : 'No vehicle selected'}
                                    </span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Calendar className="h-4 w-4 text-amber-500" />
                                    <span className={`text-sm font-medium ${selectedDate ? 'text-[#0f0f0f]' : 'text-gray-400 italic'}`}>
                                        {selectedDate || 'No date selected'}
                                    </span>
                                </div>
                            </div>

                            {error && (
                                <div className="p-3 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100">
                                    {error}
                                </div>
                            )}

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Full Name *</label>
                                    <input
                                        type="text"
                                        required
                                        className="ek-input"
                                        placeholder="Enter your full name"
                                        value={formData.fullName}
                                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Email *</label>
                                    <input
                                        type="email"
                                        required
                                        className="ek-input"
                                        placeholder="Enter your email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Phone Number *</label>
                                    <input
                                        type="tel"
                                        required
                                        className="ek-input"
                                        placeholder="Enter your phone number"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Pickup Location *</label>
                                    <input
                                        type="text"
                                        required
                                        className="ek-input"
                                        placeholder="Event / pickup location"
                                        value={formData.pickupLocation}
                                        onChange={(e) => setFormData({ ...formData, pickupLocation: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Message / Special Requests</label>
                                    <textarea
                                        className="ek-input min-h-[100px] py-3 resize-none"
                                        placeholder="Any special requests for your wedding day?"
                                        value={formData.message}
                                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`ek-button ek-button-secondary w-full mt-6 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                            >
                                {isSubmitting ? 'Submitting...' : 'Submit Wedding Inquiry'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
