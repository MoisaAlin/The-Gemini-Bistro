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
            // Sort by most recent first
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
            loadReservations(); // Refresh data
        } catch (error) {
            console.error("Failed to update reservation status", error);
            logError(error as Error, { context: "Admin: Update Reservation Status", reservationId: id, newStatus: status });
        }
    };
    
    const getStatusColor = (status: Reservation['status']) => {
        switch(status) {
            case 'Confirmed': return 'bg-green-500';
            case 'Cancelled': return 'bg-red-500';
            case 'Pending': return 'bg-yellow-500';
            default: return 'bg-gray-500';
        }
    }

    if (isLoading) {
        return <div className="text-center p-8">Loading reservations...</div>;
    }

    return (
        <div>
            <h2 className="text-2xl font-semibold mb-6">Reservations ({reservations.length})</h2>
             {reservations.length === 0 ? (
                <div className="text-center p-8 bg-gray-800 rounded-lg">
                    <p className="text-gray-400">No reservations have been submitted yet.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {reservations.map(res => (
                        <div key={res.id} className="bg-gray-800 p-4 rounded-lg shadow-md flex flex-wrap justify-between items-center gap-4">
                            <div>
                                <p className="font-bold text-white text-lg">{res.name}</p>
                                <p className="text-sm text-gray-400">{res.email} | {res.guests} guests</p>
                                <p className="text-sm text-gray-300">{res.date} at {res.time}</p>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className={`px-3 py-1 text-xs font-bold text-white rounded-full ${getStatusColor(res.status)}`}>
                                    {res.status}
                                </span>
                                <select 
                                    value={res.status} 
                                    onChange={(e) => handleStatusChange(res.id, e.target.value as Reservation['status'])}
                                    className="bg-gray-700 text-white border-gray-600 rounded p-2"
                                >
                                    <option value="Pending">Pending</option>
                                    <option value="Confirmed">Confirm</option>
                                    <option value="Cancelled">Cancel</option>
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
