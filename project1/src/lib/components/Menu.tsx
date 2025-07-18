import { Link, useLocation } from 'react-router-dom';

import { Home, Flame, MessageCircle, HeartHandshake, User, LogOut } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

import { useAuth } from '../contexts/AuthContext';
import Components from './MenuElements';

const { ProfileAvatar, MenuItens } = Components;

interface MenuProps {
  isMobile: boolean;
  toggleMenu: () => void;
}

interface MenuItem {
  path: string;
  label: string;
  icon: LucideIcon;
  action?: () => void;
}

const Menu = ({ isMobile, toggleMenu }: MenuProps) => {
  const location = useLocation();
  const { logout } = useAuth();

  const menuItems: MenuItem[] = [
    { path: '/dashboard', label: 'Página Inicial', icon: Home },
    { path: '/posts', label: 'Meu Conteúdo', icon: Flame },
    { path: '/chat', label: 'Chat', icon: MessageCircle },
    { path: '/assinaturas', label: 'Minhas Assinaturas', icon: HeartHandshake },
    { path: '/perfil', label: 'Meu Perfil', icon: User },
    { path: '*', label: 'Sair', icon: LogOut, action: logout },
  ];

  const handleItemClick = (item: MenuItem) => {
    if (item.action) {
      item.action();
      if (isMobile) toggleMenu();
    } else if (isMobile) {
      toggleMenu();
    }
  };

  return (
    <nav className={isMobile ? 'mobile-menu' : 'sidebar'}>
      {!isMobile && <ProfileAvatar />}
      <ul className="menu-list">
        {menuItems.map((item) => {
          const isActive = !item.action && location.pathname.startsWith(item.path);
          return (
            <li key={item.path} className="menu-item">
              {item.action ? (
                <a className={`menu-link ${isActive ? 'text-yellow-500 font-bold' : ''}`} onClick={() => handleItemClick(item)} style={{ cursor: 'pointer' }}>
                  <MenuItens icon={item.icon} label={item.label} />
                </a>
              ) : (
                <Link to={item.path} className={`menu-link ${!item.action && location.pathname.startsWith(item.path) ? 'active' : ''}`} onClick={() => handleItemClick(item)}>
                  <MenuItens icon={item.icon} label={item.label} />
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default Menu;
