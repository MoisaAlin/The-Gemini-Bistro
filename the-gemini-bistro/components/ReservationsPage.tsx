import React, { useState } from 'react';
import { motion } from 'framer-motion';

const ReservationsPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '19:00',
    guests: 2,
    requests: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would send data to a backend.
    console.log('Reservation submitted:', formData);
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <motion.div
          className="bg-gray-800 p-8 rounded-lg shadow-xl max-w-md mx-auto"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring' }}
        >
          <h2 className="text-3xl font-bold text-amber-400 mb-4">Thank You!</h2>
          <p className="text-gray-300">Your reservation request has been sent. We will contact you shortly to confirm.</p>
           <button onClick={() => setIsSubmitted(false)} className="mt-6 px-6 py-2 bg-amber-500 text-white font-semibold rounded-lg hover:bg-amber-600 transition duration-300">
            Make Another Reservation
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-extrabold text-white">Book Your Table</h2>
        <p className="text-gray-400 mt-2">We look forward to hosting you.</p>
      </div>
      <motion.div
        className="max-w-2xl mx-auto bg-gray-800 p-8 rounded-lg shadow-2xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300">Full Name</label>
              <input type="text" name="name" id="name" required value={formData.name} onChange={handleChange} className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm focus:ring-amber-500 focus:border-amber-500 text-white p-2" />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300">Email</label>
              <input type="email" name="email" id="email" required value={formData.email} onChange={handleChange} className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm focus:ring-amber-500 focus:border-amber-500 text-white p-2" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
             <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-300">Date</label>
              <input type="date" name="date" id="date" required value={formData.date} onChange={handleChange} className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm focus:ring-amber-500 focus:border-amber-500 text-white p-2" />
            </div>
            <div>
              <label htmlFor="time" className="block text-sm font-medium text-gray-300">Time</label>
              <input type="time" name="time" id="time" required value={formData.time} onChange={handleChange} className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm focus:ring-amber-500 focus:border-amber-500 text-white p-2" />
            </div>
            <div>
              <label htmlFor="guests" className="block text-sm font-medium text-gray-300">Guests</label>
              <input type="number" name="guests" id="guests" min="1" max="12" required value={formData.guests} onChange={handleChange} className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm focus:ring-amber-500 focus:border-amber-500 text-white p-2" />
            </div>
          </div>
          <div>
            <label htmlFor="requests" className="block text-sm font-medium text-gray-300">Special Requests</label>
            <textarea name="requests" id="requests" rows={3} value={formData.requests} onChange={handleChange} className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm focus:ring-amber-500 focus:border-amber-500 text-white p-2"></textarea>
          </div>
          <div>
            <button type="submit" className="w-full py-3 px-4 bg-amber-500 text-white font-bold rounded-lg hover:bg-amber-600 transition duration-300">
              Request Reservation
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default ReservationsPage;
