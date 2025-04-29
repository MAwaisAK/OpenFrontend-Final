import Link from 'next/link';
import Image from 'next/image';
import MainResources from "../ExternalResources";


const Header = () => {
  return (
    <>
    <MainResources/>
    <header id="header" className="header d-flex align-items-center sticky-top">
      <div className="container-fluid container-xl position-relative d-flex align-items-center">
        
        <Link href="/" className="logo d-flex align-items-center me-auto">
          <img src="/assets/img/headlogo.png" alt="" />

        </Link>

        <nav id="navmenu" className="navmenu">
          <ul>
            <li>
              <Link href="/" className="active">
                Home
              </Link>
            </li>
            <li>
              <Link href="/about">Login</Link>
            </li>
            <li>
              <Link href="/courses">Pricing</Link>
            </li>
          </ul>
          <i className="mobile-nav-toggle d-xl-none bi bi-list"></i>
        </nav>

        <Link href="/courses" className="btn-getstarted">
          Get Started
        </Link>

      </div>
    </header>
    </>
  );
};

export default Header;
