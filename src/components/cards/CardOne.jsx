import { useEffect, useState } from "react";
import clienteMongoAxios from "../../config/clienteMongoAxios";
import homeMortalidad from "../../assets/images/icons/homeMortalidad.png";

const CardOne = () => {
  const [totalBajas, setTotalBajas] = useState("");

  useEffect(() => {
    totalMuertes();
  }, []);

  const totalMuertes = async () => {
    try {
      const { data } = await clienteMongoAxios.get('/api/mortality/getTotalMortality');
      setTotalBajas(data.totalMortality);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="rounded-lg border border-stroke bg-white dark:bg-boxdark dark:border-strokedark p-4 flex items-center">
      <div className="flex-shrink-0 mr-4">
        <img
          src={homeMortalidad}
          alt="Ícono de Mortalidad"
          className="h-24 w-24"
        />
      </div>
      <div className="flex-grow">
        <h4 className="font-bold text-black dark:text-white">
          Mortalidad
        </h4>
        <h1 className="text-title-lg font-bold text-black dark:text-white" style={{ fontSize: 30 }}>
          {totalBajas} Aves
        </h1>
        <span className="text-sm font-medium">Incluye Hembras y Machos</span>
      </div>
    </div>
  );
};

export default CardOne;
