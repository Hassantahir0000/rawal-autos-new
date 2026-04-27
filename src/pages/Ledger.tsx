import { useState } from 'react'
import { ChevronDown, ChevronRight, BookOpen } from 'lucide-react'
import { mockLedger } from '../data/mock'
import { formatCurrency, formatDate } from '../lib/utils'

export default function Ledger() {
  const [expanded, setExpanded] = useState<number | null>(null)

  const grandTotal = mockLedger.reduce((s, d) => s + d.total, 0)

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Ledger</h1>
          <p className="text-slate-400 text-sm mt-1">Department-wise billing summary</p>
        </div>
        <div className="card px-5 py-4 text-right">
          <p className="text-xs text-slate-500 mb-1">Grand Total Outstanding</p>
          <p className="text-xl font-bold text-slate-800">{formatCurrency(grandTotal)}</p>
        </div>
      </div>

      {/* Accordion Ledger */}
      <div className="space-y-3">
        {mockLedger.map(entry => (
          <div key={entry.dept_id} className="card overflow-hidden">
            <button
              onClick={() => setExpanded(expanded === entry.dept_id ? null : entry.dept_id)}
              className="w-full flex items-center justify-between px-6 py-4 hover:bg-slate-50 transition-colors text-left"
            >
              <div className="flex items-center gap-3">
                <div className="bg-blue-50 rounded-lg p-2">
                  <BookOpen className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="font-semibold text-slate-800">{entry.dept_name}</p>
                  <p className="text-xs text-slate-400">{entry.invoices.length} invoice{entry.invoices.length !== 1 ? 's' : ''}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-bold text-slate-800">{formatCurrency(entry.total)}</span>
                {expanded === entry.dept_id
                  ? <ChevronDown className="w-4 h-4 text-slate-400" />
                  : <ChevronRight className="w-4 h-4 text-slate-400" />
                }
              </div>
            </button>

            {expanded === entry.dept_id && (
              <div className="border-t border-slate-100">
                {entry.invoices.length === 0 ? (
                  <p className="px-6 py-5 text-sm text-slate-400 text-center">No invoices for this department</p>
                ) : (
                  <table className="w-full text-sm">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="text-left px-6 py-2.5 text-xs font-semibold text-slate-500">Invoice</th>
                        <th className="text-left px-6 py-2.5 text-xs font-semibold text-slate-500">Vehicle</th>
                        <th className="text-left px-6 py-2.5 text-xs font-semibold text-slate-500">Date</th>
                        <th className="text-right px-6 py-2.5 text-xs font-semibold text-slate-500">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {entry.invoices.map(inv => (
                        <tr key={inv.id} className="hover:bg-slate-50">
                          <td className="px-6 py-3">
                            <span className="font-medium text-slate-700">{inv.custom_id}</span>
                          </td>
                          <td className="px-6 py-3 text-slate-500">
                            {inv.vehicle_number} — {inv.vehicle_type}
                          </td>
                          <td className="px-6 py-3 text-slate-400">{formatDate(inv.invoice_date)}</td>
                          <td className="px-6 py-3 text-right font-semibold text-slate-800">
                            {formatCurrency(inv.total_bill)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="bg-slate-50">
                        <td colSpan={3} className="px-6 py-3 text-sm font-semibold text-slate-600 text-right">
                          Department Total
                        </td>
                        <td className="px-6 py-3 text-right font-bold text-blue-700">
                          {formatCurrency(entry.total)}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
