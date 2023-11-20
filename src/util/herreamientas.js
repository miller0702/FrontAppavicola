
const generarNumeroAleatorio = () => {
  const numeroAleatorio = Math.floor(Math.random() * 10000) + 1; // Genera un número aleatorio entre 1 y 100
  return numeroAleatorio
}

export {generarNumeroAleatorio}