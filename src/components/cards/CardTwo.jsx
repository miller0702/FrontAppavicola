import { useEffect, useState } from "react";
import clienteMongoAxios from "../../config/clienteMongoAxios";
import homeVentas from "../../assets/images/icons/homeVentas.png";

const CardTwo = () => {
  const [totalVentas, setTotalVentas] = useState("");
  
  useEffect(() =>{
    totalMuertes()
  }, [])

  const totalMuertes = async () => {
    try {
      const {data} = await clienteMongoAxios.get('/api/sale/getTotalSale')
      setTotalVentas(data.total_sales)
    } catch (error) {
      console.log(error)
    }
  }

  const formatearPrecio = (precio) => {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(precio);
  };

  return (
    <div className="rounded-lg border border-stroke bg-white dark:bg-boxdark dark:border-strokedark p-4 flex items-center">
      <div className="flex-shrink-0 mr-4">
        <img
          src={homeVentas}
          alt="Ícono de Mortalidad"
          className="h-24 w-24"
        />
      </div>
      <div className="flex-grow">
        <h4 className="font-bold text-black dark:text-white">
          Ventas
        </h4>
        <h1 className="text-title-lg font-bold text-black dark:text-white" style={{ fontSize: 20 }}>
          {formatearPrecio(totalVentas)}
        </h1>
        <span className="text-sm font-medium">Valor Total de Ventas</span>
      </div>
    </div>
  );
};

export default CardTwo;
