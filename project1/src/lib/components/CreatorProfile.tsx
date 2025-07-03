import type { Creator } from '../ts/types'

type CreatorProfileProps = {
  creator: Creator;
  isSubscribed: boolean;
  onSubscribe: () => void;
};

export const CreatorProfile = ({ creator, isSubscribed, onSubscribe }: CreatorProfileProps) => {
  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg">
      <div className="relative">
        <img
          src={creator.bannerImage || '/default-banner.jpg'}
          alt={`${creator.username}'s banner`}
          className="w-full h-48 object-cover"
        />
        <div className="absolute -bottom-16 left-6">
          <img
            src={creator.avatar || '/default-avatar.jpg'}
            alt={`${creator.username}'s avatar`}
            className="w-32 h-32 rounded-full border-4 border-gray-800 object-cover"
          />
        </div>
      </div>
      <div className="pt-20 px-6 pb-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-white">{creator.username}</h1>
            <p className="text-gray-400">{creator.displayName}</p>
          </div>
          <button
            onClick={onSubscribe}
            disabled={isSubscribed}
            className={`px-4 py-2 rounded-full font-medium ${
              isSubscribed
                ? 'bg-gray-600 text-gray-300 cursor-not-allowed'
                : 'bg-indigo-600 text-white hover:bg-indigo-700'
            }`}
          >
            {isSubscribed ? 'Subscribed' : `Subscribe $${creator.subscriptionPrice}/month`}
          </button>
        </div>
        <p className="mt-4 text-gray-300">{creator.bio}</p>
        <div className="mt-6 flex space-x-4">
          <div className="text-center">
            <p className="text-white font-bold">{creator.subscriberCount}</p>
            <p className="text-gray-400 text-sm">Subscribers</p>
          </div>
          <div className="text-center">
            <p className="text-white font-bold">{creator.postCount}</p>
            <p className="text-gray-400 text-sm">Posts</p>
          </div>
          <div className="text-center">
            <p className="text-white font-bold">{creator.mediaCount}</p>
            <p className="text-gray-400 text-sm">Media</p>
          </div>
        </div>
      </div>
    </div>
  );
};