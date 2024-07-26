import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from '../hooks/useAuth';
import CardOne from "../components/cards/CardOne";
import CardSix from "../components/cards/CardSix";
import CardThree from "../components/cards/CardThree";
import CardSeven from "../components/cards/CardSeven";
import ChartOne from "../components/charts/ChartOne";
import ChartTwo from "../components/charts/ChartTwo";
import ChartThree from "../components/charts/ChartThree";
import ChartFour from "../components/charts/ChartFour";
import CardNine from '../components/cards/CardNine';
import CardTen from '../components/cards/CardTen';
import CardEleven from '../components/cards/CardEleven';
import ChartFive from "../components/charts/ChartFive";

const ECommerce = () => {
    const { usuario, cargando } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!usuario && !cargando) {
            // Redirige si no hay usuario o está cargando
            navigate('/');
        }
    }, [usuario, cargando, navigate]);

    if (cargando) {
        return <div>Cargando...</div>;
    }

    return (
        <>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
                {usuario && usuario.rol === 1 && (
                    <>
                        <CardOne />
                        <CardThree />
                        <CardSeven />
                    </>
                )}
                <CardSix />
                {usuario && usuario.rol === 3 && (
                    <>
                        <CardNine />
                        <CardTen />
                        <CardEleven />
                    </>
                )}
            </div>

            <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
                {usuario && usuario.rol === 1 && (
                    <>
                        <ChartFour />
                        <ChartOne />
                        <ChartTwo />
                        <ChartThree />
                    </>
                )}
                {usuario && usuario.rol === 3 && (
                    <>
                    <ChartFive/>
                    </>)}
            </div>
        </>
    );
};

export default ECommerce;
