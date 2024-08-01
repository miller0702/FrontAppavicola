import React, { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';
import clienteMongoAxios from '../../config/clienteMongoAxios';

const ChartFour = () => {
  
  const [state, setState] = useState({
    series: [{ name: 'Ventas Diarias', data: [] }],
    categories: []
  });

  useEffect(() => {
    obtenerDatos();
  }, []);

  const obtenerDatos = async () => {
    try {
      const { data } = await clienteMongoAxios.get('/api/sale/getSaleForDay');
      formatearDatos(data);
    } catch (error) {
      console.error("Error fetching sales data:", error);
    }
  };

  const formatearPrecio = (precio) => {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(precio);
  };

  const formatearDatos = (data) => {
    const seriesDataVentas = data.map(row => row.total_ventas);
    const seriesDataCantidad = data.map(row => row.total_cantidad_aves);
    const categories = data.map(row => row.dia);

    setState({
      series: [
        { name: 'Ventas Diarias', data: seriesDataVentas },
        { name: 'Cantidad Aves', data: seriesDataCantidad }
      ],
      categories: categories
    });
  };

  const options = {
    colors: ['#3C50E0', '#FF5733'],
    chart: {
      fontFamily: 'Satoshi, sans-serif',
      type: 'bar',
      height: 350,
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
        borderRadius: 2,
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 4,
      colors: ['transparent'],
    },
    xaxis: {
      categories: state.categories,
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: [
      {
        title: {
          text: 'Valor Compras',
        },
        labels: {
          formatter: function (value) {
            return formatearPrecio(value);
          },
        },
      },
      {
        opposite: true,
        title: {
          text: 'Cantidad Aves',
        },
        labels: {
          formatter: function (value) {
            return value;
          },
        },
        min: 0,
      },
    ],
    legend: {
      show: true,
      position: 'top',
      horizontalAlign: 'left',
      fontFamily: 'inter',
      markers: {
        radius: 99,
      },
    },
    grid: {
      yaxis: {
        lines: {
          show: false,
        },
      },
    },
    fill: {
      opacity: 1,
    },
    tooltip: {
      y: {
        formatter: function (value, { seriesIndex }) {
          if (seriesIndex === 0) {
            return formatearPrecio(value);
          } else {
            return value;
          }
        },
      },
    },
  };

  return (
    <div className="rounded-lg col-span-12 border border-stroke bg-white px-5 pt-7.5 pb-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5">
      <div>
        <h3 className="text-xl font-semibold text-black dark:text-white">
          Total ventas diarias lote actual
        </h3>
      </div>

      <div className="mb-2">
        <div id="chartFour" className="-ml-5">
          <ReactApexChart
            options={options}
            series={state.series}
            type="bar"
            height={350}
          />
        </div>
      </div>
    </div>
  );
};

export default ChartFour;
