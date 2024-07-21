import { Button, TextField } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import React, { useState, useEffect } from 'react';
import { FaCalendar } from 'react-icons/fa';
import { FaSignalMessenger } from 'react-icons/fa6';

const EventModal = ({ event, onSave, onClose }) => {
    const [title, setTitle] = useState('');
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    useEffect(() => {
        if (event) {
            setTitle(event.title || '');
            setStartDate(event.start_date || '');
            setEndDate(event.end_date || '');
        }
    }, [event]);

    const handleSave = () => {
        const updatedEvent = {
            id: event?.id,
            title,
            start_date: startDate,
            end_date: endDate,
        };
        onSave(updatedEvent);
    };

    return (
        <div className="modal">
            <div className="modal-content">
                <h2 className="text-title-lg font-bold mb-5 mt-5">{event?.id ? 'Edit Event' : 'Add Event'}</h2>
                <form>
                    <div className="mb-4">
                        <label className="mb-3 block text-black dark:text-white"><FaSignalMessenger className="inline-block mr-2" />Titulo del Registro</label>
                        <input
                            type="text"
                            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="mb-3 block text-black dark:text-white"><FaCalendar className="inline-block mr-2" /> Fecha</label>
                        <div className="relative">
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DatePicker
                                    label="Seleccione la fecha"
                                    value={startDate}
                                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 pl-10 pr-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                    onChange={(e) => setStartDate(e.target.value)}
                                    renderInput={(params) => <TextField {...params} fullWidth />}
                                    format='dd-MM-yyyy'
                                />
                            </LocalizationProvider>
                        </div>
                    </div>
                    <div>
                        <label className="mb-3 block text-black dark:text-white"><FaCalendar className="inline-block mr-2" /> Fecha</label>
                        <div className="relative">
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DatePicker
                                    label="Seleccione la fecha"
                                    value={endDate}
                                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 pl-10 pr-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                    onChange={(e) => setEndDate(e.target.value)}
                                    renderInput={(params) => <TextField {...params} fullWidth />}
                                    format='dd-MM-yyyy'
                                />
                            </LocalizationProvider>
                        </div>
                    </div>
                    <Button onClick={handleSave} variant="contained" color="primary" style={{marginTop:20, marginRight:20}}>
                        Guardar
                    </Button>
                    <Button onClick={onClose} variant="contained" color="error" style={{marginTop:20}}>
                        Cancel
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default EventModal;

