import { Link } from 'react-router-dom'
import type { Profile } from '../lib/ts/types'

export default function Home() {
  // Mock data - in a real app, this would come from an API
  const featuredCreators: Profile[] = [
    {
      id: '1',
      username: 'creative_soul',
      displayName: 'Creative Soul',
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
      bio: 'Digital artist creating magical worlds',
      subscriberCount: 12500,
      subscriptionPrice: 9.99,
      isCreator: true
    },
    {
      id: '2',
      username: 'fitness_guru',
      displayName: 'Fitness Guru',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      bio: 'Helping you transform your body and mind',
      subscriberCount: 8700,
      subscriptionPrice: 14.99,
      isCreator: true
    },
    {
      id: '3',
      username: 'music_maestro',
      displayName: 'Music Maestro',
      avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
      bio: 'Composing melodies that touch your soul',
      subscriberCount: 21500,
      subscriptionPrice: 7.99,
      isCreator: true
    }
  ]

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
            Connect with your favorite creators
          </h1>
          <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500">
            Support exclusive content directly from the artists you love
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link
              to="/auth?mode=register"
              className="px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10"
            >
              Join Now
            </Link>
            <Link
              to="/explore"
              className="px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 md:py-4 md:text-lg md:px-10"
            >
              Explore Creators
            </Link>
          </div>
        </div>

        {/* Featured Creators */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Featured Creators</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredCreators.map((creator) => (
              <div key={creator.id} className="bg-white rounded-lg shadow overflow-hidden">
                <div className="h-48 bg-gradient-to-r from-purple-500 to-pink-500"></div>
                <div className="px-6 py-4 relative">
                  <div className="absolute -top-12 left-6">
                    <img
                      src={creator.avatar}
                      alt={`${creator.username}'s avatar`}
                      className="h-24 w-24 rounded-full border-4 border-white object-cover"
                    />
                  </div>
                  <div className="pt-14">
                    <h3 className="font-bold text-xl mb-1">{creator.displayName}</h3>
                    <p className="text-gray-600 text-sm mb-2">@{creator.username}</p>
                    <p className="text-gray-700 mb-4 line-clamp-2">{creator.bio}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-900">
                        ${creator.subscriptionPrice}/month
                      </span>
                      <Link
                        to={`/profile/${creator.id}`}
                        className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                      >
                        View Profile →
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-indigo-700 rounded-lg shadow-xl overflow-hidden">
          <div className="px-6 py-12 sm:px-12 sm:py-16 lg:py-20 lg:px-16">
            <div className="lg:flex lg:items-center lg:justify-between">
              <div className="lg:w-0 lg:flex-1">
                <h2 className="text-3xl font-extrabold text-white">
                  Ready to get started?
                </h2>
                <p className="mt-4 max-w-3xl text-lg text-indigo-200">
                  Join thousands of creators and fans building meaningful connections
                </p>
              </div>
              <div className="mt-8 lg:mt-0 lg:ml-8">
                <Link
                  to="/auth?mode=register"
                  className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50"
                >
                  Sign up for free
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}