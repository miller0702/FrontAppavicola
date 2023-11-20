import React from "react";
import useAuth from "../hooks/useAuth";

export default function Factura({ factura, encriptado}) {
  // console.log(encriptado)
  // console.log(factura)
  const {numeroFactura, cliente, email, fecha, vendedor, cantidadAves, cantidadKilos, precioKilo} = factura

  const pagar = () => {
  };

  return (
    <>
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
          <h2 className="tx-zinc block text-lg">Número de Factura</h2>
        </div>
        <p className="tx-zinc block text-lg font-bold">{numeroFactura}</p>
      </div>

      <div className="h-0.5 w-11/12 bg-zinc" />

      <div className="flex w-full">
        <div className="flex flex-col w-4/12 items-center p-5 gap-1">
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
                d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z"
              />
            </svg>

            <h2 className="tx-zinc block text-lg">Fecha</h2>
          </div>
          <p className="tx-zinc block text-lg font-bold">{fecha}</p>
        </div>

        <div className="flex flex-col w-4/12 items-center p-5 gap-1">
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
                d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
              />
            </svg>

            <h2 className="tx-zinc block text-lg">Cliente</h2>
          </div>
          <p className="tx-zinc block text-lg font-bold text-center">
            {cliente}
          </p>
        </div>

        <div className="flex flex-col w-4/12 items-center p-5 gap-1">
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
                d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
              />
            </svg>

            <h2 className="tx-zinc block text-lg">Vendedor</h2>
          </div>
          <p className="tx-zinc block text-lg font-bold text-center">
            {vendedor}
          </p>
        </div>
      </div>

      <div className="flex w-full">
        <div className="flex flex-col w-4/12 items-center p-5 gap-1">
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
                d="M9 3.75H6.912a2.25 2.25 0 00-2.15 1.588L2.35 13.177a2.25 2.25 0 00-.1.661V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 00-2.15-1.588H15M2.25 13.5h3.86a2.25 2.25 0 012.012 1.244l.256.512a2.25 2.25 0 002.013 1.244h3.218a2.25 2.25 0 002.013-1.244l.256-.512a2.25 2.25 0 012.013-1.244h3.859M12 3v8.25m0 0l-3-3m3 3l3-3"
              />
            </svg>
            <h2 className="tx-zinc block text-lg">Cantidad Aves</h2>
          </div>
          <p className="tx-zinc block text-lg font-bold">{cantidadAves}</p>
        </div>

        <div className="flex flex-col w-4/12 items-center p-5 gap-1">
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
                d="M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.97A48.416 48.416 0 0012 4.5c-2.291 0-4.545.16-6.75.47m13.5 0c1.01.143 2.01.317 3 .52m-3-.52l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.988 5.988 0 01-2.031.352 5.988 5.988 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L18.75 4.971zm-16.5.52c.99-.203 1.99-.377 3-.52m0 0l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.989 5.989 0 01-2.031.352 5.989 5.989 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L5.25 4.971z"
              />
            </svg>

            <h2 className="tx-zinc block text-lg">Cantidad Kilos</h2>
          </div>
          <p className="tx-zinc block text-lg font-bold">{cantidadKilos} KG</p>
        </div>

        <div className="flex flex-col w-4/12 items-center p-5 gap-1">
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
                d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h2 className="tx-zinc block text-lg">Precio del kilo</h2>
          </div>
          <p className="tx-zinc block text-lg font-bold">{precioKilo}</p>
        </div>
      </div>

      <div className="h-0.5 w-11/12 bg-zinc" />

      <div className="flex w-full items-center justify-around p-5">
        <div className="flex items-center gap-10">
          <div className="flex gap-1">
            <h2 className="tx-orange block text-3xl">Total:</h2>
          </div>
          <p className="tx-zinc block text-3xl font-bold">$ {precioKilo * cantidadKilos}</p>
        </div>


        <form method="post" action="https://sandbox.checkout.payulatam.com/ppp-web-gateway-payu/">
          <input name="merchantId"      type="hidden"  value="1000213"   />
          <input name="accountId"       type="hidden"  value="1008881" />
          <input name="description"     type="hidden"  value="Pollos y gallinas"  />
          <input name="referenceCode"   type="hidden"  value={numeroFactura} />
          <input name="amount"          type="hidden"  value={precioKilo * cantidadKilos}   />
          <input name="tax"             type="hidden"  value="0" /> 
          <input name="taxReturnBase"   type="hidden"  value="0" />
          <input name="currency"        type="hidden"  value="COP" />
          <input name="signature"       type="hidden"  value={encriptado}  />
          <input name="test"            type="hidden"  value="1" />
          <input name="buyerEmail"      type="hidden"  value={email} />
          <input name="responseUrl"     type="hidden"  value="http://localhost:5173/resPago" />
          <input name="confirmationUrl" type="hidden"  value="http://192.168.1.39:3000/api/pagos/confirmacion" />
          <input name="Submit" className="bg-orange tx-zinc p-2 text-xl font-semibold rounded-md" type="submit"  value="Ir a Pagar" />
        </form>
      </div>
    </>
  );
}
