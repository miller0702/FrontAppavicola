import React, { useEffect, useState } from "react";
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
import Loader from "../components/Loader";

const ECommerce = () => {
    const { usuario, cargando } = useAuth();
    const navigate = useNavigate();
    const [loadingTimeElapsed, setLoadingTimeElapsed] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoadingTimeElapsed(true);
        }, 3000);

        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (!usuario && !cargando && loadingTimeElapsed) {
            navigate('/');
        }
    }, [usuario, cargando, navigate, loadingTimeElapsed]);

    return (
        <>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
                        <ChartFive />
                    </>)}
            </div>
        </>
    );
};

export default ECommerce;
