import type { ContentPost } from '../ts/types'

type ContentFeedProps = {
  posts: ContentPost[];
  isCreator: boolean;
};

export const ContentFeed = ({ posts, isCreator }: ContentFeedProps) => {
  return (
    <div className="space-y-6">
      {isCreator && (
        <div className="bg-gray-800 p-4 rounded-lg shadow">
          <textarea
            placeholder="Share something with your subscribers..."
            className="w-full bg-gray-700 text-white rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            rows={3}
          />
          <div className="mt-2 flex justify-between items-center">
            <div className="flex space-x-2">
              <button className="p-2 text-gray-400 hover:text-white">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </button>
              <button className="p-2 text-gray-400 hover:text-white">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </button>
            </div>
            <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
              Post
            </button>
          </div>
        </div>
      )}
      {posts.map((post) => (
        <div key={post.id} className="bg-gray-800 rounded-lg shadow overflow-hidden">
          <div className="p-4 flex items-center space-x-3">
            <img
              src={post.creatorAvatar}
              alt={`${post.creatorUsername}'s avatar`}
              className="w-10 h-10 rounded-full"
            />
            <div>
              <p className="font-medium text-white">{post.creatorUsername}</p>
              <p className="text-xs text-gray-400">
                {new Date(post.createdAt).toLocaleString()}
              </p>
            </div>
          </div>
          {post.text && <p className="px-4 pb-4 text-gray-300">{post.text}</p>}
          {post.mediaUrl && (
            <div className="bg-black flex justify-center">
              {post.mediaType === 'image' ? (
                <img
                  src={post.mediaUrl}
                  alt="Post media"
                  className="max-h-96 object-contain"
                />
              ) : (
                <video controls className="max-h-96">
                  <source src={post.mediaUrl} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              )}
            </div>
          )}
          <div className="p-4 flex justify-between items-center border-t border-gray-700">
            <button className="flex items-center space-x-1 text-gray-400 hover:text-white">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <span>{post.likeCount}</span>
            </button>
            <button className="flex items-center space-x-1 text-gray-400 hover:text-white">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <span>{post.commentCount}</span>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};