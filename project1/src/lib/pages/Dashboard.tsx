import { Home } from 'lucide-react';
import CardModelos from '../components/CardModelos';
import '../css/dashboard.css';
import { AVATAR1, AVATAR2, AVATAR3, LOGO1 } from '../ts/constants';

const Dashboard = () => {
  return (
    <div>
      <h2 className="ref-location">
        <Home size={20} /> Página Inicial
      </h2>
      <div className="page-content">
        <h1>Bem-vindo à Lybertyn - Liberte-se</h1>
        <div className="modelos">
          <CardModelos url_avatar={AVATAR1} url_bkg={LOGO1} name={'Modelo de Exemplo'} at={'@modeloexemplo1'} verified={false} />
          <CardModelos url_avatar={AVATAR2} url_bkg={AVATAR2} name={'Modelo de Exemplo'} at={'@modeloexemplo2'} verified={true} />
          <CardModelos url_avatar={AVATAR3} url_bkg={AVATAR1} name={'Modelo de Exemplo'} at={'@modeloexemplo3'} verified={false} />
        </div>
        <p>Paginacao</p>
      </div>
    </div>
  );
};

export default Dashboard;
