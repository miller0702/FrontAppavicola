import React, { useState } from "react";
import logo from "../assets/images/LogoPlataforma.png";
import fondo from "../assets/images/fondo_login.jpg";
import { Link, useNavigate } from "react-router-dom";
import clienteMongoAxios from "../config/clienteMongoAxios";
import useAuth from "../hooks/useAuth";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaFacebookF, FaInstagram, FaTwitter } from "react-icons/fa";

export default function Auth() {

  const { setAuth, pagoState, setPagoState } = useAuth()

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault();

    if ([email, password].includes("")) {
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
      setAuth({ token: data.data.data.session_token })

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
    <div className="container-wrapper">
      <div className="auth-container bg-white dark:bg-boxdark">
        <div className="auth-form-container">
        <img src={logo} alt="Logo Auth" className="logo"/>
          <h1 className="text-title-lg font-bold mb-9">Inicio de Sesión</h1>
          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <input
                id="email"
                type="email"
                placeholder=" "
                className="form-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <label htmlFor="email" className="form-label">Email</label>
            </div>
            <div className="form-group">
              <input
                id="password"
                type="password"
                placeholder=" "
                className="form-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <label htmlFor="password" className="form-label">Contraseña</label>
            </div>

            <div className="form-group">
              <button className="submit-button" type="submit">Iniciar Sesión</button>
            </div>
            <div className="form-group">
            </div>
          </form>
          <ToastContainer />
        </div>
        <div className="auth-image-container">
          <img src={fondo} alt="Auth Background" className="auth-image" />
        </div>
      </div>
    </div>
  );
}
