import { Creator } from '../ts/types'

type ExploreCreatorsProps = {
  creators: Creator[];
  onSubscribe: (creatorId: string) => void;
};

export const ExploreCreators = ({ creators, onSubscribe }: ExploreCreatorsProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {creators.map((creator) => (
        <div key={creator.id} className="bg-gray-800 rounded-lg overflow-hidden shadow-lg">
          <div className="relative">
            <img
              src={creator.bannerImage || '/default-banner.jpg'}
              alt={`${creator.username}'s banner`}
              className="w-full h-32 object-cover"
            />
            <div className="absolute -bottom-8 left-4">
              <img
                src={creator.avatar || '/default-avatar.jpg'}
                alt={`${creator.username}'s avatar`}
                className="w-16 h-16 rounded-full border-4 border-gray-800 object-cover"
              />
            </div>
          </div>
          <div className="pt-10 px-4 pb-4">
            <h3 className="text-lg font-bold text-white">{creator.username}</h3>
            <p className="text-sm text-gray-400 truncate">{creator.bio}</p>
            <div className="mt-4 flex justify-between items-center">
              <span className="text-sm text-gray-300">
                ${creator.subscriptionPrice}/month
              </span>
              <button
                onClick={() => onSubscribe(creator.id)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm px-3 py-1 rounded-full"
              >
                Subscribe
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};