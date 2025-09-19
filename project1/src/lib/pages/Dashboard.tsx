import { Home } from 'lucide-react';

import CardModelos from '../components/CardModelos';
import { SearchComponent, type SearchResult } from '../components/SearchComponent';

import { AVATAR1, AVATAR2, AVATAR3, LOCATION_DASHBOARD, LOGO1 } from '../ts/constants';

import '../css/dashboard.css';

const mockSearch = async (query: string) => {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 500));

  const mockData = [
    { id: '1', title: 'React Tutorial', description: 'Learn React fundamentals' },
    { id: '2', title: 'TypeScript Guide', description: 'TypeScript for React developers' },
    { id: '3', title: 'Advanced React Patterns', description: 'State management and hooks' },
  ];

  return mockData.filter((item) => item.title.toLowerCase().includes(query.toLowerCase()) || item.description.toLowerCase().includes(query.toLowerCase()));
};
const handleResultSelect = (result: SearchResult) => {
  console.log('Selected result:', result);
  // Navigate to result page or update state
};
const Dashboard = () => {
  return (
    <div>
      <h2 className="ref-location">
        <Home size={20} /> {LOCATION_DASHBOARD}
      </h2>
      <div className="page-content">
        <div className="flex items-center justify-between w-full">
          <h1>Lybertyn - Liberte-se</h1>
          <div className="mx-auto my-auto">
            <SearchComponent placeholder="Search documentation..." onSearch={mockSearch} onResultSelect={handleResultSelect} />
          </div>
        </div>
        <div className="modelos">
          <CardModelos url_avatar={AVATAR1} url_bkg={LOGO1} name={'Modelo de Exemplo'} at={'@modeloexemplo1'} verified={false} />
          <CardModelos url_avatar={AVATAR2} url_bkg={AVATAR2} name={'Modelo de Exemplo'} at={'@modeloexemplo2'} verified={true} />
          <CardModelos url_avatar={AVATAR3} url_bkg={AVATAR1} name={'Modelo de Exemplo'} at={'@modeloexemplo3'} verified={false} />
        </div>
        <p>Falta Paginacao</p>
      </div>
    </div>
  );
};

export default Dashboard;
