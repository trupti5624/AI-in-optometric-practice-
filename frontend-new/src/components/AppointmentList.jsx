import React from 'react';
import { format } from 'date-fns';

const AppointmentList = ({ appointments, onDeleteAppointment }) => {
  // Sort appointments by date
  const sortedAppointments = appointments?.sort((a, b) => {
    return new Date(a.appointmentDate).getTime() - new Date(b.appointmentDate).getTime();
  });

  if (appointments?.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Upcoming Appointments</h2>
        <p className="text-gray-500 italic">No appointments scheduled</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Upcoming Appointments</h2>
      <ul className="space-y-3">
        {sortedAppointments?.map((appointment) => {
          const appointmentDate = new Date(appointment.appointmentDate);
          
          return (
            <li 
              key={appointment._id || appointmentDate.getTime().toString()} 
              className="p-3 border border-gray-200 rounded-md hover:bg-gray-50 flex justify-between items-center"
            >
              <div>
                <h3 className="font-medium">{appointment.appointmentName}</h3>
                <p className="text-sm text-gray-500">
                  {format(appointmentDate, 'PPP')} at {format(appointmentDate, 'p')}
                </p>
              </div>
              
              {onDeleteAppointment && (
                <button 
                  onClick={() => onDeleteAppointment(appointment._id)}
                  className="text-red-500 hover:text-red-700"
                  aria-label="Delete appointment"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </button>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default AppointmentList;
