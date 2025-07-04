import { useAuth } from '../contexts/AuthContext';
import type { LucideIcon } from 'lucide-react';

const ProfileAvatar = () => {
  const { user } = useAuth();
  return (
    <div className="profile-avatar">
      <img src="/assets/login/Avatar3.png" alt="Avatar" />
      <h2>{user?.username}</h2>
    </div>
  );
};

interface MenuItemProps {
  icon: LucideIcon;
  label: string;
}

const MenuItens = ({ icon: Icon, label }: MenuItemProps) => {
  return (
    <>
      <span className="icon">
        <Icon size={20} />
      </span>
      <span className="label">{label}</span>
    </>
  );
};

const Components = {
  ProfileAvatar,
  MenuItens,
};

export default Components;
