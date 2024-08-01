import React, { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';
import clienteMongoAxios from '../../config/clienteMongoAxios';
import useAuth from '../../hooks/useAuth';

const ChartFive = ({ clienteId }) => {

  const [state, setState] = useState({
    series: [{ name: 'Compras Diarias', data: [] }],
    categories: []
  });

  const [clientes, setClientes] = useState([]);
  const [clienteIdLocal, setClienteId] = useState(clienteId);
  const { usuario } = useAuth();

  useEffect(() => {
    if (usuario) {
      fetchClientes();
    }
  }, [usuario]);

  useEffect(() => {
    if (clienteIdLocal) {
      obtenerDatos();
    }
  }, [clienteIdLocal]);

  const fetchClientes = async () => {
    try {
      const response = await clienteMongoAxios.get('/api/customers/getAll');
      setClientes(response.data);
      const clienteEncontrado = response.data.find(cliente => cliente.telefono === usuario.phone);
      if (clienteEncontrado) {
        setClienteId(clienteEncontrado.id);
      } else {
        console.warn("No se encontró cliente con el teléfono del usuario.");
      }
    } catch (error) {
      console.error('Error al obtener la lista de clientes', error);
    }
  };

  const obtenerDatos = async () => {
    try {
      const { data } = await clienteMongoAxios.get('/api/sale/getSaleForDayCustomer');

      if (usuario && usuario.rol === 3) {
        const telefonoUsuario = usuario.phone;
        const datosFiltrados = data.filter(row => {
          const cliente = clientes.find(cliente => cliente.id === row.cliente_id);
          const telefonoCliente = cliente ? cliente.telefono : '';
          return telefonoCliente === telefonoUsuario;
        });
        formatearDatos(datosFiltrados);
      } else {
        formatearDatos(data);
      }
    } catch (error) {
      console.error("Error fetching purchase data:", error);
    }
  };

  const formatearPrecio = (precio) => {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(precio);
  };

  const formatearDatos = (data) => {
    const seriesDataCompras = data.map(row => row.total_compras);
    const seriesDataCantidad = data.map(row => row.cantidadaves);
    const categories = data.map(row => row.dia);

    setState({
      series: [
        { name: 'Compras Diarias', data: seriesDataCompras },
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
    <div className="col-span-12 rounded-lg border border-stroke bg-white px-5 pt-7.5 pb-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5">
      <div>
        <h3 className="text-xl font-semibold text-black dark:text-white">
          Total Compras Diarias
        </h3>
      </div>

      <div className="mb-2">
        <div id="chartComprasDiarias" className="-ml-5">
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

export default ChartFive;
