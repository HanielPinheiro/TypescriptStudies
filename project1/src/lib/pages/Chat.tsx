import { MessageCircle } from 'lucide-react';
import { LOCATION_CHAT } from '../ts/constants';

const Chat = () => {
  return (
    <div>
      <h2 className="ref-location">
        <MessageCircle size={20} /> {LOCATION_CHAT}
      </h2>
      <div className="page-content"></div>
    </div>
  );
};

export default Chat;
