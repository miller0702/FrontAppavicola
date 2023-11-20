import React, { useEffect, useState } from "react";
import logo from "../assets/images/LogoPlataforma.png";
import { Link } from "react-router-dom";
import Factura from "../components/Factura";
import useAuth from "../hooks/useAuth";
import clienteMongoAxios from "../config/clienteMongoAxios";

export default function Pagos() {

  const [nFactura, setNFactura] = useState("");
  const [factura, setFactura] = useState({});
  const [firma, setFirma] = useState("")
  const [validFactura, setValidFactura] = useState(false)

  useEffect(() => {
    obtenerFirma()
  },[factura])



  const handleSubmit = async (e) => {


    try {
      const {data} = await clienteMongoAxios.post('/api/pagos/factura', {numerofactura: nFactura});
      console.log(data)
      setFactura({
        numeroFactura: data.factura.numerofactura,
        fecha: data.factura.fecha,
        cliente: data.factura.cliente,
        email: data.factura.clientecorreo,
        vendedor: data.factura.vendedor,
        cantidadAves: data.factura.cantidadaves,
        cantidadKilos: data.factura.cantidadkilos,
        precioKilo: data.factura.preciokilo
      })
      if(data.succes){
        setValidFactura(true)
      }
    } catch (error) {
      console.log(error)
    }
  };


  const obtenerFirma = async () => {

    const {data} = await clienteMongoAxios.post('/api/pagos/obtenerFirma', {
      numeroFactura: factura.numeroFactura,
      total: factura.cantidadKilos * factura.precioKilo
    })
    setFirma(data.encriptado)
  }



  return (
    <div className="flex h-full">
      <div className="flex flex-col items-center w-3/12 mx-10">
        <img className="logo" src={logo} />
        <div

          className="w-full m-10 p-5 bg-stone rounded-md shadow-lg"

        >
          <div>
            <h2
              htmlFor="nFactura"
              className="uppercase tx-zinc block text-lg font-bold"
            >
              Número de Factura
            </h2>
            <input
              id="nFactura"
              type="text"
              placeholder="Escribe el número de la factura a pagar"
              className="w-full mt-2 p-2 border rounded-md bg-gray-50"
              value={nFactura}
              onChange={(e) => setNFactura(e.target.value)}
            />
          </div>
          <div className="flex justify-center mt-5">
            <button
              className="bg-orange tx-zinc p-2 text-xl font-semibold rounded-md"
              type="submit"
              onClick={handleSubmit}
            >
              Buscar Factura
            </button>
          </div>
        </div>

        <Link
          to="/"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="#F97316"
            className="w-20 h-20"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
            />
          </svg>
        </Link>
      </div>

      <div className="flex flex-col items-center justify-center bg-stone w-9/12 mx-10 my-20 shadow-lg rounded-md">
        <h1 className="text-4xl tx-orange">Informacion del Pago</h1>

        {
          validFactura ? (
            <Factura factura={factura} encriptado={firma}/>
          ) : (
            <h1 className="my-10 text-3xl tx-zinc">Ingresa un numero de factura valido</h1>
          )
        }


      </div>
    </div>
  );
}
