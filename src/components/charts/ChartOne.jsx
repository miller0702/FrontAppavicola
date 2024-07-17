import { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import clienteMongoAxios from '../../config/clienteMongoAxios';
import { daysInWeek } from 'date-fns';

const options = {
  legend: {
    show: false,
    position: 'top',
    horizontalAlign: 'left',
  },
  colors: ['#3C50E0', '#80CAEE'],
  chart: {
    fontFamily: 'Satoshi, sans-serif',
    height: 335,
    type: 'area',
    dropShadow: {
      enabled: true,
      color: '#623CEA14',
      top: 10,
      blur: 4,
      left: 0,
      opacity: 0.1,
    },
    toolbar: {
      show: false,
    },
  },
  responsive: [
    {
      breakpoint: 1024,
      options: {
        chart: {
          height: 300,
        },
      },
    },
    {
      breakpoint: 1366,
      options: {
        chart: {
          height: 350,
        },
      },
    },
  ],
  stroke: {
    width: [2, 2],
    curve: 'straight',
  },
  grid: {
    xaxis: {
      lines: {
        show: true,
      },
    },
    yaxis: {
      lines: {
        show: true,
      },
    },
  },
  dataLabels: {
    enabled: false,
  },
  markers: {
    size: 4,
    colors: '#fff',
    strokeColors: ['#3056D3', '#80CAEE'],
    strokeWidth: 3,
    strokeOpacity: 0.9,
    strokeDashArray: 0,
    fillOpacity: 1,
    discrete: [],
    hover: {
      size: undefined,
      sizeOffset: 5,
    },
  },
  xaxis: {
    type: 'category',
    categories: [], // Deja esto vacío inicialmente, se llenará con las fechas dinámicas
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
  },
  yaxis: {
    title: {
      style: {
        fontSize: '0px',
      },
    },
    min: 0,
    max: 100,
  },
};

const ChartOne = () => {
  const [machos, setMachos] = useState([]);
  const [hembras, setHembras] = useState([]);
  const [fechas, setFechas] = useState([]);

  useEffect(() => {
    obtenerDatos();
  }, []);

  const obtenerDatos = async () => {
    try {
      const { data } = await clienteMongoAxios.get('/api/mortality/getMortalityByDay');
      formatearDatos(data);
    } catch (error) {
      console.log(error);
    }
  };

  const formatearDatos = (data) => {
    const arrayMachos = [];
    const arrayHembras = [];
    const arrayFechas = [];
    
    data.forEach((dato) => {
      arrayMachos.push(dato.totalmachos);
      arrayHembras.push(dato.totalhembras);
      arrayFechas.push(formatearFecha(dato.fecha));
    });

    setMachos(arrayMachos);
    setHembras(arrayHembras);
    setFechas(arrayFechas);
  };

  const formatearFecha = (fecha) => {
    const options = { day: '2-digit', month: 'numeric', year: 'numeric' };
    return new Date(fecha).toLocaleDateString('es-ES', options);
  };

  return (
    <div className="col-span-12 rounded-sm border border-stroke bg-white px-5 pt-7.5 pb-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:col-span-8">
      <div className="flex flex-wrap items-start justify-between gap-3 sm:flex-nowrap">
        <div className="flex w-full flex-wrap gap-3 sm:gap-5">
          <div className="flex min-w-47.5">
            <span className="mt-1 mr-2 flex h-4 w-full max-w-4 items-center justify-center rounded-full border border-primary">
              <span className="block h-2.5 w-full max-w-2.5 rounded-full bg-primary"></span>
            </span>
            <div className="w-full">
              <p className="font-semibold text-primary">Total Mortalidad en Machos</p>
              {/* Muestra el rango de fechas dinámicamente */}
              <p className="text-sm font-medium">{fechas.length > 0 ? `${fechas[0]} - ${fechas[fechas.length - 1]}` : ''}</p>
            </div>
          </div>
          <div className="flex min-w-47.5">
            <span className="mt-1 mr-2 flex h-4 w-full max-w-4 items-center justify-center rounded-full border border-secondary">
              <span className="block h-2.5 w-full max-w-2.5 rounded-full bg-secondary"></span>
            </span>
            <div className="w-full">
              <p className="font-semibold text-secondary">Total Mortalidad en Hembras</p>
              {/* Muestra el rango de fechas dinámicamente */}
              <p className="text-sm font-medium">{fechas.length > 0 ? `${fechas[0]} - ${fechas[fechas.length - 1]}` : ''}</p>
            </div>
          </div>
        </div>
        <div className="flex w-full max-w-45 justify-end">
          <div className="inline-flex items-center rounded-md bg-whiter p-1.5 dark:bg-meta-4">
            <button className="rounded bg-white py-1 px-3 text-xs font-medium text-black shadow-card hover:bg-white hover:shadow-card dark:bg-boxdark dark:text-white dark:hover:bg-boxdark">
              Por día
            </button>
          </div>
        </div>
      </div>

      <div>
        <div id="chartOne" className="-ml-5">
          <ReactApexChart
            options={{
              ...options,
              xaxis: {
                ...options.xaxis,
                categories: '',
              },
            }}
            series={[
              {
                name: 'Machos',
                data: machos,
              },
              {
                name: 'Hembras',
                data: hembras,
              },
            ]}
            type="area"
            height={350}
          />
        </div>
      </div>
    </div>
  );
};

export default ChartOne;
