import CardOne from "../components/cards/CardOne";
import CardTwo from "../components/cards/CardTwo";
import CardThree from "../components/cards/CardThree";
import CardFour from "../components/cards/CardFour";
import ChartOne from "../components/charts/ChartOne";
import ChartTwo from "../components/charts/ChartTwo";
import ChartThree from "../components/charts/ChartThree";
import ChartFour from "../components/charts/ChartFour";

const ECommerce = () => {
  return (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
        <CardOne />
        <CardTwo />
        <CardThree />
        <CardFour />
      </div>

      <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
        <ChartFour />
        <ChartOne />
        <ChartTwo />
        <ChartThree />
      </div>
    </>
  );
};

export default ECommerce;
