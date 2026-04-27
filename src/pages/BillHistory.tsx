import { useState, useRef } from 'react'
import { Search, Printer, Edit2, XCircle, ChevronDown } from 'lucide-react'
import { useReactToPrint } from 'react-to-print'
import { mockInvoices } from '../data/mock'
import { formatCurrency, formatDate } from '../lib/utils'
import type { Invoice } from '../types'
import BillPrintTemplate1 from '../components/bills/BillPrintTemplate1'

type ModalType = 'bill1' | 'bill2' | 'bill3' | 'bill4' | 'bill5' | 'update' | 'cancel' | null

export default function BillHistory() {
  const [searchTerm, setSearchTerm] = useState('')
  const [visibleCount, setVisibleCount] = useState(10)
  const [selectedBill, setSelectedBill] = useState<Invoice | null>(null)
  const [activeModal, setActiveModal] = useState<ModalType>(null)
  const [newCustomId, setNewCustomId] = useState('')
  const [bill4Pct, setBill4Pct] = useState(0)
  const [bill5Pct, setBill5Pct] = useState(0)

  const printRef = useRef<HTMLDivElement>(null)

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `Invoice-${selectedBill?.custom_id}`,
  })

  const activeBills = mockInvoices.filter(i => i.status === 'active')

  const filtered = activeBills.filter(b =>
    !searchTerm ||
    b.invoice_id.includes(searchTerm) ||
    b.custom_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.dept_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.vehicle_number.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const openModal = (bill: Invoice, modal: ModalType) => {
    setSelectedBill(bill)
    setNewCustomId(bill.custom_id ?? '')
    setBill4Pct(bill.bill4_value ?? 0)
    setBill5Pct(bill.bill5_value ?? 0)
    setActiveModal(modal)
  }

  const closeModal = () => {
    setActiveModal(null)
    setSelectedBill(null)
  }

  const billBadges = [
    { label: '1', modal: 'bill1' as ModalType, title: 'Rawal Autos Invoice' },
    { label: '2', modal: 'bill2' as ModalType, title: 'Sales Tax Invoice' },
    { label: '3', modal: 'bill3' as ModalType, title: 'Quotation' },
    { label: '4', modal: 'bill4' as ModalType, title: 'Green Traders' },
    { label: '5', modal: 'bill5' as ModalType, title: 'Car Masters' },
  ]

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Bill History</h1>
        <p className="text-slate-400 text-sm mt-1">{activeBills.length} active invoices</p>
      </div>

      {/* Search */}
      <div className="card p-4 mb-5 flex items-center gap-3">
        <Search className="w-4 h-4 text-slate-400 shrink-0" />
        <input
          type="text"
          placeholder="Search by invoice ID, department, vehicle number..."
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

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase">#</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase">Invoice</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase">Vehicle</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase">Date</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase">Department</th>
                <th className="text-right px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase">Total</th>
                <th className="text-center px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase">Print Bill</th>
                <th className="text-center px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.slice(0, visibleCount).map((bill, index) => (
                <tr key={bill.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-5 py-4 text-slate-400 text-xs">{index + 1}</td>
                  <td className="px-5 py-4">
                    <span className="font-semibold text-slate-800">{bill.custom_id}</span>
                    <span className="block text-xs text-blue-500">{bill.invoice_id}</span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="font-medium text-slate-700">{bill.vehicle_number}</span>
                    <span className="block text-xs text-slate-400">{bill.vehicle_type}</span>
                  </td>
                  <td className="px-5 py-4 text-slate-500">{formatDate(bill.invoice_date)}</td>
                  <td className="px-5 py-4 text-slate-600 max-w-[180px] truncate">{bill.dept_name}</td>
                  <td className="px-5 py-4 text-right font-semibold text-slate-800">
                    {formatCurrency(bill.total_bill)}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-center gap-1">
                      {billBadges.map(({ label, modal }) => (
                        <button
                          key={label}
                          onClick={() => openModal(bill, modal)}
                          title={`Print Bill ${label}`}
                          className="w-7 h-7 rounded-md bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-600 text-xs font-semibold transition-colors flex items-center justify-center"
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => openModal(bill, 'update')}
                        title="Update percentages"
                        className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => openModal(bill, 'cancel')}
                        title="Cancel bill"
                        className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filtered.length === 0 && (
            <div className="text-center py-16 text-slate-400">
              <Search className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p className="font-medium">No bills found</p>
              <p className="text-sm">Try a different search term</p>
            </div>
          )}
        </div>

        {visibleCount < filtered.length && (
          <div className="px-5 py-4 border-t border-slate-100 text-center">
            <button
              onClick={() => setVisibleCount(n => n + 10)}
              className="btn-secondary flex items-center gap-2 mx-auto"
            >
              <ChevronDown className="w-4 h-4" /> Load More
            </button>
          </div>
        )}
      </div>

      {/* Hidden print area */}
      {selectedBill && (
        <div className="hidden">
          <BillPrintTemplate1 ref={printRef} invoice={selectedBill} />
        </div>
      )}

      {/* Modal */}
      {activeModal && selectedBill && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {/* Bill Preview Modals (1-5) */}
            {['bill1', 'bill2', 'bill3', 'bill4', 'bill5'].includes(activeModal) && (
              <>
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                  <h3 className="font-semibold text-slate-800">
                    {billBadges.find(b => b.modal === activeModal)?.title}
                  </h3>
                  <button onClick={closeModal} className="text-slate-400 hover:text-slate-600">
                    <XCircle className="w-5 h-5" />
                  </button>
                </div>
                <BillPrintTemplate1 ref={printRef} invoice={selectedBill} />
                <div className="px-6 py-4 border-t border-slate-100 flex justify-end">
                  <button onClick={handlePrint} className="btn-primary flex items-center gap-2">
                    <Printer className="w-4 h-4" /> Print
                  </button>
                </div>
              </>
            )}

            {/* Update Modal */}
            {activeModal === 'update' && (
              <>
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                  <h3 className="font-semibold text-slate-800">Update Bill Percentages</h3>
                  <button onClick={closeModal} className="text-slate-400 hover:text-slate-600">
                    <XCircle className="w-5 h-5" />
                  </button>
                </div>
                <div className="p-6 space-y-4">
                  <div>
                    <label className="form-label">Custom Invoice ID</label>
                    <input
                      type="text"
                      value={newCustomId}
                      onChange={e => setNewCustomId(e.target.value)}
                      className="form-input"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="form-label">Bill 4 % (Green Traders)</label>
                      <input type="number" min="0" max="100" value={bill4Pct}
                        onChange={e => setBill4Pct(Number(e.target.value))} className="form-input" />
                    </div>
                    <div>
                      <label className="form-label">Bill 5 % (Car Masters)</label>
                      <input type="number" min="0" max="100" value={bill5Pct}
                        onChange={e => setBill5Pct(Number(e.target.value))} className="form-input" />
                    </div>
                  </div>
                </div>
                <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-3">
                  <button onClick={closeModal} className="btn-secondary">Cancel</button>
                  <button onClick={closeModal} className="btn-primary">Update</button>
                </div>
              </>
            )}

            {/* Cancel Confirmation */}
            {activeModal === 'cancel' && (
              <>
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                  <h3 className="font-semibold text-slate-800">Cancel Bill</h3>
                  <button onClick={closeModal} className="text-slate-400 hover:text-slate-600">
                    <XCircle className="w-5 h-5" />
                  </button>
                </div>
                <div className="p-6 text-center">
                  <XCircle className="w-12 h-12 text-red-400 mx-auto mb-3" />
                  <p className="text-slate-700 font-medium mb-1">Cancel Invoice {selectedBill.custom_id}?</p>
                  <p className="text-sm text-slate-400">This action will mark the bill as cancelled. It can be reviewed in Cancelled Bills.</p>
                </div>
                <div className="px-6 py-4 border-t border-slate-100 flex justify-center gap-3">
                  <button onClick={closeModal} className="btn-secondary">No, Keep It</button>
                  <button onClick={closeModal} className="btn-danger">Yes, Cancel Bill</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
