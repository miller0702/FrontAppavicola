import React, { useState } from "react";
import useAuth from "../hooks/useAuth";

export default function DatosPagador() {

  const {siguientePaso} = useAuth()

  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [documento, setDocumento] = useState("");
  const [tipoDocumento, setTipoDocumento] = useState("");
  const [tipoPersona, setTipoPersona] = useState("");
  const [direccion, setDireccion] = useState("");
  const [telefono, setTelefono] = useState("");

  const pagar = () => {
    if([nombre, email, documento, tipoPersona, setTipoPersona, direccion, telefono].includes('')){
      return
    }
    siguientePaso(3)
  };

  return (
    <form method="post" action="https://sandbox.checkout.payulatam.com/ppp-web-gateway-payu/">
      <input name="merchantId"      type="hidden"  value="508029"   />
      <input name="accountId"       type="hidden"  value="512321" />
      <input name="description"     type="hidden"  value="Test PAYU"  />
      <input name="referenceCode"   type="hidden"  value="N01" />
      <input name="amount"          type="hidden"  value="500"   />
      <input name="tax"             type="hidden"  value="3193" /> 
      <input name="taxReturnBase"   type="hidden"  value="16806" />
      <input name="currency"        type="hidden"  value="COP" />
      <input name="signature"       type="hidden"  value="7ee7cf808ce6a39b17481c54f2c57acc"  />
      <input name="test"            type="hidden"  value="0" />
      <input name="buyerEmail"      type="hidden"  value="test@test.com" />
      <input name="responseUrl"     type="hidden"  value="http://www.test.com/response" />
      <input name="confirmationUrl" type="hidden"  value="http://www.test.com/confirmation" />
      <input name="Submit"          type="submit"  value="Enviar" />
    </form>
  );
}

{/* <>
      <div className="flex flex-col items-center p-5 gap-1">
        <div className="flex gap-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="#F97316"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z"
            />
          </svg>
          <h2 className="text-zinc-50 block text-lg">Datos Personales</h2>
        </div>
      </div>

      <div className="h-0.5 bg-zinc-50" />

      <div className="flex w-full gap-5 my-5">
        <div className="w-4/12">
          <label
            htmlFor="nombre"
            className=" text-zinc-50 block text-lg "
          >
            Nombre
          </label>
          <input
            id="nombre"
            type="text"
            placeholder="Email de Registro"
            className="w-full mt-2 p-2 border rounded-md bg-gray-50"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
        </div>
        
        <div className="w-3/12">
          <label
            htmlFor="tippoDocumento"
            className=" text-zinc-50 block text-lg "
          >
            Tipo Documento
          </label>
          <select
            id="tippoDocumento"
            placeholder="Tipo de Persona"
            className="w-full mt-2 p-2 border rounded-md bg-gray-50"
            value={tipoDocumento}
            onChange={(e) => setTipoDocumento(e.target.value)}
          >
            <option value="1">Natural</option>
            <option value="2">Natural2</option>
          </select>
        </div>

        <div className="w-3/12">
          <label
            htmlFor="documento"
            className=" text-zinc-50 block text-lg "
          >
            Documento
          </label>
          <input
            id="documento"
            type="text"
            placeholder="Email de Registro"
            className="w-full mt-2 p-2 border rounded-md bg-gray-50"
            value={documento}
            onChange={(e) => setDocumento(e.target.value)}
          />
        </div>
        <div className="w-2/12">
          <label
            htmlFor="telefono"
            className=" text-zinc-50 block text-lg "
          >
            Teléfono
          </label>
          <input
            id="telefono"
            type="text"
            placeholder="Email de Registro"
            className="w-full mt-2 p-2 border rounded-md bg-gray-50"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
          />
        </div>
      </div>

      <div className="flex w-full gap-5 mb-5">
        <div className="w-4/12">
          <label
            htmlFor="email"
            className=" text-zinc-50 block text-lg "
          >
            Email
          </label>
          <input
            id="email"
            type="text"
            placeholder="Email de Registro"
            className="w-full mt-2 p-2 border rounded-md bg-gray-50"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="w-4/12">
          <label
            htmlFor="direccion"
            className=" text-zinc-50 block text-lg "
          >
            Dirección
          </label>
          <input
            id="direccion"
            type="text"
            placeholder="direccion de Registro"
            className="w-full mt-2 p-2 border rounded-md bg-gray-50"
            value={direccion}
            onChange={(e) => setDireccion(e.target.value)}
          />
        </div>
        <div className="w-4/12">
          <label
            htmlFor="tipoPersona"
            className=" text-zinc-50 block text-lg "
          >
            Tipo Persona
          </label>
          <select
            id="tipoPersona"
            placeholder="Tipo de Persona"
            className="w-full mt-2 p-2 border rounded-md bg-gray-50"
            value={tipoPersona}
            onChange={(e) => setTipoPersona(e.target.value)}
          >
            <option value="1">Natural</option>
            <option value="2">Natural2</option>
          </select>
        </div>
      </div>

      <div className="h-0.5 bg-zinc-50" />

      <div className="flex w-full items-center justify-around p-5">
        <button
          className="bg-orange-500 text-zinc-50 p-2 text-lg font-semibold rounded-md"
          onClick={pagar}
        >
          Siguiente
        </button>
      </div>
    </> */}