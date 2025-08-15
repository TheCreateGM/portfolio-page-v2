import type { ReactNode } from 'react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { ScrollToTop } from './ScrollToTop';

interface LayoutProps {
  children: ReactNode;
  currentPage?: string;
}

export const Layout = ({ children, currentPage }: LayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar currentPage={currentPage} />
      <main className="flex-1 pt-16">
        {children}
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
};