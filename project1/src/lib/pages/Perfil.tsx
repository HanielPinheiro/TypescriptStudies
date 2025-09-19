import { User } from 'lucide-react';
import { LOCATION_PERFIL } from '../ts/constants';

const Perfil = () => {
  return (
    <div>
      <h2 className="ref-location">
        <User size={20} /> {LOCATION_PERFIL}
      </h2>
      <div className="page-content"></div>
    </div>
  );
};

export default Perfil;
