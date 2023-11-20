import React, { useState } from "react";
import "../styles/Auth.css";
import logo from "../assets/images/LogoPlataforma.png";
import { Link, useNavigate } from "react-router-dom";
import clienteMongoAxios from "../config/clienteMongoAxios";
import useAuth from "../hooks/useAuth";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Auth() {

  const {setAuth, pagoState, setPagoState} = useAuth()

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault();

    if([email, password].includes("")){
      toast.error('Los campos no pueden estar vacios', {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      return
    }

    try {
      const data = await clienteMongoAxios.post("/api/users/login", { email, password })
      localStorage.setItem('token', data.data.data.session_token)
      setAuth({token: data.data.data.session_token})

      toast.success('Autenticado correctamente', {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });

      navigate('/panel')
    } catch (error) {
      toast.error('Error de autenticacion', {
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
    <div className="flex w-full flex-col items-center">
      <img className="logo" src={logo} />
      <form
        className="bg-stone shadow-lg rounded-md pt-5 px-10 w-1/4"
        onSubmit={handleSubmit}
      >
        <div className="my-5">
          <label
            htmlFor="email"
            className="uppercase tx-zinc block text-xl font-bold"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            placeholder="Email de Registro"
            className="w-full mt-2 p-2 border rounded-md bg-gray-50"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="my-5">
          <label
            htmlFor="password"
            className="uppercase tx-zinc block text-xl font-bold"
          >
            Contraseña
          </label>
          <input
            id="password"
            type="password"
            placeholder="Contraseña"
            className="w-full mt-2 p-2 border rounded-md bg-gray-50"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="flex justify-center my-5">
          <button
            className="bg-orange tx-zinc p-2 text-xl font-semibold rounded-md"
            type="submit"
          >
            Iniciar Sesión
          </button>
        </div>

        <nav className="my-5">
          <Link
            className="block text-center my-5 tx-zinc text-xs uppercase"
            to="/registrar"
          >
            ¿No tienes una cuenta? Registrate
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
