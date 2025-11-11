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
        // Track successful submission in analytics
        trackEvent('reservation_form_submit', {
          guests: formData.guests,
          booking_date: formData.date
        });
      } else {
        setError(response.message);
        // Log the submission failure to Sentry
        logError(new Error('Reservation submission failed'), { 
          message: response.message,
          formData 
        });
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error('Reservation submission error:', err);
      // Log the unexpected error to Sentry
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
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <motion.div
          className="bg-gray-800 p-8 rounded-lg shadow-xl max-w-md mx-auto"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring' }}
        >
          <h2 className="text-3xl font-bold text-amber-400 mb-4">{t('reservationsPage.success.title')}</h2>
          <p className="text-gray-300">{t('reservationsPage.success.message')}</p>
           <button onClick={resetForm} className="mt-6 px-6 py-2 bg-amber-500 text-white font-semibold rounded-lg hover:bg-amber-600 transition duration-300">
            {t('reservationsPage.success.newReservationButton')}
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-extrabold text-white">{t('reservationsPage.title')}</h2>
        <p className="text-gray-400 mt-2">{t('reservationsPage.subtitle')}</p>
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
              <label htmlFor="name" className="block text-sm font-medium text-gray-300">{t('reservationsPage.form.name')}</label>
              <input type="text" name="name" id="name" required value={formData.name} onChange={handleChange} className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm focus:ring-amber-500 focus:border-amber-500 text-white p-2" />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300">{t('reservationsPage.form.email')}</label>
              <input type="email" name="email" id="email" required value={formData.email} onChange={handleChange} className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm focus:ring-amber-500 focus:border-amber-500 text-white p-2" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
             <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-300">{t('reservationsPage.form.date')}</label>
              <input type="date" name="date" id="date" required value={formData.date} onChange={handleChange} className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm focus:ring-amber-500 focus:border-amber-500 text-white p-2" />
            </div>
            <div>
              <label htmlFor="time" className="block text-sm font-medium text-gray-300">{t('reservationsPage.form.time')}</label>
              <input type="time" name="time" id="time" required value={formData.time} onChange={handleChange} className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm focus:ring-amber-500 focus:border-amber-500 text-white p-2" />
            </div>
            <div>
              <label htmlFor="guests" className="block text-sm font-medium text-gray-300">{t('reservationsPage.form.guests')}</label>
              <input type="number" name="guests" id="guests" min="1" max="12" required value={formData.guests} onChange={handleChange} className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm focus:ring-amber-500 focus:border-amber-500 text-white p-2" />
            </div>
          </div>
          <div>
            <label htmlFor="requests" className="block text-sm font-medium text-gray-300">{t('reservationsPage.form.requests')}</label>
            <textarea name="requests" id="requests" rows={3} value={formData.requests} onChange={handleChange} className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm focus:ring-amber-500 focus:border-amber-500 text-white p-2"></textarea>
          </div>
          <div>
            <button 
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-amber-500 text-white font-bold rounded-lg hover:bg-amber-600 transition duration-300 disabled:bg-amber-800 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading && (
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              {isLoading ? t('reservationsPage.form.submittingButton') : t('reservationsPage.form.submitButton')}
            </button>
            {error && <p className="text-red-400 text-sm mt-2 text-center">{error}</p>}
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default ReservationsPage;
