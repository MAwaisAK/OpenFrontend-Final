import '../../styles/vendor/bootstrap/css/bootstrap.min.css';
import '../../styles/vendor/bootstrap-icons/bootstrap-icons.css';
import '../../styles/vendor/aos/aos.css';
import '../../styles/vendor/glightbox/css/glightbox.min.css';
import "../../styles/main.css";
import Scripts from "../Scripts";
import AOSinit from "../AOSDelay";

export default function ExternalResources() {
  return (
    <>
    <Scripts/>
    <AOSinit/>
    </>
  );
}
