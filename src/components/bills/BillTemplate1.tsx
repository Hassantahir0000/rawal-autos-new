import { forwardRef } from 'react'
import type { Invoice } from '../../types'
import { formatDate, numberToWords } from '../../lib/utils'
import { PRINT_STYLES } from '../../lib/billUtils'

interface Props { invoice: Invoice }

const BillTemplate1 = forwardRef<HTMLDivElement, Props>(({ invoice }, ref) => (
  <div ref={ref}>
    <style>{PRINT_STYLES}</style>

    <div style={{ width: '90%', margin: '0 auto', fontFamily: "'Poppins', sans-serif", fontSize: '13px', color: '#231F20' }}>

      {/* Header banner */}
      <img src="/banners/bill1-header.svg" alt="Rawal Autos" style={{ width: '100%', display: 'block' }} />

      {/* Invoice meta */}
      <table style={{ width: '100%', marginTop: '16px', borderCollapse: 'collapse' }}>
        <tbody>
          <tr>
            <td style={{ width: '50%', verticalAlign: 'top', paddingBottom: '8px' }}>
              <p style={{ borderBottom: '0.5px solid #888', paddingBottom: '3px', marginBottom: '4px' }}>
                <strong>Invoice No:</strong>&nbsp;
                <span style={{ color: '#0044cc' }}>{invoice.custom_id}</span>
              </p>
              <p style={{ borderBottom: '0.5px solid #888', paddingBottom: '3px' }}>
                <strong>To:</strong>&nbsp;{invoice.dept_name}
              </p>
            </td>
            <td style={{ width: '50%', verticalAlign: 'top', textAlign: 'right', fontSize: '13px' }}>
              <p style={{ borderBottom: '0.5px solid #888', paddingBottom: '3px', marginBottom: '4px' }}>
                Date:&nbsp;<strong>{formatDate(invoice.invoice_date)}</strong>
              </p>
              <p style={{ borderBottom: '0.5px solid #888', paddingBottom: '3px', marginBottom: '4px' }}>
                <strong>Vehicle No:</strong>&nbsp;{invoice.vehicle_number}
              </p>
              <p style={{ borderBottom: '0.5px solid #888', paddingBottom: '3px' }}>
                <strong>Vehicle Type:</strong>&nbsp;{invoice.vehicle_type}
              </p>
            </td>
          </tr>
        </tbody>
      </table>

      {/* Items table */}
      <table style={{ width: '100%', marginTop: '16px', borderCollapse: 'collapse', fontSize: '13px' }}>
        <thead>
          <tr style={{ background: '#f3f4f6' }}>
            <th style={thStyle}>#</th>
            <th style={{ ...thStyle, textAlign: 'left' }}>Particular</th>
            <th style={thStyle}>Quantity</th>
            <th style={{ ...thStyle, textAlign: 'left' }}>Total</th>
          </tr>
        </thead>
        <tbody>
          {invoice.items.map((item, i) => (
            <tr key={item.id}>
              <td style={tdCenter}>{i + 1}</td>
              <td style={tdLeft}>{item.descp}</td>
              <td style={tdCenter}>{item.quantity}</td>
              <td style={tdLeft}>Rs. {Number(item.total_price).toLocaleString()}/-</td>
            </tr>
          ))}
          {/* Totals row */}
          <tr>
            <td style={tdCenter}></td>
            <td colSpan={2} style={{ ...tdLeft, color: '#0044cc', fontWeight: 600 }}>
              {numberToWords(invoice.total_bill)} Rupees Only
            </td>
            <td style={{ ...tdLeft, color: '#0044cc', fontWeight: 700 }}>
              Rs. {invoice.total_bill.toLocaleString()}/-
            </td>
          </tr>
        </tbody>
      </table>

      {/* Vendor info */}
      <div style={{ marginTop: '20px', fontSize: '11px', color: '#555', lineHeight: '1.7' }}>
        <span>Vendor No: 30021379</span><br />
        <span>NTN: 1218638-4</span><br />
        <span>STR No: 0701870815373</span><br />
        <span>A/C No: 001000506690012</span><br />
        <span>Allied Bank Ltd.</span><br />
        <span>Civic Center G-6 Islamabad</span>
      </div>
    </div>
  </div>
))

const thStyle: React.CSSProperties = {
  border: '0.5px solid #aaa',
  padding: '6px 8px',
  textAlign: 'center',
  fontWeight: 600,
  fontSize: '12px',
}
const tdCenter: React.CSSProperties = {
  border: '0.5px solid #aaa',
  padding: '5px 8px',
  textAlign: 'center',
}
const tdLeft: React.CSSProperties = {
  border: '0.5px solid #aaa',
  padding: '5px 8px',
  textAlign: 'left',
}

BillTemplate1.displayName = 'BillTemplate1'
export default BillTemplate1
