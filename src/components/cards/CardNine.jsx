import { useEffect, useState } from "react";
import clienteMongoAxios from "../../config/clienteMongoAxios";
import homeDeuda from "../../assets/images/icons/homeDeuda.png";
import useAuth from "../../hooks/useAuth";

const CardNine = () => {
  const [totalDeudas, setTotalDeudas] = useState("");
  const { usuario } = useAuth();

  useEffect(() => {
    totalDeuda();
  }, []);

  const totalDeuda = async () => {
    try {
      const { data } = await clienteMongoAxios.get('/api/customers/getCustomers');
      
      const cliente = data.find(cliente => cliente.telefono === usuario.phone);
      
      if (cliente) {
        setTotalDeudas(cliente.deuda_actual);
      } else {
        setTotalDeudas("No se encontraron deudas");
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
          src={homeDeuda}
          alt="Ícono de Mortalidad"
          className="h-24 w-24"
        />
      </div>
      <div className="flex-grow">
        <h4 className="font-bold text-black dark:text-white">
          Deuda Actual
        </h4>
        <h1 className="text-title-lg font-bold text-black dark:text-white" style={{ fontSize: 30 }}>
          {formatearPrecio(totalDeudas)}
        </h1>
        <span className="text-sm font-medium">Deuda actual con el Galpón</span>
      </div>
    </div>
  );
};

export default CardNine;
