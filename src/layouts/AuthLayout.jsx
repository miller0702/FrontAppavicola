import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import '../styles/AuthLayout.css';

const AuthLayout = () => {
  const { auth, cargando } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!cargando && auth.token) {
      // Redirige al panel si el usuario está autenticado
      navigate('/panel');
    }
  }, [auth.token, cargando, navigate]);

  if (cargando) return <div>Cargando...</div>;

  return (
    <main className="fondo container flex md:flex justify-center pt-2 ">
      <div className='w-full'>
        <Outlet/>
      </div>
    </main>
  );
};

export default AuthLayout;
