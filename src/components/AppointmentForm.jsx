import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { useAuth } from '../helper/AuthContext';
// import { useAuth } from '../helper/AuthContext';

const AppointmentForm = ({ selectedDate, onAddAppointment }) => {
  const [appointmentName, setAppointmentName] = useState('');
  const [time, setTime] = useState('12:00');
  const [error, setError] = useState('');
  const {user} = useAuth(); 
   const [userId, setUserId] = useState()

   useEffect(() => {
        // console.log()
        setUserId(user)
   }, [user])

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!appointmentName.trim()) {
      setError('Appointment name is required');
      return;
    }

    // Combine date and time
    const [hours, minutes] = time.split(':').map(Number);
    const appointmentDate = new Date(selectedDate);
    appointmentDate.setHours(hours, minutes, 0);
    // const [userId, setUserId] = useState()

    // In a real app, you'd get the user ID from auth context
 
    // console.log(user, "user in appointment form")

    onAddAppointment({
      userId,
      appointmentName,
      appointmentDate: appointmentDate.toISOString()
    });


    setAppointmentName('');
    setError('');
  };


  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">
        Add Appointment for {format(selectedDate, 'MMMM d, yyyy')}
      </h2>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="appointmentName" className="block text-sm font-medium text-gray-700 mb-1">
            Appointment Title
          </label>
          <input
            type="text"
            id="appointmentName"
            value={appointmentName}
            onChange={(e) => setAppointmentName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600"
            placeholder="Enter appointment title"
          />
          {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>
        
        <div className="mb-6">
          <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">
            Time
          </label>
          <input
            type="time"
            id="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600"
          />
        </div>
        
        <button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md transition-colors"
        >
          Add Appointment
        </button>
      </form>
    </div>
  );
};

export default AppointmentForm;
