import Header from '../Header';
import Footer from '../Footer'; // If you have a footer component

const Layout = ({ children }) => {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer /> {/* Optional */}
    </>
  );
};

export default Layout;