// import CardOne from '../../components/CardOne.tsx';
// import CardThree from '../../components/CardThree.tsx';
// import CardTwo from '../../components/CardTwo.tsx';
// import ChartOne from '../../components/ChartOne.jsx';
// import ChartThree from '../../components/ChartThree.jsx';
// import ChartTwo from '../../components/ChartTwo.jsx';
// import ChatCard from '../../components/ChatCard.tsx';
// import MapOne from '../../components/MapOne.tsx';
// import TableOne from '../../components/TableOne.tsx';

import CardFour from "../components/CardFour";
import CardOne from "../components/CardOne";
import CardThree from "../components/CardThree";
import CardTwo from "../components/CardTwo";
import ChartOne from "../components/ChartOne";
import ChartThree from "../components/ChartThree";
import ChartTwo from "../components/ChartTwo";
import TableOne from "../components/TableOne";

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
        <ChartOne />
        <ChartTwo />
        <ChartThree />
        
      </div>
    </>
  );
};

export default ECommerce;
