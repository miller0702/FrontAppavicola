import React from 'react';
import Lottie from 'lottie-react';
import LoaderAnimation from '../assets/images/loader.json';
import Logo from '../assets/images/LogoPlataforma.png';

const Loader = () => {
  return (
    <div className="relative flex flex-col h-screen items-center justify-center bg-white">
      <div className="absolute top-4">
        <img src={Logo} alt="Logo del loader" className="h-30" />
      </div>
      <Lottie
        animationData={LoaderAnimation}
        loop={true}
        style={{ height: '70vw', width: '70vw', maxWidth: '700px', maxHeight: '700px' }}
      />
      <h1
        className='absolute font-bold text-gray-700 top-1/3 left-1/2 transform -translate-x-1/2'
        style={{ fontSize: '2vw' }}
      >
        Cargando...
      </h1>
    </div>
  );
};

export default Loader;
