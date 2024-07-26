import React, { useState } from 'react';
import clienteMongoAxios from '../../config/clienteMongoAxios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { IoPersonOutline, IoCardOutline, IoCallOutline, IoPerson } from 'react-icons/io5';
import { FaKey, FaKeybase, FaKeycdn, FaPhone, FaUser } from 'react-icons/fa';
import { FaMessage } from 'react-icons/fa6';

export default function FormUsuarios() {
        const [nombre, setNombre] = useState("");
        const [apellido, setApellido] = useState("");
        const [telefono, setTelefono] = useState("");
        const [email, setEmail] = useState("");
        const [password, setPassword] = useState("");
        const [confirmPassword, setConfirmPassword] = useState("");
        const [rol, setRol] = useState(3);
    
        const handleSubmit = async (e) => {
            e.preventDefault();
    
            if (password !== confirmPassword) {
                console.log('Las contraseñas no coinciden');
                return;
            }
    
            try {
                const { data } = await clienteMongoAxios.post('/api/users/create', { 
                    name: nombre, 
                    lastname: apellido, 
                    phone: telefono, 
                    email, 
                    password, 
                    rol 
                });
    
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
    
                setNombre('');
                setApellido('');
                setTelefono('');
                setEmail('');
                setPassword('');
                setConfirmPassword('');
                setRol(3);
    
                setTimeout(() => {
                    navigate('/');
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
        <>

            <h1 className='text-title-lg font-bold'>Registro de Clientes</h1>
            <ToastContainer />
            <form onSubmit={handleSubmit}>
                <div>
                    <label className="mb-3 block text-black dark:text-white">
                        Rol
                    </label>
                    <select
                        value={rol}
                        onChange={e => setRol(Number(e.target.value))}
                        className="mb-3 w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    >
                        <option value={1}>Administrador</option>
                        <option value={2}>Galponero</option>
                        <option value={3}>Cliente</option>
                    </select>
                </div>

                <div>
                    <label className="mb-3 block text-black dark:text-white">
                        <IoPerson className="inline-block mr-2" />
                        Nombre
                    </label>
                    <input
                        type="text"
                        placeholder="Ingrese aquí el nombre completo"
                        className="mb-3 w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                        value={nombre}
                        onChange={e => setNombre(e.target.value)}
                    />
                </div>
                <div>
                    <label className="mb-3 block text-black dark:text-white">
                        <FaUser className="inline-block mr-2" />
                        Apellido
                    </label>
                    <input
                        type="text"
                        placeholder="Ingrese aquí el nombre completo"
                        className="mb-3 w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                        value={apellido}
                        onChange={e => setApellido(e.target.value)}
                    />
                </div>

                <div>
                    <label className="mb-3 block text-black dark:text-white">
                        <FaPhone className="inline-block mr-2" />
                        Teléfono
                    </label>
                    <input
                        type="text"
                        placeholder="Ingrese aquí el teléfono"
                        className="mb-3 w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                        value={telefono}
                        onChange={e => setTelefono(e.target.value)}
                    />
                </div>
                <div>
                    <label className="mb-3 block text-black dark:text-white">
                        <FaMessage className="inline-block mr-2" />
                        Correo
                    </label>
                    <input
                        type="email"
                        placeholder="Ingrese aquí el documento"
                        className="mb-3 w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                    />
                </div>
                <div>
                    <label className="mb-3 block text-black dark:text-white">
                        <FaKey className="inline-block mr-2" />
                        Contraseña
                    </label>
                    <input
                        type="password"
                        placeholder="Ingrese aquí el nombre completo"
                        className="mb-3 w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                    />
                </div>
                <div>
                    <label className="mb-3 block text-black dark:text-white">
                        <FaKey className="inline-block mr-2" />
                        Confirmar Contraseña
                    </label>
                    <input
                        type="password"
                        placeholder="Ingrese aquí el nombre completo"
                        className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
                    />
                </div>
                <button
                    className="w-full flex justify-center rounded bg-primary py-2 px-6 font-medium text-gray hover:shadow-1 mt-5"
                    type='submit'
                >
                    Guardar
                </button>
            </form>
        </>
    );
}
