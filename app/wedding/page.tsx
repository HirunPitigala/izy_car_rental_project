'use client';

import { useState } from 'react';
import { Phone, Mail, MapPin, Calendar, CheckCircle2, Car } from 'lucide-react';
import { weddingCars, adminContact } from './mockData';

export default function WeddingRentalPage() {
    const [selectedCar, setSelectedCar] = useState<string | null>(null);
    const [selectedDate, setSelectedDate] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        address: '',
        message: '',
    });

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedCar || !selectedDate) {
            alert('Please select a vehicle and a date.');
            return;
        }

        setIsSubmitting(true);

        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1500));

        setIsSubmitting(false);
        setIsSuccess(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const selectedCarDetails = weddingCars.find(c => c.id === selectedCar);

    if (isSuccess) {
        return (
            <div className="container-custom py-16 min-h-[60vh] flex items-center justify-center">
                <div className="ek-card p-12 text-center max-w-lg w-full animate-in fade-in zoom-in duration-500">
                    <div className="h-20 w-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 className="h-10 w-10 text-green-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-[#0f0f0f] mb-4">Inquiry Sent Successfully!</h2>
                    <p className="text-gray-600 mb-8">
                        Thank you for your interest. Your wedding car rental inquiry has been forwarded to our administrator. We will contact you shortly to confirm the details.
                    </p>
                    <button
                        onClick={() => window.location.reload()}
                        className="ek-button ek-button-secondary w-full"
                    >
                        Return to Wedding Page
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="container-custom py-12">
            {/* Header */}
            <div className="text-center max-w-3xl mx-auto mb-16">
                <h1 className="text-4xl font-bold text-[#0f0f0f] mb-4">Premium Wedding Car Rental</h1>
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

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {weddingCars.map((car) => (
                                <div
                                    key={car.id}
                                    onClick={() => setSelectedCar(car.id)}
                                    className={`ek-card overflow-hidden cursor-pointer transition-all duration-300 group ${selectedCar === car.id
                                        ? 'ring-2 ring-red-500 shadow-premium'
                                        : 'hover:border-red-200'
                                        }`}
                                >
                                    <div className="relative h-48 w-full">
                                        <img
                                            src={car.image}
                                            alt={car.name}
                                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-[#0f0f0f]">
                                            {car.price}
                                        </div>
                                    </div>
                                    <div className="p-5">
                                        <h3 className="font-bold text-lg text-[#0f0f0f] mb-1">{car.name}</h3>
                                        <p className="text-sm text-gray-500 mb-4">{car.number}</p>
                                        <div className="flex justify-between items-center">
                                            <span className={`h-8 px-4 rounded-lg flex items-center text-sm font-semibold transition-colors ${selectedCar === car.id
                                                ? 'bg-[#dc2626] text-white'
                                                : 'bg-gray-100 text-gray-600 group-hover:bg-gray-200'
                                                }`}>
                                                {selectedCar === car.id ? 'Selected' : 'Select Vehicle'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Step 2: Select Date */}
                    <section>
                        <div className="flex items-center gap-3 mb-6">
                            <div className="h-10 w-10 rounded-full bg-[#0f0f0f] text-white flex items-center justify-center font-bold">2</div>
                            <h2 className="text-xl font-bold text-[#0f0f0f]">Select Date</h2>
                        </div>
                        <div className="ek-card p-8">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Wedding Date</label>
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
                                    <Phone className="h-4 w-4 text-red-400" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 mb-0.5">Call Us</p>
                                    <p className="text-sm font-medium">{adminContact.phone}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="h-8 w-8 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                                    <Mail className="h-4 w-4 text-red-400" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 mb-0.5">Email Us</p>
                                    <a href={`mailto:${adminContact.email}`} className="text-sm font-medium hover:text-red-400 transition-colors">{adminContact.email}</a>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="h-8 w-8 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                                    <MapPin className="h-4 w-4 text-red-400" />
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
                            <h2 className="text-lg font-bold text-[#0f0f0f]">Inquiry Details</h2>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">

                            {/* Selected Summary */}
                            <div className="p-4 bg-gray-50 rounded-xl space-y-3 mb-6 border border-gray-100">
                                <div className="flex items-center gap-3">
                                    <Car className="h-4 w-4 text-gray-400" />
                                    <span className={`text-sm font-medium ${selectedCar ? 'text-[#0f0f0f]' : 'text-gray-400 italic'}`}>
                                        {selectedCarDetails ? selectedCarDetails.name : 'No vehicle selected'}
                                    </span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Calendar className="h-4 w-4 text-gray-400" />
                                    <span className={`text-sm font-medium ${selectedDate ? 'text-[#0f0f0f]' : 'text-gray-400 italic'}`}>
                                        {selectedDate || 'No date selected'}
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Full Name</label>
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
                                    <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Email</label>
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
                                    <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Phone Number</label>
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
                                    <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Address</label>
                                    <input
                                        type="text"
                                        required
                                        className="ek-input"
                                        placeholder="Your address"
                                        value={formData.address}
                                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Message / Note</label>
                                    <textarea
                                        className="ek-input min-h-[100px] py-3 resize-none"
                                        placeholder="Any special requests?"
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
                                {isSubmitting ? 'Sending...' : 'Submit Wedding Inquiry'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
