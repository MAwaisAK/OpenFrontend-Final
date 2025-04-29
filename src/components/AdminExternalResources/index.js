import '../../styles/admin/vendors/feather/feather.css';
import '../../styles/admin/vendors/ti-icons/css/themify-icons.css';
import '../../styles/vendor/bootstrap/css/bootstrap.min.css';
import '../../styles/admin/vendors/css/vendor.bundle.base.css';
import '../../styles/admin/vendors/font-awesome/css/font-awesome.min.css';
import '../../styles/admin/vendors/mdi/css/materialdesignicons.min.css';
import 'datatables.net-bs4/css/dataTables.bootstrap4.min.css';
import 'datatables.net-bs5/css/dataTables.bootstrap5.min.css';
import '../../styles/admin/vendors/ti-icons/css/themify-icons.css';
import '../../styles/admin/js/select.dataTables.min.css';
import '../../styles/admin/css/style.css';
import '../../styles/admin/images/favicon.png';
import Scripts from "../AdminScripts";

export default function ExternalResources() {
  return (
    <>
     <link 
          rel="stylesheet" 
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
        />
    <Scripts/>
    </>
  );
}
