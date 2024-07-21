import { useEffect, useState } from "react";
import clienteMongoAxios from "../../config/clienteMongoAxios";
import homeClientes from "../../assets/images/icons/homeClientes.png";

const CardSeven = () => {
  const [totalBajas, setTotalBajas] = useState("");

  useEffect(() => {
    totalMuertes();
  }, []);

  const totalMuertes = async () => {
    try {
      const { data } = await clienteMongoAxios.get('/api/customers/getTotalCustomers');
      setTotalBajas(data.totalCustomers);
      console.log(data.totalCustomers);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="rounded-lg border border-stroke bg-white dark:bg-boxdark dark:border-strokedark p-4 flex items-center">
      <div className="flex-shrink-0 mr-4">
        <img
          src={homeClientes}
          alt="Ícono de Mortalidad"
          className="h-24 w-24"
        />
      </div>
      <div className="flex-grow">
        <h4 className="font-bold text-black dark:text-white">
          Clientes
        </h4>
        <h1 className="text-title-lg font-bold text-black dark:text-white" style={{ fontSize: 30 }}>
          {totalBajas}
        </h1>
        <span className="text-sm font-medium">Total de Clientes Registrados</span>
      </div>
    </div>
  );
};

export default CardSeven;
