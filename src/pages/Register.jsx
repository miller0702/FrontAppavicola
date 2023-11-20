import React, { useState } from "react";
import logo from "../assets/images/LogoPlataforma.png";
import { Link, useNavigate } from "react-router-dom";
import clienteMongoAxios from "../config/clienteMongoAxios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Register() {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [telefono, setTelefono] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const navigate = useNavigate()
  const handleSubmit = async (e) => {
    e.preventDefault();

    if(password !== confirmPassword){
      console.log('Las contraseñas no coindicen')
      return
    }

    try {

      const {data} = await clienteMongoAxios.post('/api/users/create', {name: nombre, lastname: apellido, phone: telefono, email, password})
      
      toast.success('Usuario creado', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });

      setNombre('')
      setApellido('')
      setTelefono('')
      setEmail('')
      setPassword('')
      setConfirmPassword('')

      setTimeout(() => {
        navigate('/')
      }, 3000);
      
    } catch (error) {
      toast.error('Error al registrar el usuario', {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  };

  return (
    <div className="flex flex-col w-full items-center">
      <img className="logo" src={logo} />
      <form
        className="bg-stone shadow-lg rounded-md pt-5 mb-10 px-10 w-1/2"
        onSubmit={handleSubmit}
      >
        <div className="my-5">
          <label
            htmlFor="nombre"
            className="uppercase tx-zinc block text-lg font-bold"
          >
            Nombre
          </label>
          <input
            id="nombre"
            type="text"
            placeholder="Tu nombre completo"
            className="w-full mt-2 p-2 border rounded-md bg-gray-50"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
        </div>
        
        <div className="my-5">
          <label
            htmlFor="apellido"
            className="uppercase tx-zinc block text-lg font-bold"
          >
            Apellido
          </label>
          <input
            id="apellido"
            type="text"
            placeholder="Tu Apellido completo"
            className="w-full mt-2 p-2 border rounded-md bg-gray-50"
            value={apellido}
            onChange={(e) => setApellido(e.target.value)}
          />
        </div>

        <div className="my-5">
          <label
            htmlFor="telefono"
            className="uppercase tx-zinc block text-lg font-bold"
          >
            Teléfono
          </label>
          <input
            id="telefono"
            type="number"
            placeholder="Tu numero telefonico"
            className="w-full mt-2 p-2 border rounded-md bg-gray-50"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
          />
        </div>
        
        <div className="my-5">
          <label
            htmlFor="email"
            className="uppercase tx-zinc block text-lg font-bold"
          >
            Escribe tu email
          </label>
          <input
            id="email"
            type="email"
            placeholder="example@mail.com"
            className="w-full mt-2 p-2 border rounded-md bg-gray-50"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="my-5">
          <label
            htmlFor="password"
            className="uppercase tx-zinc block text-lg font-bold"
          >
            Contraseña
          </label>
          <input
            id="password"
            type="password"
            placeholder="Escribe una Contraseña"
            className="w-full mt-2 p-2 border rounded-md bg-gray-50"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="my-5">
          <label
            htmlFor="passwordConfirm"
            className="uppercase tx-zinc block text-lg font-bold"
          >
            Contraseña
          </label>
          <input
            id="passwordConfirm"
            type="password"
            placeholder="Confirma la Contraseña"
            className="w-full mt-2 p-2 border rounded-md bg-gray-50"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
        
        <div className="flex justify-center my-5">
          <button
            className="bg-orange tx-zinc p-2 font-semibold text-lg rounded-md"
            type="submit"
          >
            Registrarse
          </button>
        </div>
        <nav className="lg:flex lg:justify-between my-3">
          <Link
            className="block text-center my-5 tx-zinc text-xs uppercase"
            to="/"
          >
            ¿Ya tienes una cuenta? Inicia
          </Link>
          <Link
            className="block text-center my-5 tx-zinc text-xs uppercase"
            to="/pagos"
          >
            Cancela tu Factura
          </Link>
        </nav>
      </form>
      <ToastContainer />
    </div>
  );
}