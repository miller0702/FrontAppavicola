import { useState, useEffect } from "react";
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../util/firebaseConfig';
import clienteMongoAxios from '../config/clienteMongoAxios';
import useAuth from '../hooks/useAuth';
import { toast } from 'react-toastify';
import Breadcrumb from "../components/Breadcrumb";
import { FaUpload } from "react-icons/fa";

const Settings = () => {
  const { auth } = useAuth();
  const [usuario, setUsuario] = useState(null);

  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [telefono, setTelefono] = useState("");
  const [correo, setCorreo] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    getUsuario();
  }, []);

  useEffect(() => {
    if (usuario) {
      setNombre(usuario.name || "");
      setApellido(usuario.lastname || "");
      setTelefono(usuario.phone || "");
      setCorreo(usuario.email || "");
    }
  }, [usuario]);

  const getUsuario = async () => {
    try {
      const { data } = await clienteMongoAxios.get('/api/users/getUserById', {
        headers: {
          'Authorization': `${auth.token}`
        }
      });
      setUsuario(data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImage(file);
    }
  };

  const actualizarDatos = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('id', usuario._id);
    formData.append('name', nombre);
    formData.append('lastname', apellido);
    formData.append('email', correo);
    formData.append('phone', telefono);

    try {
      if (selectedImage) {
        const imageRef = ref(storage, `images/${selectedImage.name}`);
        await uploadBytes(imageRef, selectedImage);
        const imageUrl = await getDownloadURL(imageRef);
        formData.append('image', imageUrl);
      }

      await clienteMongoAxios.put('/api/users/updateUser', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `${auth.token}`
        },
      });

      toast.success('Datos actualizados correctamente');
    } catch (error) {
      toast.error('Error al actualizar los datos');
      console.log(error);
    }
  };

  return (
    <>
      <div className="mx-auto max-w-270">
        <Breadcrumb pageName="Configuración" />
        <div className="grid grid-cols-5 gap-8">
          <div className="col-span-5 xl:col-span-3">
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="border-b border-stroke py-4 px-7 dark:border-strokedark">
                <h3 className="font-medium text-black dark:text-white">Información Personal</h3>
              </div>
              <div className="p-7">
                <form onSubmit={actualizarDatos}>
                  <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                    <div className="w-full sm:w-1/2">
                      <label className="mb-3 block text-sm font-medium text-black dark:text-white" htmlFor="fullName">Nombres</label>
                      <div className="relative">
                        <input
                          className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                          type="text"
                          name="fullName"
                          id="fullName"
                          value={nombre}
                          onChange={e => setNombre(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="w-full sm:w-1/2">
                      <label className="mb-3 block text-sm font-medium text-black dark:text-white" htmlFor="lastname">Apellidos</label>
                      <div className="relative">
                        <input
                          className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                          type="text"
                          name="lastname"
                          id="lastname"
                          value={apellido}
                          onChange={e => setApellido(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="w-full sm:w-1/2">
                      <label className="mb-3 block text-sm font-medium text-black dark:text-white" htmlFor="phoneNumber">Telefono</label>
                      <input
                        className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                        type="text"
                        name="phoneNumber"
                        id="phoneNumber"
                        value={telefono}
                        onChange={e => setTelefono(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-4.5">
                    <button className="flex justify-center rounded bg-primary py-2 px-6 font-medium text-gray hover:shadow-1" type='submit'>
                      Actualizar
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div className="col-span-5 xl:col-span-2">
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="border-b border-stroke py-4 px-7 dark:border-strokedark">
                <h3 className="font-medium text-black dark:text-white">Tu foto</h3>
              </div>
              <div className="p-7">
                <form onSubmit={actualizarDatos}>
                  <div className="mb-4 flex items-center gap-3">
                    <div className="h-14 w-14 rounded-full overflow-hidden border border-dashed border-primary">
                      <img src={usuario && usuario.image ? usuario.image : '../assets/images/Logo.png'} alt="User" className="object-cover h-full w-full" />
                    </div>
                    <div>
                      <span className="mb-1.5 text-black dark:text-white">Edita tu foto</span>
                    </div>
                  </div>
                  <div className="mb-4 flex items-center gap-3">
                    <div
                      id="FileUpload"
                      className="relative mb-5.5 block w-full cursor-pointer appearance-none rounded border-2 border-dashed border-primary bg-gray py-4 px-4 dark:bg-meta-4 sm:py-7.5"
                    >
                      <input
                        type="file"
                        accept="image/*"
                        className="absolute inset-0 z-50 m-0 h-full w-full cursor-pointer p-0 opacity-0 outline-none"
                        onChange={handleImageChange}
                      />
                      <div className="flex flex-col items-center justify-center space-y-3">
                        <span className="flex h-10 w-10 items-center justify-center rounded-full border border-stroke bg-white dark:border-strokedark dark:bg-boxdark">
                          <FaUpload />
                        </span>
                        <span className="text-center text-xs text-gray dark:text-white">
                          Selecciona un archivo para subir
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end gap-4.5">
                    <button className="flex justify-center rounded bg-primary py-2 px-6 font-medium text-gray hover:shadow-1" type='submit'>
                      Actualizar foto
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Settings;
