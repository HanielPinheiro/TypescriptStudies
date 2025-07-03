import type { CreatorStats } from '../ts/types'

type CreatorDashboardProps = {
  stats: CreatorStats;
};

export const CreatorDashboard = ({ stats }: CreatorDashboardProps) => {
  return (
    <div className="bg-gray-800 rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-white mb-6">Creator Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gray-700 p-4 rounded-lg">
          <h3 className="text-gray-400 text-sm font-medium">Total Earnings</h3>
          <p className="text-2xl font-bold text-white">${stats.totalEarnings.toFixed(2)}</p>
        </div>
        <div className="bg-gray-700 p-4 rounded-lg">
          <h3 className="text-gray-400 text-sm font-medium">Subscribers</h3>
          <p className="text-2xl font-bold text-white">{stats.subscriberCount}</p>
          <p className={`text-sm ${
            stats.subscriberChange >= 0 ? 'text-green-400' : 'text-red-400'
          }`}>
            {stats.subscriberChange >= 0 ? '+' : ''}{stats.subscriberChange} this month
          </p>
        </div>
        <div className="bg-gray-700 p-4 rounded-lg">
          <h3 className="text-gray-400 text-sm font-medium">Engagement Rate</h3>
          <p className="text-2xl font-bold text-white">{stats.engagementRate}%</p>
        </div>
      </div>
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-white mb-4">Recent Transactions</h3>
        <div className="bg-gray-700 rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-600">
            <thead className="bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Subscriber
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Type
                </th>
              </tr>
            </thead>
            <tbody className="bg-gray-700 divide-y divide-gray-600">
              {stats.recentTransactions.map((tx) => (
                <tr key={tx.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {new Date(tx.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                    {tx.subscriber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-green-400">
                    ${tx.amount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {tx.type}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div>
        <h3 className="text-xl font-semibold text-white mb-4">Quick Actions</h3>
        <div className="flex space-x-4">
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg">
            Create Post
          </button>
          <button className="bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded-lg">
            View Analytics
          </button>
          <button className="bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded-lg">
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
};