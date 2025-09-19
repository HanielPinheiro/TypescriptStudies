import { Flame } from 'lucide-react';
import { LOCATION_CONTEUDO } from '../ts/constants';

const Conteudo = () => {
  return (
    <div>
      <h2 className="ref-location">
        <Flame size={20} /> {LOCATION_CONTEUDO}
      </h2>
      <div className="page-content"></div>
    </div>
  );
};

export default Conteudo;
