'use client';

import { usePathname } from 'next/navigation';
import Nav from '../Nav';

export default function LayoutWrapper({ children }) {
  const pathname = usePathname();

  const showNav = pathname.startsWith('/profile');

  return (
    <>
      {showNav && <Nav />}
      {children}
    </>
  );
}
