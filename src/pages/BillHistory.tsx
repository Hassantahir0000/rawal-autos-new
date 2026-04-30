import { useState, useRef } from 'react'
import { Search, Printer, Edit2, XCircle, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react'
import { useReactToPrint } from 'react-to-print'
import {
  useAllBills, useBillDetail, useCancelBill, useUpdateBill, useUpdateBillId,
} from '../hooks/useApi'
import { formatCurrency, formatDate } from '../lib/utils'
import type { Invoice } from '../types'
import BillTemplate1 from '../components/bills/BillTemplate1'
import BillTemplate2 from '../components/bills/BillTemplate2'
import BillTemplate3 from '../components/bills/BillTemplate3'
import BillTemplate4 from '../components/bills/BillTemplate4'
import BillTemplate5 from '../components/bills/BillTemplate5'

type ModalType = 'bill1' | 'bill2' | 'bill3' | 'bill4' | 'bill5' | 'update' | 'cancel' | null

const BILL_LABELS: Record<string, string> = {
  bill1: 'Rawal Autos Invoice',
  bill2: 'Sales Tax Invoice',
  bill3: 'Quotation',
  bill4: 'Green Traders',
  bill5: 'Car Masters',
}

export default function BillHistory() {
  const [searchTerm, setSearchTerm] = useState('')
  const [page, setPage] = useState(1)
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string | null>(null)
  const [selectedBillBasic, setSelectedBillBasic] = useState<Invoice | null>(null)
  const [activeModal, setActiveModal] = useState<ModalType>(null)
  const [newCustomId, setNewCustomId] = useState('')
  const [bill4Pct, setBill4Pct] = useState(0)
  const [bill5Pct, setBill5Pct] = useState(0)
  const [updateError, setUpdateError] = useState('')

  const ref1 = useRef<HTMLDivElement>(null)
  const ref2 = useRef<HTMLDivElement>(null)
  const ref3 = useRef<HTMLDivElement>(null)
  const ref4 = useRef<HTMLDivElement>(null)
  const ref5 = useRef<HTMLDivElement>(null)

  const print1 = useReactToPrint({ contentRef: ref1, documentTitle: `Bill1-${selectedBillBasic?.custom_id}` })
  const print2 = useReactToPrint({ contentRef: ref2, documentTitle: `Bill2-${selectedBillBasic?.custom_id}` })
  const print3 = useReactToPrint({ contentRef: ref3, documentTitle: `Bill3-${selectedBillBasic?.custom_id}` })
  const print4 = useReactToPrint({ contentRef: ref4, documentTitle: `Bill4-${selectedBillBasic?.custom_id}` })
  const print5 = useReactToPrint({ contentRef: ref5, documentTitle: `Bill5-${selectedBillBasic?.custom_id}` })

  const printHandlers: Record<string, () => void> = {
    bill1: print1, bill2: print2, bill3: print3, bill4: print4, bill5: print5,
  }

  const { data: billsData, isLoading: billsLoading } = useAllBills(page, 50)
  const { data: billDetail, isLoading: billDetailLoading } = useBillDetail(selectedInvoiceId)

  const cancelBill = useCancelBill()
  const updateBill = useUpdateBill()
  const updateBillId = useUpdateBillId()

  // API already returns only active bills (WHERE cancel=0), no client-side filter needed
  const bills = billsData?.data ?? []
  const totalPages = billsData?.totalPages ?? 1

  const filtered = bills.filter(b =>
    !searchTerm ||
    b.invoice_id.includes(searchTerm) ||
    (b.custom_id?.toLowerCase() ?? '').includes(searchTerm.toLowerCase()) ||
    b.dept_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.vehicle_number.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const openModal = (bill: Invoice, modal: ModalType) => {
    setSelectedInvoiceId(bill.invoice_id)
    setSelectedBillBasic(bill)
    setNewCustomId(bill.custom_id ?? '')
    setBill4Pct(bill.bill4_value ?? 0)
    setBill5Pct(bill.bill5_value ?? 0)
    setUpdateError('')
    setActiveModal(modal)
  }

  const closeModal = () => {
    setActiveModal(null)
    setSelectedInvoiceId(null)
    setSelectedBillBasic(null)
    setUpdateError('')
  }

  const handleCancel = () => {
    if (!selectedBillBasic) return
    cancelBill.mutate(selectedBillBasic.invoice_id, { onSuccess: closeModal })
  }

  const handleUpdate = () => {
    if (!selectedBillBasic) return
    setUpdateError('')
    const tasks: Promise<unknown>[] = []

    if (newCustomId !== (selectedBillBasic.custom_id ?? '')) {
      tasks.push(updateBillId.mutateAsync({ invoice_id: selectedBillBasic.invoice_id, new_id: newCustomId }))
    }
    if (bill4Pct !== selectedBillBasic.bill4_value || bill5Pct !== selectedBillBasic.bill5_value) {
      tasks.push(updateBill.mutateAsync({ invoice_id: selectedBillBasic.invoice_id, bill4_value: bill4Pct, bill5_value: bill5Pct }))
    }

    Promise.all(tasks)
      .then(() => closeModal())
      .catch(() => setUpdateError('Update failed. Please try again.'))
  }

  const isBillPreview = (m: ModalType): m is 'bill1' | 'bill2' | 'bill3' | 'bill4' | 'bill5' =>
    m === 'bill1' || m === 'bill2' || m === 'bill3' || m === 'bill4' || m === 'bill5'

  const billBadges = [
    { label: '1', modal: 'bill1' as ModalType },
    { label: '2', modal: 'bill2' as ModalType },
    { label: '3', modal: 'bill3' as ModalType },
    { label: '4', modal: 'bill4' as ModalType },
    { label: '5', modal: 'bill5' as ModalType },
  ]

  const isUpdatePending = updateBill.isPending || updateBillId.isPending

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Bill History</h1>
        <p className="text-slate-400 text-sm mt-1">{bills.length} active invoices on this page</p>
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
        {billsLoading ? (
          <div className="flex items-center justify-center py-20 text-slate-400 gap-2">
            <Loader2 className="w-5 h-5 animate-spin" /> Loading bills...
          </div>
        ) : (
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
                {filtered.map((bill, index) => (
                  <tr key={bill.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-4 text-slate-400 text-xs">{(page - 1) * 50 + index + 1}</td>
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
                            title={BILL_LABELS[modal as string]}
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
                          title="Update bill IDs and percentages"
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
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-5 py-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-sm text-slate-400">Page {page} of {totalPages}</span>
            <div className="flex gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="btn-secondary flex items-center gap-1 disabled:opacity-40"
              >
                <ChevronLeft className="w-4 h-4" /> Prev
              </button>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="btn-secondary flex items-center gap-1 disabled:opacity-40"
              >
                Next <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Hidden print areas — mounted only when full detail is loaded */}
      {billDetail && (
        <div style={{ position: 'absolute', left: '-9999px', top: 0 }}>
          <BillTemplate1 ref={ref1} invoice={billDetail} />
          <BillTemplate2 ref={ref2} invoice={billDetail} />
          <BillTemplate3 ref={ref3} invoice={billDetail} />
          <BillTemplate4 ref={ref4} invoice={billDetail} />
          <BillTemplate5 ref={ref5} invoice={billDetail} />
        </div>
      )}

      {/* Modal */}
      {activeModal && selectedBillBasic && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[92vh] flex flex-col">

            {/* Bill preview modals */}
            {isBillPreview(activeModal) && (
              <>
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 shrink-0">
                  <div>
                    <h3 className="font-semibold text-slate-800">
                      Bill {activeModal.replace('bill', '')} — {BILL_LABELS[activeModal]}
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">{selectedBillBasic.custom_id} · {selectedBillBasic.dept_name}</p>
                  </div>
                  <button onClick={closeModal} className="text-slate-400 hover:text-slate-600 ml-4">
                    <XCircle className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto bg-slate-50 p-4">
                  {billDetailLoading ? (
                    <div className="flex items-center justify-center h-48 text-slate-400 gap-2">
                      <Loader2 className="w-5 h-5 animate-spin" /> Loading bill details...
                    </div>
                  ) : (
                    <div className="bg-white shadow-sm rounded-lg overflow-hidden">
                      {activeModal === 'bill1' && billDetail && <BillTemplate1 invoice={billDetail} />}
                      {activeModal === 'bill2' && billDetail && <BillTemplate2 invoice={billDetail} />}
                      {activeModal === 'bill3' && billDetail && <BillTemplate3 invoice={billDetail} />}
                      {activeModal === 'bill4' && billDetail && <BillTemplate4 invoice={billDetail} />}
                      {activeModal === 'bill5' && billDetail && <BillTemplate5 invoice={billDetail} />}
                    </div>
                  )}
                </div>

                <div className="px-6 py-4 border-t border-slate-100 flex justify-end shrink-0">
                  <button
                    onClick={() => printHandlers[activeModal]?.()}
                    disabled={billDetailLoading || !billDetail}
                    className="btn-primary flex items-center gap-2 disabled:opacity-50"
                  >
                    <Printer className="w-4 h-4" /> Print
                  </button>
                </div>
              </>
            )}

            {/* Update modal */}
            {activeModal === 'update' && (
              <>
                <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
                  <h3 className="font-semibold text-slate-800">Update Bill IDs & Percentages</h3>
                  <button onClick={closeModal} className="text-slate-400 hover:text-slate-600">
                    <XCircle className="w-5 h-5" />
                  </button>
                </div>
                <div className="p-6 space-y-4 overflow-y-auto">
                  {updateError && (
                    <p className="text-sm text-red-500 bg-red-50 px-3 py-2 rounded-lg">{updateError}</p>
                  )}
                  <div>
                    <label className="form-label">Custom Invoice ID (Bill 1)</label>
                    <input type="text" value={newCustomId} onChange={e => setNewCustomId(e.target.value)} className="form-input" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="form-label">Bill 4 % — Green Traders</label>
                      <input type="number" min="0" max="100" value={bill4Pct}
                        onChange={e => setBill4Pct(Number(e.target.value))} className="form-input" />
                      <p className="text-xs text-slate-400 mt-1">
                        Adjusted total: Rs. {Math.round(selectedBillBasic.total_bill * (1 + bill4Pct / 100)).toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <label className="form-label">Bill 5 % — Car Masters</label>
                      <input type="number" min="0" max="100" value={bill5Pct}
                        onChange={e => setBill5Pct(Number(e.target.value))} className="form-input" />
                      <p className="text-xs text-slate-400 mt-1">
                        Adjusted total: Rs. {Math.round(selectedBillBasic.total_bill * (1 + bill5Pct / 100)).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-3">
                  <button onClick={closeModal} className="btn-secondary">Cancel</button>
                  <button
                    onClick={handleUpdate}
                    disabled={isUpdatePending}
                    className="btn-primary flex items-center gap-2 disabled:opacity-60"
                  >
                    {isUpdatePending && <Loader2 className="w-4 h-4 animate-spin" />}
                    Update
                  </button>
                </div>
              </>
            )}

            {/* Cancel confirmation */}
            {activeModal === 'cancel' && (
              <>
                <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
                  <h3 className="font-semibold text-slate-800">Cancel Bill</h3>
                  <button onClick={closeModal} className="text-slate-400 hover:text-slate-600">
                    <XCircle className="w-5 h-5" />
                  </button>
                </div>
                <div className="p-8 text-center">
                  <XCircle className="w-14 h-14 text-red-400 mx-auto mb-4" />
                  <p className="text-slate-700 font-semibold text-lg mb-1">Cancel Invoice {selectedBillBasic.custom_id}?</p>
                  <p className="text-sm text-slate-400 max-w-sm mx-auto">
                    This will mark the bill as cancelled. It remains visible in the Cancelled Bills section.
                  </p>
                </div>
                <div className="px-6 py-4 border-t border-slate-100 flex justify-center gap-3">
                  <button onClick={closeModal} className="btn-secondary">No, Keep It</button>
                  <button
                    onClick={handleCancel}
                    disabled={cancelBill.isPending}
                    className="btn-danger border border-red-200 flex items-center gap-2 disabled:opacity-60"
                  >
                    {cancelBill.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                    Yes, Cancel Bill
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
