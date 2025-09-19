import { Link, useLocation } from 'react-router-dom';

import { Home, Flame, MessageCircle, HeartHandshake, User, LogOut } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

import { useAuth } from '../contexts/AuthContext';
import Components from './MenuElements';
import {
  LOCATION_ASSINATURAS,
  LOCATION_CHAT,
  LOCATION_CONTEUDO,
  LOCATION_DASHBOARD,
  LOCATION_PERFIL,
  LOCATION_SAIR,
  PAGE_ASSINATURAS,
  PAGE_CHAT,
  PAGE_CONTEUDO,
  PAGE_DASHBOARD,
  PAGE_PERFIL,
  PAGE_SAIR,
} from '../ts/constants';

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
    { path: PAGE_DASHBOARD, label: LOCATION_DASHBOARD, icon: Home },
    { path: PAGE_CONTEUDO, label: LOCATION_CONTEUDO, icon: Flame },
    { path: PAGE_CHAT, label: LOCATION_CHAT, icon: MessageCircle },
    { path: PAGE_ASSINATURAS, label: LOCATION_ASSINATURAS, icon: HeartHandshake },
    { path: PAGE_PERFIL, label: LOCATION_PERFIL, icon: User },
    { path: PAGE_SAIR, label: LOCATION_SAIR, icon: LogOut, action: logout },
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
