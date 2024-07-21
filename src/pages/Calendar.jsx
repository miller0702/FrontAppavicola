import React, { useState, useEffect } from 'react';
import Breadcrumb from '../components/Breadcrumb';
import EventModal from '../components/EventModal';
import clienteMongoAxios from '../config/clienteMongoAxios';
import { FaEdit, FaPencilAlt, FaTrash } from 'react-icons/fa'; // Importa iconos de react-icons

const Calendar = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    // Cargar eventos desde la API
    const fetchEvents = async () => {
      try {
        const response = await clienteMongoAxios.get('/api/events/getAll');
        if (Array.isArray(response.data)) {
          setEvents(response.data);
        } else {
          console.error('Los datos de eventos no son un array:', response.data);
        }
      } catch (error) {
        console.error('Error al cargar eventos:', error);
      }
    };

    fetchEvents();
  }, []);

  // Navegar entre meses
  const changeMonth = (delta) => {
    setCurrentDate(prevDate => {
      const newDate = new Date(prevDate.getFullYear(), prevDate.getMonth() + delta, 1);
      return newDate;
    });
  };

  // Navegar entre años
  const changeYear = (delta) => {
    setCurrentDate(prevDate => {
      const newDate = new Date(prevDate.getFullYear() + delta, prevDate.getMonth(), 1);
      return newDate;
    });
  };

  // Obtener eventos para una fecha específica
  const getEventsForDate = (date) => {
    return events.filter(event => {
      const eventStart = new Date(event.start_date);
      const eventEnd = new Date(event.end_date);
      const targetDate = new Date(date);

      return targetDate >= eventStart && targetDate <= eventEnd;
    });
  };

  // Renderizar los días del mes
  const renderCalendarGrid = () => {
    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
    const days = [];

    // Días vacíos al inicio del mes
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<td key={`empty-${i}`} className="border p-2"></td>);
    }

    // Días del mes
    for (let day = 1; day <= daysInMonth; day++) {
      const dateString = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
      const dayEvents = getEventsForDate(dateString);

      days.push(
        <td key={day} className="ease relative h-20 cursor-pointer border border-stroke p-2 transition duration-500 hover:bg-gray dark:border-strokedark dark:hover:bg-meta-4 md:h-25 md:p-6 xl:h-31" onClick={() => handleDayClick(dateString)}>
          <span className="font-medium text-black dark:text-white">{day}</span>
          {dayEvents.map((event, index) => (
            <div key={index} className="event-group">
              <div className="event invisible absolute left-2 z-99 mb-1 flex w-[200%] flex-col rounded-sm border-l-[3px] border-primary bg-gray px-3 py-1 text-left opacity-0 group-hover:visible group-hover:opacity-100 dark:bg-meta-4 md:visible md:w-[190%] md:opacity-100">
                <span className="event-name text-sm font-semibold text-black dark:text-white">{event.title}</span>
                <span className="time text-sm font-medium text-black dark:text-white">{dateString}</span>
                <div className="flex gap-2">
                  <button onClick={() => handleEditEvent(event)} className="bg-primary hover:bg-primary-dark text-white rounded-full p-2">
                    <FaPencilAlt />
                  </button>
                  <button onClick={() => handleDeleteEvent(event.id)} className="bg-red hover:bg-primary-dark text-white rounded-full p-2">
                    <FaTrash />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </td>
      );
    }

    return days;
  };

  const handleDayClick = (date) => {
    setSelectedEvent({ start_date: date, end_date: date, title: '' });
    setShowModal(true);
  };

  const handleEditEvent = (event) => {
    setSelectedEvent(event);
    setShowModal(true);
  };

  const handleDeleteEvent = async (id) => {
    try {
      await clienteMongoAxios.delete(`/api/events/delete/${id}`);
      setEvents(events.filter(event => event.id !== id));
    } catch (error) {
      console.error('Error al eliminar evento:', error);
    }
  };

  const handleModalSave = async (event) => {
    try {
      if (event.id) {
        await clienteMongoAxios.put(`/api/events/update/${event.id}`, event);
      } else {
        await clienteMongoAxios.post('/api/events/create', event);
      }
      setShowModal(false);
      const response = await clienteMongoAxios.get('/api/events/getAll');
      setEvents(response.data);
    } catch (error) {
      console.error('Error al guardar evento:', error);
    }
  };

  const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
  const year = currentDate.getFullYear();
  const month = monthNames[currentDate.getMonth()];

  return (
    <>
      <Breadcrumb pageName="Calendario" />

      <div className="w-full max-w-full rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="flex justify-between p-4">
          <button onClick={() => changeYear(-1)}>Año Anteior</button>
          <button onClick={() => changeMonth(-1)}>Mes Anteior</button>
          <span>{month} {year}</span>
          <button onClick={() => changeMonth(1)}>Siguiete Mes</button>
          <button onClick={() => changeYear(1)}>Siguiente Año</button>
        </div>
        <table className="w-full">
          <thead>
            <tr className="grid grid-cols-7 rounded-t-sm bg-primary text-white">
              <th className="flex h-15 items-center justify-center">Domingo</th>
              <th className="flex h-15 items-center justify-center">Lunes</th>
              <th className="flex h-15 items-center justify-center">Martes</th>
              <th className="flex h-15 items-center justify-center">Miércoles</th>
              <th className="flex h-15 items-center justify-center">Jueves</th>
              <th className="flex h-15 items-center justify-center">Viernes</th>
              <th className="flex h-15 items-center justify-center">Sábado</th>
            </tr>
          </thead>
          <tbody>
            <tr className="grid grid-cols-7">
              {renderCalendarGrid()}
            </tr>
          </tbody>
        </table>
      </div>

      {showModal && (
        <EventModal
          event={selectedEvent}
          onSave={handleModalSave}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
};

export default Calendar;
