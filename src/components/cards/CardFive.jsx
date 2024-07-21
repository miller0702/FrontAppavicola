import { useEffect, useState } from "react";
import clienteMongoAxios from "../../config/clienteMongoAxios";
import homeCompras from "../../assets/images/icons/homeCompras.png";

const CardFive = () => {
  const [totalCompras, setTotalCompras] = useState(0);


  useEffect(() => {
    getTotalCompras();
  }, []);

  const getTotalCompras = async () => {
    try {
      const { data } = await clienteMongoAxios.get('/api/buys/getTotalBuys');
      if (data && data.totalcompras) {
        setTotalCompras(parseFloat(data.totalcompras));
      } else {
        console.error("Error: No se encontró totalcompras en la respuesta.");
      }
    } catch (error) {
      console.error("Error al obtener totalcompras:", error);
    }
  };

  return (
    <div className="rounded-lg border border-stroke bg-white dark:bg-boxdark dark:border-strokedark p-4 flex items-center">
      <div className="flex-shrink-0 mr-4">
        <img
          src={homeCompras}
          alt="Ícono de Mortalidad"
          className="h-24 w-24"
        />
      </div>
      <div className="flex-grow">
        <h4 className="font-bold text-black dark:text-white">
          Compra Alimento
        </h4>
        <h1 className="text-title-lg font-bold text-black dark:text-white" style={{ fontSize: 30 }}>
        $ {totalCompras.toLocaleString("es-ES", { minimumFractionDigits: 0 })}
        </h1>
        <span className="text-sm font-medium">Valor en Alimento Comprado</span>
      </div>
    </div>
  );
};

export default CardFive;
