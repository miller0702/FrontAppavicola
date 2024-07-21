import { useEffect, useState } from "react";
import clienteMongoAxios from "../../config/clienteMongoAxios";
import homeProveedor from "../../assets/images/icons/homeProveedor.png";

const CardEight = () => {
  const [totalBajas, setTotalBajas] = useState("");

  useEffect(() => {
    totalMuertes();
  }, []);

  const totalMuertes = async () => {
    try {
      const { data } = await clienteMongoAxios.get('/api/suppliers/getTotalSuppliers');
      setTotalBajas(data.totalSuppliers);
      console.log(data.totalSuppliers);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="rounded-lg border border-stroke bg-white dark:bg-boxdark dark:border-strokedark p-4 flex items-center">
      <div className="flex-shrink-0 mr-4">
        <img
          src={homeProveedor}
          alt="Ícono de Mortalidad"
          className="h-24 w-24"
        />
      </div>
      <div className="flex-grow">
        <h4 className="font-bold text-black dark:text-white">
          Proveedores
        </h4>
        <h1 className="text-title-lg font-bold text-black dark:text-white" style={{ fontSize: 30 }}>
          {totalBajas}
        </h1>
        <span className="text-sm font-medium">Total de Proveedores Registrados</span>
      </div>
    </div>
  );
};

export default CardEight;
