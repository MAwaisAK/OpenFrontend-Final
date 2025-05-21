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
        <h1 className="text-center mt-4 mx-auto">Users</h1>

       <div className="form-group">
                      
                    </div>

          <Content/>



  {/* partial */}
</div>

      </div>
      </>
  );
};

export default MyTribes;