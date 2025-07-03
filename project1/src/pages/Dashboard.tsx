import { ProfileCard } from '../lib/components/ProfileCard'

export default function Dashboard() {
  // This would come from your API/state
  const userProfile = {
    id: '1',
    username: 'john_doe',
    displayName: 'John Doe',
    avatar: '/default-avatar.jpg',
    bio: 'Content creator and artist',
    subscriberCount: 4200
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Your Dashboard</h1>
      <ProfileCard profile={userProfile} />
    </div>
  )
}