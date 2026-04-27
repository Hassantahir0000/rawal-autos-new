import { XCircle } from 'lucide-react'
import { mockInvoices } from '../data/mock'
import { formatCurrency, formatDate } from '../lib/utils'

export default function CancelledBills() {
  const cancelledBills = mockInvoices.filter(i => i.status === 'cancelled')

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Cancelled Bills</h1>
        <p className="text-slate-400 text-sm mt-1">{cancelledBills.length} cancelled invoice{cancelledBills.length !== 1 ? 's' : ''}</p>
      </div>

      {cancelledBills.length === 0 ? (
        <div className="card py-20 text-center">
          <XCircle className="w-12 h-12 text-slate-200 mx-auto mb-4" />
          <p className="text-slate-400 font-medium">No cancelled bills</p>
          <p className="text-sm text-slate-300 mt-1">Cancelled invoices will appear here</p>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase">#</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase">Invoice</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase">Department</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase">Vehicle</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase">Date</th>
                <th className="text-right px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase">Total</th>
                <th className="text-center px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {cancelledBills.map((bill, index) => (
                <tr key={bill.id} className="hover:bg-red-50/30 transition-colors">
                  <td className="px-5 py-4 text-slate-400 text-xs">{index + 1}</td>
                  <td className="px-5 py-4">
                    <span className="font-semibold text-slate-600 line-through">{bill.custom_id}</span>
                    <span className="block text-xs text-slate-400">{bill.invoice_id}</span>
                  </td>
                  <td className="px-5 py-4 text-slate-500">{bill.dept_name}</td>
                  <td className="px-5 py-4">
                    <span className="text-slate-600">{bill.vehicle_number}</span>
                    <span className="block text-xs text-slate-400">{bill.vehicle_type}</span>
                  </td>
                  <td className="px-5 py-4 text-slate-400">{formatDate(bill.invoice_date)}</td>
                  <td className="px-5 py-4 text-right text-slate-500 line-through">
                    {formatCurrency(bill.total_bill)}
                  </td>
                  <td className="px-5 py-4 text-center">
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-red-600 bg-red-50 px-2.5 py-1 rounded-full">
                      <XCircle className="w-3 h-3" /> Cancelled
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
