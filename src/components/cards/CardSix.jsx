import { useEffect, useState } from "react";
import clienteMongoAxios from "../../config/clienteMongoAxios";
import homeLote from "../../assets/images/icons/homeLote.png";

const CardSix = () => {
  const [totalBajas, setTotalBajas] = useState("");

  useEffect(() => {
    totalMuertes();
  }, []);

  const totalMuertes = async () => {
    try {
      const { data } = await clienteMongoAxios.get('/api/lote/getTotalLote');
      setTotalBajas(data.totalLote);
      console.log(data.totalLote);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="rounded-lg border border-stroke bg-white dark:bg-boxdark dark:border-strokedark p-4 flex items-center">
      <div className="flex-shrink-0 mr-4">
        <img
          src={homeLote}
          alt="Ícono de Mortalidad"
          className="h-24 w-24"
        />
      </div>
      <div className="flex-grow">
        <h4 className="font-bold text-black dark:text-white">
          Lote Actual
        </h4>
        <h1 className="text-title-lg font-bold text-black dark:text-white" style={{ fontSize: 30 }}>
          {totalBajas} Aves
        </h1>
        <span className="text-sm font-medium">Aves restantes en el galpón</span>
      </div>
    </div>
  );
};

export default CardSix;
