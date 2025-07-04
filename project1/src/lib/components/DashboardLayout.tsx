import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Menu from './Menu';
import ProfileAvatar from './MenuElements';

const DashboardLayout = () => {
  const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth < 800);
  const [menuOpen, setMenuOpen] = useState<boolean>(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 800);
      if (window.innerWidth >= 800) setMenuOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="dashboard">
      {isMobile && (
        <header className="mobile-header">
          <button onClick={() => setMenuOpen(!menuOpen)}>☰</button>
          <ProfileAvatar />
        </header>
      )}
      <Menu isMobile={isMobile && menuOpen} toggleMenu={() => setMenuOpen(false)} />
      <main className={`content ${isMobile ? 'mobile-content' : ''}`}>
        <Outlet /> {/* As páginas serão renderizadas aqui */}
      </main>
    </div>
  );
};

export default DashboardLayout;
