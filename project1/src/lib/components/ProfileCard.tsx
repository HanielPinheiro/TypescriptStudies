import type { Profile } from '../ts/types'

type ProfileCardProps = {
  profile: Profile
}

export function ProfileCard({ profile }: ProfileCardProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center space-x-4">
        <img 
          src={profile.avatar} 
          alt={`${profile.username}'s avatar`}
          className="w-16 h-16 rounded-full"
        />
        <div>
          <h2 className="text-xl font-bold">{profile.displayName}</h2>
          <p className="text-gray-600">@{profile.username}</p>
          <p className="mt-2 text-gray-800">{profile.bio}</p>
          <div className="mt-4">
            <span className="text-sm text-gray-500">
              {profile.subscriberCount.toLocaleString()} subscribers
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}