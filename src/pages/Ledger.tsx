import { useState } from 'react'
import { Search, XCircle, Loader2, Printer } from 'lucide-react'
import { useAllBills } from '../hooks/useApi'
import { formatCurrency, formatDate } from '../lib/utils'
import type { Invoice } from '../types'

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

type Tab = 'month' | 'all'

function getMonth(dateStr: string): number {
  return new Date(dateStr).getMonth() + 1
}

function BillTable({ bills, showIndex = true }: { bills: Invoice[]; showIndex?: boolean }) {
  if (bills.length === 0) {
    return (
      <div className="py-12 text-center text-slate-400">
        <p className="font-medium">No bills to show</p>
      </div>
    )
  }
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-slate-50">
          <tr>
            {showIndex && <th className="text-center px-4 py-3 text-xs font-semibold text-slate-500">#</th>}
            <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500">ID</th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500">Department</th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500">Date</th>
            <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500">Total (PKR)</th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500">Vehicle No.</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {bills.map((bill, i) => (
            <tr key={bill.id} className="hover:bg-slate-50 transition-colors">
              {showIndex && <td className="text-center px-4 py-3 text-slate-400 text-xs">{i + 1}</td>}
              <td className="px-4 py-3">
                <span className="font-medium text-slate-700">{bill.custom_id}</span>
                <span className="block text-xs text-blue-500">{bill.invoice_id}</span>
              </td>
              <td className="px-4 py-3 text-slate-600 max-w-[180px] truncate">{bill.dept_name}</td>
              <td className="px-4 py-3 text-slate-500 whitespace-nowrap">{formatDate(bill.invoice_date)}</td>
              <td className="px-4 py-3 text-right font-semibold text-slate-800">
                {formatCurrency(bill.total_bill)}/-
              </td>
              <td className="px-4 py-3 text-slate-600">{bill.vehicle_number}</td>
            </tr>
          ))}
        </tbody>
        <tfoot className="bg-slate-50 border-t border-slate-200">
          <tr>
            <td colSpan={showIndex ? 4 : 3} className="px-4 py-3 text-sm font-semibold text-slate-600 text-right">
              Total
            </td>
            <td className="px-4 py-3 text-right font-bold text-blue-700">
              {formatCurrency(bills.reduce((s, b) => s + b.total_bill, 0))}/-
            </td>
            <td />
          </tr>
        </tfoot>
      </table>
    </div>
  )
}

export default function Ledger() {
  const [tab, setTab] = useState<Tab>('month')
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth() + 1)
  const [searchTerm, setSearchTerm] = useState('')

  // Fetch a large batch for ledger reporting
  const { data: billsData, isLoading } = useAllBills(1, 500)
  const allBills = billsData?.data ?? []

  const monthBills = allBills.filter(b => getMonth(b.invoice_date) === selectedMonth)

  const searchedBills = allBills.filter(b =>
    !searchTerm ||
    (b.custom_id?.toLowerCase() ?? '').includes(searchTerm.toLowerCase()) ||
    b.invoice_id.includes(searchTerm) ||
    b.dept_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.vehicle_number.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const grandTotal = allBills.reduce((s, b) => s + b.total_bill, 0)

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Ledger</h1>
          <p className="text-slate-400 text-sm mt-1">Billing records overview</p>
        </div>
        <div className="card px-5 py-4 text-right">
          <p className="text-xs text-slate-500 mb-1">Grand Total (All Bills)</p>
          <p className="text-xl font-bold text-slate-800">{formatCurrency(grandTotal)}</p>
          <p className="text-xs text-slate-400 mt-0.5">{allBills.length} active invoice{allBills.length !== 1 ? 's' : ''}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-5 bg-slate-100 rounded-xl p-1 w-fit">
        <button
          onClick={() => setTab('month')}
          className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors ${
            tab === 'month' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          By Month
        </button>
        <button
          onClick={() => setTab('all')}
          className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors ${
            tab === 'all' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          All Bills
        </button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-24 text-slate-400 gap-2">
          <Loader2 className="w-5 h-5 animate-spin" /> Loading ledger...
        </div>
      ) : (
        <>
          {/* By Month Tab */}
          {tab === 'month' && (
            <div className="card overflow-hidden">
              {/* Month selector */}
              <div className="px-5 pt-5 pb-4 border-b border-slate-100">
                <div className="grid grid-cols-6 sm:grid-cols-12 gap-1.5">
                  {MONTHS.map((m, i) => {
                    const mon = i + 1
                    const count = allBills.filter(b => getMonth(b.invoice_date) === mon).length
                    return (
                      <button
                        key={m}
                        onClick={() => setSelectedMonth(mon)}
                        className={`py-2 rounded-lg text-xs font-semibold transition-colors relative ${
                          selectedMonth === mon
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-100 text-slate-600 hover:bg-blue-50 hover:text-blue-600'
                        }`}
                      >
                        {m}
                        {count > 0 && (
                          <span className={`block text-[10px] mt-0.5 ${selectedMonth === mon ? 'text-blue-100' : 'text-slate-400'}`}>
                            {count}
                          </span>
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Month title + print */}
              <div className="px-5 py-3 flex items-center justify-between border-b border-slate-100 bg-slate-50">
                <p className="text-sm font-semibold text-slate-700">
                  {MONTHS[selectedMonth - 1]} — {monthBills.length} bill{monthBills.length !== 1 ? 's' : ''}
                  {monthBills.length > 0 && (
                    <span className="ml-2 text-blue-600 font-bold">
                      ({formatCurrency(monthBills.reduce((s, b) => s + b.total_bill, 0))})
                    </span>
                  )}
                </p>
                <button
                  onClick={() => window.print()}
                  className="btn-secondary flex items-center gap-1.5 text-xs py-1.5"
                >
                  <Printer className="w-3.5 h-3.5" /> Print
                </button>
              </div>

              <BillTable bills={monthBills} />
            </div>
          )}

          {/* All Bills Tab */}
          {tab === 'all' && (
            <div className="card overflow-hidden">
              {/* Search */}
              <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-3">
                <Search className="w-4 h-4 text-slate-400 shrink-0" />
                <input
                  type="text"
                  placeholder="Search by ID, department, vehicle number..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="flex-1 text-sm bg-transparent outline-none text-slate-700 placeholder-slate-400"
                />
                {searchTerm && (
                  <button onClick={() => setSearchTerm('')} className="text-slate-400 hover:text-slate-600">
                    <XCircle className="w-4 h-4" />
                  </button>
                )}
              </div>

              <BillTable bills={searchedBills} />
            </div>
          )}
        </>
      )}
    </div>
  )
}
