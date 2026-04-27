import { forwardRef } from 'react'
import type { Invoice } from '../../types'
import { formatDate, numberToWords } from '../../lib/utils'

interface Props { invoice: Invoice }

const BillPrintTemplate1 = forwardRef<HTMLDivElement, Props>(({ invoice }, ref) => (
  <div ref={ref} className="p-8 bg-white max-w-2xl mx-auto text-sm font-sans">
    {/* Header banner placeholder */}
    <div className="border-2 border-blue-700 rounded-lg p-4 mb-6 text-center bg-blue-50">
      <h1 className="text-2xl font-bold text-blue-800">RAWAL AUTOS</h1>
      <p className="text-blue-600 text-xs mt-1">Auto Parts & Services | Civic Center G-6, Islamabad</p>
    </div>

    {/* Invoice meta */}
    <table className="w-full mb-4 text-sm">
      <tbody>
        <tr>
          <td>
            <p><strong>Invoice No:</strong> <span className="text-blue-600">{invoice.custom_id}</span></p>
            <p><strong>To:</strong> {invoice.dept_name}</p>
          </td>
          <td className="text-right">
            <p>Date: {formatDate(invoice.invoice_date)}</p>
            <p><strong>Vehicle No:</strong> {invoice.vehicle_number}</p>
            <p><strong>Vehicle Type:</strong> {invoice.vehicle_type}</p>
          </td>
        </tr>
      </tbody>
    </table>

    {/* Items */}
    <table className="w-full border-collapse border border-slate-300 text-sm mb-4">
      <thead className="bg-slate-100">
        <tr>
          <th className="border border-slate-300 px-3 py-2 text-left">#</th>
          <th className="border border-slate-300 px-3 py-2 text-left">Particular</th>
          <th className="border border-slate-300 px-3 py-2 text-center">Quantity</th>
          <th className="border border-slate-300 px-3 py-2 text-left">Total</th>
        </tr>
      </thead>
      <tbody>
        {invoice.items.map((item, i) => (
          <tr key={item.id}>
            <td className="border border-slate-300 px-3 py-2">{i + 1}</td>
            <td className="border border-slate-300 px-3 py-2">{item.descp}</td>
            <td className="border border-slate-300 px-3 py-2 text-center">{item.quantity}</td>
            <td className="border border-slate-300 px-3 py-2">Rs. {item.total_price}/-</td>
          </tr>
        ))}
        <tr className="bg-blue-50">
          <td className="border border-slate-300 px-3 py-2"></td>
          <td className="border border-slate-300 px-3 py-2 text-blue-600 font-medium" colSpan={2}>
            {numberToWords(invoice.total_bill)} Rupees Only
          </td>
          <td className="border border-slate-300 px-3 py-2 font-bold text-blue-700">Rs. {invoice.total_bill}/-</td>
        </tr>
      </tbody>
    </table>

    {/* Vendor info */}
    <div className="text-xs text-slate-600 leading-relaxed">
      <p>Vendor No: 30021379 | NTN: 1218638-4 | STR: 0701870815373</p>
      <p>A/C No: 001000506690012 | Allied Bank Ltd. | Civic Center G-6 Islamabad</p>
    </div>
  </div>
))
BillPrintTemplate1.displayName = 'BillPrintTemplate1'
export default BillPrintTemplate1
