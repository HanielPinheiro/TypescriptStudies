import { HeartHandshake } from 'lucide-react';
import { LOCATION_ASSINATURAS } from '../ts/constants';

const Assinaturas = () => {
  return (
    <div>
      <h2 className="ref-location">
        <HeartHandshake size={20} /> {LOCATION_ASSINATURAS}
      </h2>
      <div className="page-content"></div>
    </div>
  );
};

export default Assinaturas;
