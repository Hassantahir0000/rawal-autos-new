import { forwardRef } from 'react'
import type { Invoice } from '../../types'
import { formatDate, numberToWords } from '../../lib/utils'
import { PRINT_STYLES } from '../../lib/billUtils'

interface Props { invoice: Invoice }

const BillTemplate3 = forwardRef<HTMLDivElement, Props>(({ invoice }, ref) => (
  <div ref={ref}>
    <style>{PRINT_STYLES}</style>

    <div style={{ width: '75%', margin: '0 auto', fontFamily: "'Poppins', sans-serif", fontSize: '13px', color: '#231F20' }}>

      {/* Header banner */}
      <img src="/banners/bill3-header.svg" alt="Rawal Autos Quotation" style={{ width: '100%', display: 'block', marginBottom: '12px' }} />

      {/* Quotation meta */}
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '12px' }}>
        <tbody>
          <tr>
            <td style={{ width: '60%', verticalAlign: 'top' }}>
              <p style={{ borderBottom: '0.5px solid #888', paddingBottom: '3px', marginBottom: '4px' }}>
                <strong>Quotation No:</strong>&nbsp;
                <span style={{ color: '#0044cc' }}>{invoice.custom_id}</span>
              </p>
              <p style={{ borderBottom: '0.5px solid #888', paddingBottom: '3px' }}>
                <strong>To:</strong>&nbsp;{invoice.dept_name}
              </p>
            </td>
            <td style={{ width: '40%', verticalAlign: 'top', textAlign: 'right', fontSize: '13px' }}>
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
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
        <thead>
          <tr style={{ background: '#f3f4f6' }}>
            <th style={thStyle}>#</th>
            <th style={{ ...thStyle, textAlign: 'left' }}>Particular</th>
            <th style={{ ...thStyle, textAlign: 'left', width: '20%' }}>Total</th>
          </tr>
        </thead>
        <tbody>
          {invoice.items.map((item, i) => (
            <tr key={item.id}>
              <td style={tdCenter}>{i + 1}</td>
              <td style={tdLeft}>{item.descp}</td>
              <td style={tdLeft}>Rs. {Number(item.total_price).toLocaleString()}</td>
            </tr>
          ))}
          <tr>
            <td style={tdCenter}></td>
            <td style={{ ...tdLeft, color: '#0044cc', fontWeight: 600 }}>
              {numberToWords(invoice.total_bill)} Rupees Only
            </td>
            <td style={{ ...tdLeft, color: '#0044cc', fontWeight: 700 }}>
              Rs. {invoice.total_bill.toLocaleString()}/-
            </td>
          </tr>
        </tbody>
      </table>
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

BillTemplate3.displayName = 'BillTemplate3'
export default BillTemplate3
