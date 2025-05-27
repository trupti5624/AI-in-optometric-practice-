import React, { useState, useEffect } from 'react';
import Calendar from '../components/AppointmentCalendar';
import AppointmentForm from '../components/AppointmentForm';
import AppointmentList from '../components/AppointmentList';
import SideNav from '../components/SideNav';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth } from '../helper/AuthContext';
// import Calendar from '../components/Calendar';
// import AppointmentForm from '../components/AppointmentForm';
// import AppointmentList from '../components/AppointmentList';
// import AppointmentService from '../services/AppointmentService';
// import { toast } from 'sonner';

const AppointmentCalendar = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  console.log(appointments, "appointments")

  // In a real app, you would get this from authentication context
  const {user} = useAuth()
  

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        // console.log("hi")
        const response = await axios.get(`http://localhost:3000/data/appointments/${user}`)
        // const fetchedAppointments = await AppointmentService.getAppointments(userId);
        console.log(response, "response")
        setAppointments(response?.data?.appointments);
      } catch (error) {
        console.error('Failed to fetch appointments:', error);
        toast.error('Failed to load appointments');
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [user]);

  const handleDateClick = (date) => {
    setSelectedDate(date);
  };

  const handleAddAppointment = async (newAppointment) => {
    console.log(newAppointment, "newAppointment")
    try {
      // Send POST request to the API to create a new appointment
      const response = axios.post('http://localhost:3000/data/appointments', newAppointment)
  
    //   const data = await response.json();
  
      if (response) {
        setAppointments((prevAppointments) => [...prevAppointments, newAppointment]);
        toast.success('Appointment created successfully!');
      } else {
        toast.error(data.message || 'Failed to create appointment');
      }
    } catch (error) {
      console.error('Error adding appointment:', error);
      toast.error('Failed to create appointment');
    }
  };
  

  const handleDeleteAppointment = (id) => {
    console.log(id)
    // In a real app, you would call an API to delete the appointment
    // setAppointments(appointments.filter(appt => appt._id !== id));
    // toast.success('Appointment deleted');
  };

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-calendar-DEFAULT"></div>
//       </div>
//     );
//   }

  return (
    <div className='flex'>
        <div>
            <SideNav />
        </div>
    <div className="ml-64 w-full mt-12 px-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 text-center mb-12">Appointment Calendar</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Calendar 
              selectedDate={selectedDate}
              onDateClick={handleDateClick}
              appointments={appointments}
            />
          </div>
          
          <div className="space-y-8">
            <AppointmentForm 
              selectedDate={selectedDate}
              onAddAppointment={handleAddAppointment}
            />
            
            <AppointmentList 
              appointments={appointments}
            //   onDeleteAppointment={handleDeleteAppointment}
            />
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default AppointmentCalendar;
