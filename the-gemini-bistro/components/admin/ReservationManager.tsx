import React, { useState, useEffect } from 'react';
import { fetchReservations, updateReservationStatus } from '../../services/apiService';
import { Reservation } from '../../types';
import { logError } from '../../services/monitoringService';

const ReservationManager: React.FC = () => {
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const loadReservations = async () => {
        setIsLoading(true);
        try {
            const data = await fetchReservations();
            setReservations(data.sort((a, b) => b.id - a.id));
        } catch (error) {
            console.error("Failed to load reservations", error);
            logError(error as Error, { context: "Admin: Load Reservations" });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadReservations();
    }, []);

    const handleStatusChange = async (id: number, status: Reservation['status']) => {
        try {
            await updateReservationStatus(id, status);
            loadReservations();
        } catch (error) {
            console.error("Failed to update reservation status", error);
            logError(error as Error, { context: "Admin: Update Reservation Status", reservationId: id, newStatus: status });
        }
    };
    
    const getStatusBadge = (status: Reservation['status']) => {
        switch(status) {
            case 'Confirmed': return 'bg-emerald-900/60 text-emerald-300 border-emerald-700/60';
            case 'Cancelled': return 'bg-red-900/60 text-red-300 border-red-700/60';
            case 'Pending': return 'bg-amber-900/60 text-amber-300 border-amber-700/60';
            default: return 'bg-gray-750 text-gray-300 border-gray-600';
        }
    };

    if (isLoading) {
        return <div className="text-center p-8 text-gray-400">Loading reservations...</div>;
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-white">Reservations</h2>
                    <p className="text-sm text-gray-400">{reservations.length} total booking requests</p>
                </div>
            </div>

            {reservations.length === 0 ? (
                <div className="text-center p-8 bg-gray-800 rounded-xl border border-gray-700/60">
                    <p className="text-gray-400">No reservations have been submitted yet.</p>
                </div>
            ) : (
                <div className="space-y-3 sm:space-y-4">
                    {reservations.map(res => (
                        <div key={res.id} className="bg-gray-800 p-4 sm:p-5 rounded-xl border border-gray-700/60 shadow-md flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <p className="font-bold text-white text-base sm:text-lg">{res.name}</p>
                                    <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full border ${getStatusBadge(res.status)}`}>
                                        {res.status}
                                    </span>
                                </div>
                                <p className="text-xs sm:text-sm text-gray-300">
                                    <span className="text-gray-400">Date:</span> <strong className="text-white">{res.date}</strong> at <strong className="text-white">{res.time}</strong> • <strong className="text-amber-400">{res.guests} guests</strong>
                                </p>
                                <p className="text-xs text-gray-400">
                                    {res.email} {res.phone ? `• ${res.phone}` : ''}
                                </p>
                                {res.requests && (
                                    <p className="text-xs text-gray-300 italic bg-gray-900/60 p-2 rounded-lg mt-1 border border-gray-750">
                                        "{res.requests}"
                                    </p>
                                )}
                            </div>

                            <div className="w-full md:w-auto flex items-center justify-between md:justify-end gap-3 pt-2 md:pt-0 border-t md:border-t-0 border-gray-700/50">
                                <label className="text-xs text-gray-400 md:hidden">Update Status:</label>
                                <select 
                                    value={res.status} 
                                    onChange={(e) => handleStatusChange(res.id, e.target.value as Reservation['status'])}
                                    className="bg-gray-700/90 text-white border border-gray-600 rounded-xl p-2 text-sm min-h-[40px] focus:ring-amber-500 focus:border-amber-500"
                                >
                                    <option value="Pending">Pending</option>
                                    <option value="Confirmed">Confirmed</option>
                                    <option value="Cancelled">Cancelled</option>
                                </select>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ReservationManager;
