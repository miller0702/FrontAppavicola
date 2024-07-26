import { useEffect, useState } from "react";
import clienteMongoAxios from "../../config/clienteMongoAxios";
import homeVentas from "../../assets/images/icons/homeVentas.png";
import useAuth from "../../hooks/useAuth";

const CardEleven = () => {
  const [totalCompras, setTotalCompras] = useState("");
  const { usuario } = useAuth();

  useEffect(() => {
    totalCompra();
  }, []);

  const totalCompra = async () => {
    try {
      const { data } = await clienteMongoAxios.get('/api/customers/getCustomers');
      
      const cliente = data.find(cliente => cliente.telefono === usuario.phone);
      
      if (cliente) {
        setTotalCompras(cliente.total_sales);
        console.log(cliente.total_sales);
      } else {
        setTotalCompras("No se encontraron abonos");
        console.log("No se encontraron abonos para el usuario");
      }
    } catch (error) {
      console.log(error);
    }
  };

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
          Total Compras
        </h4>
        <h1 className="text-title-lg font-bold text-black dark:text-white" style={{ fontSize: 30 }}>
          {formatearPrecio(totalCompras)}
        </h1>
        <span className="text-sm font-medium">Compras al Galpón</span>
      </div>
    </div>
  );
};

export default CardEleven;
