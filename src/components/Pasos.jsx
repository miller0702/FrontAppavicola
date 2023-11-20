import useAuth from "../hooks/useAuth"


const pasos = [
    {paso: 1, nombre: 'Factura', state: 1},
    {paso: 2, nombre: 'Datos Personales', state: 2},
    {paso: 3, nombre: 'Metodo de pago', state: 3},
]
const Pasos = () => {

    const {pagoState, setPagoState} = useAuth()

    const calcularProgreso = () => {
        let valor =1
        if (pagoState === 1) {
             valor = 2
        }else if(pagoState === 2){
             valor = 50
         }else{
            valor = 100
        }
        return valor
    }

  return (
    <>
      <div className="flex justify-between mb-5">
        {pasos.map(paso => (
            <button 
                onClick={() => {
                    setPagoState(paso.state)
                }}
                className="text-2xl font-bold text-zinc-50"
                key={paso.paso}
            >
                {paso.nombre}
            </button>
        ))}
      </div>
      <div className="bg-gray-100 mb-10">
        <div className=" rounded-full bg-orange-500 text-xs leading-none h-2 text-center text-zinc-50" style={{width: `${calcularProgreso()}%`}}>

        </div>
      </div>
    </>
  )
}

export default Pasos