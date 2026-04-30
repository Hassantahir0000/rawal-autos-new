import { FileText, DollarSign, Building2, TrendingUp, Loader2 } from 'lucide-react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar,
} from 'recharts'
import { useStats, useMonthlyData, useAllBills } from '../hooks/useApi'
import { formatCurrency, formatDate } from '../lib/utils'

export default function Dashboard() {
  const { data: stats, isLoading: statsLoading } = useStats()
  const monthlyData = useMonthlyData()
  const { data: billsData, isLoading: billsLoading } = useAllBills(1, 5)

  const recentBills = billsData?.data.filter(i => i.status === 'active') ?? []

  const statCards = stats
    ? [
        { label: 'Total Bills', value: stats.total_bills, icon: FileText, bg: 'bg-blue-50', text: 'text-blue-600' },
        { label: 'Total Amount Billed', value: formatCurrency(stats.total_bills_amount), icon: DollarSign, bg: 'bg-emerald-50', text: 'text-emerald-600' },
        { label: 'Departments', value: stats.total_dept, icon: Building2, bg: 'bg-violet-50', text: 'text-violet-600' },
        { label: 'Average Bill', value: formatCurrency(stats.average_total_bill), icon: TrendingUp, bg: 'bg-amber-50', text: 'text-amber-600' },
      ]
    : []

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
        <p className="text-slate-500 text-sm mt-1">Welcome back — here's what's happening at Rawal Autos.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
        {statsLoading
          ? Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="card p-5 animate-pulse">
                <div className="h-12 bg-slate-100 rounded-xl mb-4 w-12" />
                <div className="h-7 bg-slate-100 rounded w-24 mb-2" />
                <div className="h-4 bg-slate-100 rounded w-32" />
              </div>
            ))
          : statCards.map(({ label, value, icon: Icon, bg, text }) => (
              <div key={label} className="card p-5">
                <div className="flex items-start justify-between mb-4">
                  <div className={`${bg} p-3 rounded-xl`}>
                    <Icon className={`w-5 h-5 ${text}`} />
                  </div>
                </div>
                <p className="text-2xl font-bold text-slate-800 mb-1">{value}</p>
                <p className="text-sm text-slate-500">{label}</p>
              </div>
            ))
        }
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 mb-8">
        <div className="card p-5 xl:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-base font-semibold text-slate-800">Monthly Revenue</h2>
              <p className="text-sm text-slate-400">Full year billing overview</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={monthlyData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false}
                tickFormatter={v => `${(Number(v) / 1000).toFixed(0)}k`} />
              <Tooltip
                contentStyle={{ background: '#1e293b', border: 'none', borderRadius: 8, color: '#f8fafc' }}
                formatter={(v: unknown) => [formatCurrency(Number(v)), 'Revenue']}
              />
              <Area type="monotone" dataKey="amount" stroke="#3b82f6" strokeWidth={2}
                fill="url(#colorAmount)" dot={{ fill: '#3b82f6', strokeWidth: 0, r: 3 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="card p-5">
          <div className="mb-6">
            <h2 className="text-base font-semibold text-slate-800">Bills per Month</h2>
            <p className="text-sm text-slate-400">Count of invoices issued</p>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={monthlyData} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: '#1e293b', border: 'none', borderRadius: 8, color: '#f8fafc' }}
                formatter={(v: unknown) => [Number(v), 'Bills']}
              />
              <Bar dataKey="bills" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Bills */}
      <div className="card">
        <div className="px-6 py-4 border-b border-slate-100">
          <h2 className="text-base font-semibold text-slate-800">Recent Bills</h2>
        </div>
        <div className="overflow-x-auto">
          {billsLoading ? (
            <div className="flex items-center justify-center py-12 text-slate-400 gap-2">
              <Loader2 className="w-5 h-5 animate-spin" /> Loading...
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50">
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Invoice</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Department</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Vehicle</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Date</th>
                  <th className="text-right px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {recentBills.map(bill => (
                  <tr key={bill.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <span className="font-semibold text-slate-800">{bill.custom_id}</span>
                      <span className="block text-xs text-blue-500">{bill.invoice_id}</span>
                    </td>
                    <td className="px-6 py-4 text-slate-600">{bill.dept_name}</td>
                    <td className="px-6 py-4">
                      <span className="font-medium text-slate-700">{bill.vehicle_number}</span>
                      <span className="block text-xs text-slate-400">{bill.vehicle_type}</span>
                    </td>
                    <td className="px-6 py-4 text-slate-500">{formatDate(bill.invoice_date)}</td>
                    <td className="px-6 py-4 text-right font-semibold text-slate-800">
                      {formatCurrency(bill.total_bill)}
                    </td>
                  </tr>
                ))}
                {recentBills.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-10 text-center text-slate-400 text-sm">No recent bills</td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}
