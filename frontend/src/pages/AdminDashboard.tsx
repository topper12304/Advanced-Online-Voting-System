import { useState } from 'react'
import { 
  BarChart3, 
  Users, 
  Shield, 
  AlertTriangle, 
  CheckCircle,
  Clock,
  TrendingUp
} from 'lucide-react'

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'fraud' | 'elections'>('overview')

  const stats = [
    { label: 'Total Votes Cast', value: '2,847,392', icon: Users, color: 'text-blue-600 bg-blue-100' },
    { label: 'Active Elections', value: '3', icon: BarChart3, color: 'text-green-600 bg-green-100' },
    { label: 'Fraud Alerts', value: '12', icon: AlertTriangle, color: 'text-red-600 bg-red-100' },
    { label: 'System Uptime', value: '99.98%', icon: CheckCircle, color: 'text-green-600 bg-green-100' },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Election Administration Dashboard
        </h1>
        <p className="text-gray-600">
          Monitor elections, detect fraud, and manage system operations
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className={`p-3 rounded-lg ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'fraud', label: 'Fraud Detection', icon: Shield },
            { id: 'elections', label: 'Elections', icon: Users },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon className="w-4 h-4 mr-2" />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Real-time Voting Activity
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Votes per minute</span>
                <span className="text-lg font-semibold text-gray-900">1,247</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Peak concurrent users</span>
                <span className="text-lg font-semibold text-gray-900">89,432</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Average response time</span>
                <span className="text-lg font-semibold text-gray-900">1.2s</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              System Health
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Blockchain Nodes</span>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-600 mr-1" />
                  <span className="text-sm text-green-600">15/15 Online</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Database Status</span>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-600 mr-1" />
                  <span className="text-sm text-green-600">Healthy</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">API Gateway</span>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-600 mr-1" />
                  <span className="text-sm text-green-600">Operational</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'fraud' && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Fraud Detection Alerts
          </h3>
          <div className="space-y-4">
            {[
              { id: 1, type: 'Duplicate Biometric', severity: 'High', time: '2 minutes ago', status: 'Under Review' },
              { id: 2, type: 'IP Anomaly', severity: 'Medium', time: '15 minutes ago', status: 'Resolved' },
              { id: 3, type: 'Timing Anomaly', severity: 'Low', time: '1 hour ago', status: 'False Positive' },
            ].map((alert) => (
              <div key={alert.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <AlertTriangle className={`w-5 h-5 ${
                    alert.severity === 'High' ? 'text-red-600' :
                    alert.severity === 'Medium' ? 'text-yellow-600' : 'text-blue-600'
                  }`} />
                  <div>
                    <p className="font-medium text-gray-900">{alert.type}</p>
                    <p className="text-sm text-gray-500">{alert.time}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    alert.status === 'Under Review' ? 'bg-yellow-100 text-yellow-800' :
                    alert.status === 'Resolved' ? 'bg-green-100 text-green-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {alert.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'elections' && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Active Elections
            </h3>
            <button className="btn-primary">
              Create New Election
            </button>
          </div>
          <div className="space-y-4">
            {[
              { name: 'General Election 2024', status: 'Active', votes: '2,847,392', endTime: '2 days remaining' },
              { name: 'State Assembly - Maharashtra', status: 'Active', votes: '1,234,567', endTime: '5 hours remaining' },
              { name: 'Local Council - Mumbai', status: 'Scheduled', votes: '0', endTime: 'Starts in 3 days' },
            ].map((election, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{election.name}</p>
                  <p className="text-sm text-gray-500">{election.votes} votes cast</p>
                </div>
                <div className="text-right">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full mb-1 ${
                    election.status === 'Active' ? 'bg-green-100 text-green-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {election.status}
                  </span>
                  <p className="text-sm text-gray-500">{election.endTime}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}