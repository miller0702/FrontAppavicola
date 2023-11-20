import React, { useState } from 'react'
import clienteMongoAxios from '../config/clienteMongoAxios'
import { generarNumeroAleatorio } from '../util/herreamientas'

export default function FormFactura() {
    const [cliente, setCliente] = useState("")
    const [vendedor, setVendedor] = useState("")
    const [email, setEmail] = useState("")
    const [cantidadAves, setCantidadAves] = useState(0)
    const [cantidadKilos, setCantidadKilos] = useState(0)
    const [precioKilo, setPrecioKilo] = useState(0)
    const [fecha, setFecha] = useState("")

    const registrar = async () => {
        const numeroFactura = await generarNumeroAleatorio()
        try {
            const factura = {
              cliente: cliente,
              vendedor: vendedor,
              clientecorreo: email,
              cantidadaves: cantidadAves,
              cantidadkilos: cantidadKilos,
              preciokilo: precioKilo,
              fecha: fecha,
              numerofactura: numeroFactura
            }
            const {data} = await clienteMongoAxios.post('/api/sale/register', factura)
            const {data2} = await clienteMongoAxios.post('/api/saleMg/register', factura)
            console.log(data)
            console.log(data2)
        } catch (error) {
            console.log(error)
        }
    }

  return (
    <>
      <div>
        <label className="mb-3 block text-black dark:text-white">
          Cliente
        </label>
        <input
          type="text"
          className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
            value={cliente}
            onChange={e => setCliente(e.target.value)}        
        />
      </div>
      <div>
        <label className="mb-3 block text-black dark:text-white">
          Email del Cliente
        </label>
        <input
          type="email"
          className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
            value={email}
            onChange={e => setEmail(e.target.value)}        
        />
      </div>
      <div>
        <label className="mb-3 block text-black dark:text-white">
          Vendedor
        </label>
        <input
          type="text"
          className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
          value={vendedor}
          onChange={e => setVendedor(e.target.value)}  
        />
      </div>
      <div>
        <label className="mb-3 block text-black dark:text-white">
          Cantidad Aves
        </label>
        <input
          type="number"
          className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
          value={cantidadAves}
          onChange={e => setCantidadAves(e.target.value)}  
        />
      </div>
      <div>
        <label className="mb-3 block text-black dark:text-white">
          Cantidad Kilos
        </label>
        <input
          type="number"
          className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
          value={cantidadKilos}
          onChange={e => setCantidadKilos(e.target.value)}  
        />
      </div>
      
      <div>
        <label className="mb-3 block text-black dark:text-white">
          Precio Kilo
        </label>
        <input
          type="number"
          placeholder="Default Input"
          className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
          value={precioKilo}
          onChange={e => setPrecioKilo(e.target.value)}  
        />
      </div>
      <div>
        <label className="mb-3 block text-black dark:text-white">
          Fecha
        </label>
        <div className="relative">
          <input
            type="date"
            className="custom-input-date custom-input-date-1 w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
            value={fecha}
            onChange={e => setFecha(e.target.value)}            
          />
        </div>
      </div>
      <button
        className="flex justify-center rounded bg-primary py-2 px-6 font-medium text-gray hover:shadow-1"
        onClick={() => {registrar()}}
      >
        Generar
      </button>
    </>
  );
}
