import React, { useState } from 'react';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  addDays, 
  isToday, 
  isSameMonth, 
  isSameDay, 
  addMonths, 
  subMonths 
} from 'date-fns';

const Calendar = ({ selectedDate, onDateClick, appointments }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const renderHeader = () => {
    return (
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={prevMonth}
          className="p-2 rounded-full hover:bg-gray-100 focus:outline-none"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </button>
        <h2 className="text-xl font-semibold">
          {format(currentMonth, 'MMMM yyyy')}
        </h2>
        <button
          onClick={nextMonth}
          className="p-2 rounded-full hover:bg-gray-100 focus:outline-none"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    );
  };

  const renderDays = () => {
    const days = [];
    const dateFormat = "EEE";
    const startDate = startOfWeek(currentMonth);

    for (let i = 0; i < 7; i++) {
      days.push(
        <div key={i} className="text-center font-medium py-2 text-gray-500">
          {format(addDays(startDate, i), dateFormat)}
        </div>
      );
    }

    return <div className="grid grid-cols-7">{days}</div>;
  };
  console.log(appointments, "appointments")
//   const renderCells = () => {
//     const monthStart = startOfMonth(currentMonth);
//     const monthEnd = endOfMonth(monthStart);
//     const startDate = startOfWeek(monthStart);
//     const endDate = endOfWeek(monthEnd);

//     const rows = [];
//     let days = [];
//     let day = startDate;

//     while (day <= endDate) {
//       for (let i = 0; i < 7; i++) {
//         const cloneDay = day;
//         const dayAppointments = appointments?.filter(appt => {
//           const apptDate = new Date(appt.appointmentDate);
//           return isSameDay(apptDate, cloneDay);
//         });

//         const formattedDate = format(day, 'd');
        
//         days.push(
//           <div
//             key={day.toString()}
//             className={`p-1 relative min-h-[80px] border border-gray-200 ${
//               !isSameMonth(day, monthStart) ? "bg-gray-50 text-gray-400" : ""
//             } ${isToday(day) ? "calendar-day today" : "calendar-day"} ${
//               isSameDay(day, selectedDate) ? "calendar-day selected" : ""
//             }`}
//             onClick={() => onDateClick(cloneDay)}
//           >
//             <span className={`text-sm ${isToday(day) ? "font-bold" : ""}`}>
//               {formattedDate}
//             </span>
//             <div className="mt-1 overflow-y-auto max-h-[50px]">
//               {dayAppointments?.map((appt, idx) => (
//                 <div
//                   key={idx}
//                   className="text-xs p-1 mb-1 rounded bg-indigo-600 text-white truncate animate-fade-in"
//                   title={appt.appointmentName}
//                 >
//                   {appt.appointmentName}
//                 </div>
//               ))}
//             </div>
//           </div>
//         );
        
//         day = addDays(day, 1);
//       }
      
//       rows.push(
//         <div key={day.toString()} className="grid grid-cols-7">
//           {days}
//         </div>
//       );
//       days = [];
//     }
//     return <div className="mb-4">{rows}</div>;
//   };


const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);
  
    const rows = [];
    let days = [];
    let day = startDate;
  
    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const cloneDay = day;
  
        // Check if appointments is an array and filter accordingly
        const dayAppointments = Array.isArray(appointments)
          ? appointments.filter(appt => {
              const apptDate = new Date(appt.appointmentDate);
              return isSameDay(apptDate, cloneDay);
            })
          : []; // Default to an empty array if appointments is not an array
  
        const formattedDate = format(day, 'd');
        
        days.push(
          <div
            key={day.toString()}
            className={`p-1 relative min-h-[80px] border border-gray-200 ${
              !isSameMonth(day, monthStart) ? "bg-gray-50 text-gray-400" : ""
            } ${isToday(day) ? "calendar-day today" : "calendar-day"} ${
              isSameDay(day, selectedDate) ? "calendar-day selected" : ""
            }`}
            onClick={() => onDateClick(cloneDay)}
          >
            <span className={`text-sm ${isToday(day) ? "font-bold" : ""}`}>
              {formattedDate}
            </span>
            <div className="mt-1 overflow-y-auto max-h-[50px]">
              {dayAppointments.map((appt, idx) => (
                <div
                  key={idx}
                  className="text-xs p-1 mb-1 rounded bg-indigo-600 text-white truncate animate-fade-in"
                  title={appt.appointmentName}
                >
                  {appt.appointmentName}
                </div>
              ))}
            </div>
          </div>
        );
        
        day = addDays(day, 1);
      }
  
      rows.push(
        <div key={day.toString()} className="grid grid-cols-7">
          {days}
        </div>
      );
      days = [];
    }
    return <div className="mb-4">{rows}</div>;
  };
  
  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const prevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  return (
    <div className="calendar bg-white p-4 rounded-lg shadow-md">
      {renderHeader()}
      {renderDays()}
      {renderCells()}
    </div>
  );
};

export default Calendar;
