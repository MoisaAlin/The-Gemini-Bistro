import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { submitReservation } from '../services/apiService';
import { logError, trackEvent } from '../services/monitoringService';
import { useTranslations } from '../hooks/useTranslations';

const ReservationsPage: React.FC = () => {
  const { t } = useTranslations();
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
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const response = await submitReservation(formData);
      if (response.success) {
        setIsSubmitted(true);
        trackEvent('reservation_form_submit', {
          guests: formData.guests,
          booking_date: formData.date
        });
      } else {
        setError(response.message);
        logError(new Error('Reservation submission failed'), { 
          message: response.message,
          formData 
        });
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error('Reservation submission error:', err);
      logError(err as Error, { context: "Reservation Form Submission", formData });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setIsSubmitted(false);
    setError(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      date: '',
      time: '19:00',
      guests: 2,
      requests: ''
    });
  };

  if (isSubmitted) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 text-center">
        <motion.div
          className="bg-gray-800/90 border border-gray-700/60 p-6 sm:p-10 rounded-2xl shadow-2xl max-w-lg mx-auto"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring' }}
        >
          <div className="w-16 h-16 bg-amber-500/20 text-amber-400 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
            ✓
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-amber-400 mb-3">{t('reservationsPage.success.title')}</h2>
          <p className="text-gray-300 text-sm sm:text-base leading-relaxed">{t('reservationsPage.success.message')}</p>
          <button
            onClick={resetForm}
            className="mt-8 px-6 py-3 min-h-[44px] bg-amber-500 text-white font-semibold rounded-xl hover:bg-amber-600 transition duration-200 shadow-lg shadow-amber-500/20 w-full sm:w-auto"
          >
            {t('reservationsPage.success.newReservationButton')}
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="text-center mb-8 sm:mb-12">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">{t('reservationsPage.title')}</h2>
        <p className="text-gray-400 mt-2 text-sm sm:text-base max-w-xl mx-auto">{t('reservationsPage.subtitle')}</p>
      </div>
      <motion.div
        className="max-w-2xl mx-auto bg-gray-800/90 border border-gray-700/60 p-5 sm:p-8 rounded-2xl shadow-2xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1.5">{t('reservationsPage.form.name')}</label>
              <input
                type="text"
                name="name"
                id="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="block w-full bg-gray-700/80 border border-gray-600 rounded-xl shadow-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-white p-3 text-base min-h-[44px]"
                placeholder="Jane Doe"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1.5">{t('reservationsPage.form.email')}</label>
              <input
                type="email"
                name="email"
                id="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="block w-full bg-gray-700/80 border border-gray-600 rounded-xl shadow-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-white p-3 text-base min-h-[44px]"
                placeholder="jane@example.com"
              />
            </div>
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-1.5">Phone Number</label>
            <input
              type="tel"
              name="phone"
              id="phone"
              value={formData.phone}
              onChange={handleChange}
              className="block w-full bg-gray-700/80 border border-gray-600 rounded-xl shadow-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-white p-3 text-base min-h-[44px]"
              placeholder="+1 (555) 000-0000"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-300 mb-1.5">{t('reservationsPage.form.date')}</label>
              <input
                type="date"
                name="date"
                id="date"
                required
                value={formData.date}
                onChange={handleChange}
                className="block w-full bg-gray-700/80 border border-gray-600 rounded-xl shadow-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-white p-3 text-base min-h-[44px] [color-scheme:dark]"
              />
            </div>
            <div>
              <label htmlFor="time" className="block text-sm font-medium text-gray-300 mb-1.5">{t('reservationsPage.form.time')}</label>
              <input
                type="time"
                name="time"
                id="time"
                required
                value={formData.time}
                onChange={handleChange}
                className="block w-full bg-gray-700/80 border border-gray-600 rounded-xl shadow-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-white p-3 text-base min-h-[44px] [color-scheme:dark]"
              />
            </div>
            <div>
              <label htmlFor="guests" className="block text-sm font-medium text-gray-300 mb-1.5">{t('reservationsPage.form.guests')}</label>
              <input
                type="number"
                name="guests"
                id="guests"
                min="1"
                max="12"
                required
                value={formData.guests}
                onChange={handleChange}
                className="block w-full bg-gray-700/80 border border-gray-600 rounded-xl shadow-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-white p-3 text-base min-h-[44px]"
              />
            </div>
          </div>

          <div>
            <label htmlFor="requests" className="block text-sm font-medium text-gray-300 mb-1.5">{t('reservationsPage.form.requests')}</label>
            <textarea
              name="requests"
              id="requests"
              rows={3}
              value={formData.requests}
              onChange={handleChange}
              placeholder="Allergies, high chair, window booth preference..."
              className="block w-full bg-gray-700/80 border border-gray-600 rounded-xl shadow-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-white p-3 text-base"
            ></textarea>
          </div>

          <div>
            <button 
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-4 min-h-[48px] bg-amber-500 text-white font-bold rounded-xl hover:bg-amber-600 transition-all duration-200 disabled:bg-amber-800 disabled:cursor-not-allowed flex items-center justify-center shadow-lg shadow-amber-500/20 active:scale-[0.99]"
            >
              {isLoading && (
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              {isLoading ? t('reservationsPage.form.submittingButton') : t('reservationsPage.form.submitButton')}
            </button>
            {error && <p className="text-red-400 text-sm mt-3 text-center bg-red-900/30 p-2.5 rounded-lg border border-red-800/40">{error}</p>}
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default ReservationsPage;
