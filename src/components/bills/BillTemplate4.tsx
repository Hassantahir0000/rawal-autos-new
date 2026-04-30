import { forwardRef } from 'react'
import type { Invoice } from '../../types'
import { formatDate } from '../../lib/utils'
import { applyMarkup, PRINT_STYLES } from '../../lib/billUtils'

interface Props { invoice: Invoice }

const BillTemplate4 = forwardRef<HTMLDivElement, Props>(({ invoice }, ref) => {
  const pct = invoice.bill4_value ?? 0
  const { items: adjustedItems, total } = pct > 0
    ? applyMarkup(invoice.items, pct)
    : { items: invoice.items, total: invoice.total_bill }

  return (
    <div ref={ref}>
      <style>{PRINT_STYLES}</style>

      <div style={{ width: '75%', margin: '0 auto', fontFamily: "'Poppins', sans-serif", fontSize: '13px', color: '#231F20' }}>

        {/* Header banner */}
        <img src="/banners/bill4-header.png" alt="Green Traders" style={{ width: '100%', display: 'block', marginBottom: '12px' }} />

        {/* Meta row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
          <div>
            <p style={{ marginBottom: '4px' }}>
              <strong>Invoice No:</strong>&nbsp;
              <span style={{ color: '#0044cc' }}>{invoice.b4_id ?? invoice.custom_id}</span>
            </p>
            <p><strong>To:</strong>&nbsp;{invoice.dept_name}</p>
          </div>
          <div style={{ textAlign: 'right', fontSize: '13px' }}>
            <p style={{ marginBottom: '4px' }}>Date:&nbsp;<strong>{formatDate(invoice.invoice_date)}</strong></p>
            <p style={{ marginBottom: '4px' }}><strong>Vehicle No:</strong>&nbsp;{invoice.vehicle_number}</p>
            <p><strong>Vehicle Type:</strong>&nbsp;{invoice.vehicle_type}</p>
          </div>
        </div>

        {/* Items table */}
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
          <thead>
            <tr style={{ background: '#f3f4f6' }}>
              <th style={thStyle}>#</th>
              <th style={{ ...thStyle, textAlign: 'left' }}>Particular</th>
              <th style={{ ...thStyle, textAlign: 'right' }}>Total</th>
            </tr>
          </thead>
          <tbody>
            {adjustedItems.map((item, i) => (
              <tr key={item.id}>
                <td style={tdCenter}>{i + 1}</td>
                <td style={tdLeft}>{item.descp}</td>
                <td style={tdRight}>Rs. {Math.round(item.total_price).toLocaleString()}</td>
              </tr>
            ))}
            <tr>
              <td colSpan={2} style={{ ...tdRight, fontWeight: 700 }}>Total</td>
              <td style={{ ...tdRight, color: '#0044cc', fontWeight: 700 }}>
                Rs. {Math.round(total).toLocaleString()}
              </td>
            </tr>
          </tbody>
        </table>

        {pct > 0 && (
          <p style={{ marginTop: '8px', fontSize: '11px', color: '#777' }}>
            * Prices include {pct}% markup
          </p>
        )}
      </div>
    </div>
  )
})

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
const tdRight: React.CSSProperties = {
  border: '0.5px solid #aaa',
  padding: '5px 8px',
  textAlign: 'right',
}

BillTemplate4.displayName = 'BillTemplate4'
export default BillTemplate4
