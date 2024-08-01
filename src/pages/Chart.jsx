import React, { useState, useEffect } from 'react';
import Breadcrumb from '../components/Breadcrumb.jsx';
import CardEight from '../components/cards/CardEight.jsx';
import CardFive from '../components/cards/CardFive.jsx';
import CardFour from '../components/cards/CardFour.jsx';
import CardOne from '../components/cards/CardOne.jsx';
import CardSeven from '../components/cards/CardSeven.jsx';
import CardSix from '../components/cards/CardSix.jsx';
import CardThree from '../components/cards/CardThree.jsx';
import CardTwo from '../components/cards/CardTwo.jsx';
import ChartFour from '../components/charts/ChartFour.jsx';
import ChartOne from '../components/charts/ChartOne.jsx';
import ChartThree from '../components/charts/ChartThree.jsx';
import ChartTwo from '../components/charts/ChartTwo.jsx';
import clienteMongoAxios from '../config/clienteMongoAxios';

const Chart = () => {
  const [lotes, setLotes] = useState([]);
  const [selectedLoteId, setSelectedLoteId] = useState('');
  const [selectedLoteDescripcion, setSelectedLoteDescripcion] = useState('');
  const [selectedReportType, setSelectedReportType] = useState('');
  const [reportTypeName, setReportTypeName] = useState('Reporte General');

  useEffect(() => {
    const fetchLotes = async () => {
      try {
        const response = await clienteMongoAxios.get('/api/lote/getAll');
        setLotes(response.data);
      } catch (error) {
        console.error('Error al cargar lotes:', error);
      }
    };

    fetchLotes();
  }, []);

  useEffect(() => {
    if (lotes.length > 0 && selectedLoteId) {
      const selectedLote = lotes.find(lote => lote.id === parseInt(selectedLoteId, 10));
      setSelectedLoteDescripcion(selectedLote ? selectedLote.descripcion : '');
    }
  }, [selectedLoteId, lotes]);

  useEffect(() => {
    const reportTypeNames = {
      '': 'GENERAL',
      '1': 'COMPRAS DE ALIMENTO',
      '2': 'CONSUMO DE ALIMENTO',
      '3': 'MORTALIDAD AVES',
      '4': 'INSUMOS Y GASTOS',
      '5': 'VENTAS',
      '6': 'ABONOS',
    };
    setReportTypeName(reportTypeNames[selectedReportType]);
  }, [selectedReportType]);

  const handleLoteChange = (event) => {
    setSelectedLoteId(event.target.value);
  };

  const handleReportTypeChange = (event) => {
    setSelectedReportType(event.target.value);
  };

  const handleDownloadReport = async () => {
    if (!selectedLoteId) {
      alert('Por favor, selecciona un lote.');
      return;
    }

    try {
      const endpoint = selectedReportType === ''
        ? `/api/lote/${selectedLoteId}/invoice`
        : `/api/lote/${selectedLoteId}/reporte?tipo=${selectedReportType}`;

      const response = await clienteMongoAxios.get(endpoint, {
        responseType: 'blob',
      });

      if (response.status !== 200) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      const fileName = `REPORTE_${reportTypeName.replace(/\s+/g, '_')}_${selectedLoteDescripcion || 'DESCONOCIDO'}.pdf`;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error al descargar el reporte:', error);
    }
  };

  return (
    <>
      <Breadcrumb pageName="Reportes Generales" />
      <p className='mb-5'>
        {selectedReportType === ''
          ? 'Selecciona el lote de aves del cual deseas descargar el reporte general en PDF.'
          : 'Selecciona el lote de aves y el tipo de reporte que deseas descargar en PDF.'}
      </p>

      <div className="mb-5">
        <label htmlFor="lote-select" className="mr-3 mt-3">Selecciona un Lote:</label>
        <select
          id="lote-select"
          className="mt-3 mr-3 rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
          value={selectedLoteId}
          onChange={handleLoteChange}
        >
          <option value="">Selecciona un lote</option>
          {lotes.map((lote) => (
            <option key={lote.id} value={lote.id}>
              {lote.descripcion}
            </option>
          ))}
        </select>

        <label htmlFor="report-type-select" className="mr-3 mt-3">Selecciona el tipo de reporte:</label>
        <select
          id="report-type-select"
          className="mt-3 rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
          value={selectedReportType}
          onChange={handleReportTypeChange}
        >
          <option value="">Reporte General</option>
          <option value='1'>Compras de Alimento</option>
          <option value='2'>Consumo de Alimento</option>
          <option value='3'>Mortalidad</option>
          <option value='4'>Insumos y Gastos</option>
          <option value='5'>Ventas</option>
          <option value='6'>Abonos</option>
        </select>

        <button
          onClick={handleDownloadReport}
          className="mt-3 ml-5 bg-primary text-white rounded px-4 py-2"
        >
          Descargar Reporte
        </button>
      </div>

      <div className="mb-5 grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
        <CardOne />
        <CardTwo />
        <CardThree />
        <CardFour />
        <CardFive />
        <CardSix />
        <CardSeven />
        <CardEight />
      </div>

      <div className="grid grid-cols-12 gap-4 md:gap-6 2xl:gap-7.5">
        <div className="col-span-12">
          <ChartFour />
        </div>
        <ChartOne />
        <ChartTwo />
        <ChartThree />
      </div>
    </>
  );
};

export default Chart;
