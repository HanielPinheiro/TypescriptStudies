type SubscriptionTierProps = {
  name: string;
  price: number;
  description: string;
  features: string[];
  isPopular?: boolean;
  onSelect: () => void;
};

export const SubscriptionTier = ({
  name,
  price,
  description,
  features,
  isPopular = false,
  onSelect,
}: SubscriptionTierProps) => {
  return (
    <div
      className={`relative p-6 rounded-lg border ${
        isPopular
          ? 'border-indigo-500 bg-gray-800 shadow-lg shadow-indigo-500/20'
          : 'border-gray-700 bg-gray-800'
      }`}
    >
      {isPopular && (
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full">
          POPULAR
        </div>
      )}
      <h3 className="text-xl font-bold text-white">{name}</h3>
      <p className="mt-2 text-gray-400">{description}</p>
      <div className="mt-6">
        <span className="text-4xl font-bold text-white">${price}</span>
        <span className="text-gray-400">/month</span>
      </div>
      <ul className="mt-6 space-y-3">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center">
            <svg
              className="w-5 h-5 text-green-400 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span className="text-gray-300">{feature}</span>
          </li>
        ))}
      </ul>
      <button
        onClick={onSelect}
        className={`mt-8 w-full py-3 px-4 rounded-lg font-medium ${
          isPopular
            ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
            : 'bg-gray-700 hover:bg-gray-600 text-white'
        }`}
      >
        Subscribe
      </button>
    </div>
  );
};