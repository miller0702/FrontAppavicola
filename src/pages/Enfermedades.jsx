import Breadcrumb from "../components/Breadcrumb";
import TableEnfermedades from "../components/tables/TableEnfermedades";


const Enfermedades = () => {
    return (
      <>
        <Breadcrumb pageName="Enfermedades" />
  
        <div className="flex flex-col gap-10">
          <TableEnfermedades />
        </div>
      </>
    );
  };
  
  export default Enfermedades;
