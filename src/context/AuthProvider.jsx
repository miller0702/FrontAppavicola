import { useState, useEffect, createContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import clienteMongoAxios from "../config/clienteMongoAxios";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({});
    const [usuario, setUsuario] = useState({});
    const [pagoState, setPagoState] = useState(1);
    const [pagoInformacion, setPagoStateInformacion] = useState(1);
    const [cargando, setCargando] = useState(true);

    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        autenticarUsuario();
    }, []);

    const fetchUserData = async (token) => {
        const tokenToSend = token.startsWith("JWT ") ? token.substring(4) : token;
        try {
            const response = await clienteMongoAxios.get('/api/users/getUserById', {
                headers: {
                    Authorization: `JWT ${tokenToSend}`
                }
            });
            return response;
        } catch (error) {
            console.error('Error fetching user data:', error.response ? error.response.data : error.message);
            throw error;
        }
    };

    const autenticarUsuario = async () => {
        const token = localStorage.getItem('token');

        if (!token) {
            setCargando(false);
            navigate('/');
            return;
        }

        try {
            const response = await fetchUserData(token);
            setAuth({ token });
            setUsuario(response.data);
            if (location.pathname === '/') { 
                navigate('/panel');
            }
        } catch (error) {
            console.error('Error during authentication:', error.response ? error.response.data : error.message);
            navigate('/');
        } finally {
            setCargando(false);
        }
    };

    const recargarDatosUsuario = async () => {
        const token = auth.token;
        if (token) {
            try {
                const response = await fetchUserData(token);
                setUsuario(response.data);
            } catch (error) {
                console.error('Error reloading user data:', error.response ? error.response.data : error.message);
            }
        }
    };

    const siguientePaso = (estado) => {
        setPagoState(estado);
    };

    const logout = () => {
        setCargando(false);
        localStorage.removeItem('token');
        navigate('/');
        window.location.reload();
    };

    return (
        <AuthContext.Provider
            value={{
                auth,
                setAuth,
                cargando,
                pagoState,
                setPagoState,
                siguientePaso,
                setPagoStateInformacion,
                pagoInformacion,
                usuario,
                setUsuario,
                logout,
                recargarDatosUsuario,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export { AuthProvider };

export default AuthContext;
