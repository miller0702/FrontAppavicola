import React, { useEffect, useState } from "react";
import clienteMongoAxios from "../../config/clienteMongoAxios";
import homeInsumos from "../../assets/images/icons/homeInsumos.png";

const CardFour = () => {
  const [totalInsumos, setTotalInsumos] = useState(0);
  const [totalCompras, setTotalCompras] = useState(0);
  const [totalGastos, setTotalGastos] = useState(0);

  useEffect(() => {
    getTotalInsumos();
    getTotalCompras();
  }, []);

  const getTotalInsumos = async () => {
    try {
      const { data } = await clienteMongoAxios.get('/api/supplies/getTotalSupplies');
      if (data && data.totalcompras) {
        setTotalInsumos(parseFloat(data.totalcompras));
      } else {
        console.error("Error: No se encontró totalinsumos en la respuesta.");
      }
    } catch (error) {
      console.error("Error al obtener totalinsumos:", error);
    }
  };

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

  useEffect(() => {
    setTotalGastos(totalInsumos + totalCompras);
  }, [totalInsumos, totalCompras]);

  return (
    <div className="rounded-lg border border-stroke bg-white dark:bg-boxdark dark:border-strokedark p-4 flex items-center">
      <div className="flex-shrink-0 mr-4">
        <img
          src={homeInsumos}
          alt="Ícono de Mortalidad"
          className="h-24 w-24"
        />
      </div>
      <div className="flex-grow">
        <h4 className="font-bold text-black dark:text-white">
          Insumos y Gastos
        </h4>
        <h1 className="text-title-lg font-bold text-black dark:text-white" style={{ fontSize: 30 }}>
        $ {totalGastos.toLocaleString("es-ES", { minimumFractionDigits: 0 })}
        </h1>
        <span className="text-sm font-medium">Valor Total de Gastos</span>
      </div>
    </div>
  );
};

export default CardFour;
