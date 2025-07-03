import { useParams } from 'react-router-dom'
import { useState } from 'react'
import type { Profile, ContentPost } from '../lib/ts/types'

export default function Profile() {
  const { id } = useParams<{ id: string }>()
  const [isSubscribed, setIsSubscribed] = useState(false)

  // Mock data - in a real app, this would come from an API
  const profileData: Profile = {
    id: id || '1',
    username: 'creative_soul',
    displayName: 'Creative Soul',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    bannerImage: 'https://source.unsplash.com/random/1600x400/?art',
    bio: 'Digital artist creating magical worlds. Join me on this creative journey with exclusive content, tutorials, and behind-the-scenes looks at my process.',
    subscriberCount: 12500,
    subscriptionPrice: 9.99,
    isCreator: true,
    postCount: 143,
    mediaCount: 287
  }

  const posts: ContentPost[] = [
    {
      id: '1',
      creatorId: id || '1',
      creatorUsername: profileData.username,
      creatorAvatar: profileData.avatar,
      text: 'Just finished this new piece! What do you think? Full process video available for subscribers.',
      mediaUrl: 'https://source.unsplash.com/random/800x600/?art',
      mediaType: 'image',
      likeCount: 842,
      commentCount: 127,
      createdAt: '2023-05-15T14:32:00Z',
      isPaid: false
    },
    {
      id: '2',
      creatorId: id || '1',
      creatorUsername: profileData.username,
      creatorAvatar: profileData.avatar,
      text: 'Monthly Q&A session starts in 1 hour! Subscribers can join the live stream and ask me anything about digital art.',
      mediaType: undefined,
      likeCount: 312,
      commentCount: 56,
      createdAt: '2023-05-10T09:15:00Z',
      isPaid: true,
      price: 0 // Included in subscription
    }
  ]

  const handleSubscribe = () => {
    // In a real app, this would call your payment API
    setIsSubscribed(true)
    console.log(`Subscribed to ${profileData.username}`)
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Banner */}
      <div className="h-64 w-full bg-gradient-to-r from-purple-500 to-pink-500">
        {profileData.bannerImage && (
          <img
            src={profileData.bannerImage}
            alt="Profile banner"
            className="w-full h-full object-cover"
          />
        )}
      </div>

      {/* Profile Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="px-6 py-8 sm:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between">
              <div className="flex items-end">
                <div className="relative -mt-24">
                  <img
                    src={profileData.avatar}
                    alt={`${profileData.username}'s avatar`}
                    className="h-32 w-32 rounded-full border-4 border-white object-cover"
                  />
                  {profileData.isCreator && (
                    <span className="absolute bottom-0 right-0 bg-indigo-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                      CREATOR
                    </span>
                  )}
                </div>
                <div className="ml-6 mt-4 sm:mt-0">
                  <h1 className="text-2xl font-bold text-gray-900">
                    {profileData.displayName}
                  </h1>
                  <p className="text-gray-600">@{profileData.username}</p>
                </div>
              </div>
              <div className="mt-6 sm:mt-0">
                <button
                  onClick={handleSubscribe}
                  disabled={isSubscribed}
                  className={`px-6 py-3 rounded-full font-medium ${
                    isSubscribed
                      ? 'bg-gray-300 text-gray-700 cursor-not-allowed'
                      : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                  }`}
                >
                  {isSubscribed
                    ? 'Subscribed'
                    : `Subscribe for $${profileData.subscriptionPrice}/month`}
                </button>
              </div>
            </div>

            {/* Stats */}
            <div className="mt-8 flex flex-wrap gap-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">
                  {profileData.subscriberCount.toLocaleString()}
                </p>
                <p className="text-sm text-gray-500">Subscribers</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">
                  {profileData.postCount}
                </p>
                <p className="text-sm text-gray-500">Posts</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">
                  {profileData.mediaCount}
                </p>
                <p className="text-sm text-gray-500">Media</p>
              </div>
            </div>

            {/* Bio */}
            <div className="mt-6">
              <p className="text-gray-700 whitespace-pre-line">{profileData.bio}</p>
            </div>
          </div>
        </div>

        {/* Content Feed */}
        <div className="mt-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Latest Posts</h2>
          <div className="space-y-6">
            {posts.map((post) => (
              <div key={post.id} className="bg-white rounded-lg shadow overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center space-x-3">
                    <img
                      src={post.creatorAvatar}
                      alt={`${post.creatorUsername}'s avatar`}
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <p className="font-medium text-gray-900">
                        {post.creatorUsername}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(post.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  {post.text && (
                    <p className="mt-4 text-gray-700 whitespace-pre-line">
                      {post.text}
                    </p>
                  )}
                  {post.mediaUrl && post.mediaType === 'image' && (
                    <div className="mt-4">
                      <img
                        src={post.mediaUrl}
                        alt="Post content"
                        className="rounded-lg max-h-96 object-contain mx-auto"
                      />
                    </div>
                  )}
                  {post.isPaid && !isSubscribed && (
                    <div className="mt-4 p-4 bg-gray-100 rounded-lg text-center">
                      <p className="font-medium text-gray-900">
                        Subscribe to view this content
                      </p>
                    </div>
                  )}
                  <div className="mt-6 flex justify-between items-center pt-4 border-t border-gray-200">
                    <button className="flex items-center space-x-1 text-gray-500 hover:text-indigo-600">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                        />
                      </svg>
                      <span>{post.likeCount}</span>
                    </button>
                    <button className="flex items-center space-x-1 text-gray-500 hover:text-indigo-600">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                        />
                      </svg>
                      <span>{post.commentCount}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}