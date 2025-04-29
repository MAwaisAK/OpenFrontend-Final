"use client";
import Link from 'next/link';
import Image from 'next/image';
import MainResources from "../ExternalResources";
import { useAuth } from "@/lib/AuthContext";

const Header = () => {
  const { loggedIn } = useAuth();

  return (
    <>
      <MainResources />
      <header id="header" className="header d-flex align-items-center sticky-top">
        <div className="container-fluid container-xl position-relative d-flex align-items-center">
          <Link href="/" className="logo d-flex align-items-center me-auto">
            <img src="/assets/img/logo.png" alt="" />
          </Link>

          <nav id="navmenu" className="navmenu">
            <ul>
              <li>
                <Link href="/" className="active">
                  Home
                </Link>
              </li>
              <li>
                <Link href={loggedIn ? "/profile" : "/login"}>
                  {loggedIn ? "Profile" : "Login"}
                </Link>
              </li>
              <li>
                <Link href="#price">Pricing</Link>
              </li>
            </ul>
            <i className="mobile-nav-toggle d-xl-none bi bi-list"></i>
          </nav>

          <Link href={loggedIn ? "/profile" : "/login"} className="btn-getstarted">
            {loggedIn ? "Get Started" : "Get Started"}
          </Link>
        </div>
      </header>
    </>
  );
};

export default Header;
