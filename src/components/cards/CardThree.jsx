import { useEffect, useState } from "react";
import clienteMongoAxios from "../../config/clienteMongoAxios";
import homeAlimento from "../../assets/images/icons/homeAlimento.png";

const CardThree = () => {

  const [totalConsumido, setTotalConsumido] = useState("");
  
  useEffect(() =>{
    totalMuertes()
  }, [])

  const totalMuertes = async () => {
    try {
      const {data} = await clienteMongoAxios.get('/api/food/getTotalFood')
      setTotalConsumido(data.totalFood)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="rounded-lg border border-stroke bg-white dark:bg-boxdark dark:border-strokedark p-4 flex items-center">
      <div className="flex-shrink-0 mr-4">
        <img
          src={homeAlimento}
          alt="Ícono de Mortalidad"
          className="h-24 w-24"
        />
      </div>
      <div className="flex-grow">
        <h4 className="font-bold text-black dark:text-white">
          Alimento
        </h4>
        <h1 className="text-title-lg font-bold text-black dark:text-white" style={{ fontSize: 30 }}>
          {totalConsumido} Bultos
        </h1>
        <span className="text-sm font-medium">Total Alimento Consumido</span>
      </div>
    </div>
  );
};

export default CardThree;
