import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import '../styles/AuthLayout.css';
import Loader from '../components/Loader';

const AuthLayout = () => {
  const { auth, cargando } = useAuth();
  const navigate = useNavigate();
  const [loadingTimeElapsed, setLoadingTimeElapsed] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoadingTimeElapsed(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!cargando && auth.token && loadingTimeElapsed) {
      navigate('/panel');
    }
  }, [auth.token, cargando, navigate, loadingTimeElapsed]);

  if (cargando || !loadingTimeElapsed) return <Loader />;

  return (
    <main className="fondo container flex md:flex justify-center pt-2">
      <div className='w-full'>
        <Outlet/>
      </div>
    </main>
  );
};

export default AuthLayout;
