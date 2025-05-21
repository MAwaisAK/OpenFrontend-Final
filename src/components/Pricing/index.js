import Sidebar from "../AdminSideBar";
import Navbar from "../Nav";
import Content from "./content";
const MyTribes = () => {
  return (
    <>
     {/*<Navbar />*/}
      <div className="container-fluid page-body-wrapper">
        <Sidebar/>
        <div className="main-panel">

          <Content/>
</div>

      </div>
      </>
  );
};

export default MyTribes;