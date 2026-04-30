import { forwardRef } from 'react'
import type { Invoice } from '../../types'
import { formatDate, numberToWords } from '../../lib/utils'
import { computeBill2Rows, computeBill2Totals, PRINT_STYLES } from '../../lib/billUtils'

interface Props { invoice: Invoice }

const BillTemplate2 = forwardRef<HTMLDivElement, Props>(({ invoice }, ref) => {
  const rows = computeBill2Rows(invoice.items)
  const { totalExcl, totalTax, totalIncl } = computeBill2Totals(rows)

  return (
    <div ref={ref}>
      <style>{PRINT_STYLES}</style>

      <div style={{ width: '92%', margin: '0 auto', fontFamily: "'Poppins', sans-serif", fontSize: '12px', color: '#231F20' }}>

        {/* Header banner */}
        <img src="/banners/bill2-header.png" alt="Sales Tax Invoice" style={{ width: '100%', display: 'block', marginBottom: '4px' }} />

        {/* Info table (FBR format) */}
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', marginTop: '4px' }}>
          <tbody>
            <tr>
              <td style={infoCell}>Invoice no. <strong style={{ color: '#0044cc' }}>{invoice.custom_id}</strong></td>
              <td style={infoCell}>Date: <strong style={{ color: '#0044cc' }}>{formatDate(invoice.invoice_date)}</strong></td>
              <td style={infoCell}>Time of supply</td>
            </tr>
            <tr>
              <td colSpan={3} style={infoCell}>
                Supplier's name &amp; address &nbsp;<strong style={{ color: '#0044cc' }}>Rawal Autos</strong>
                &nbsp;— Shop # 07, Popular Market, G-6/2, Near CDA Hospital, Islamabad
              </td>
            </tr>
            <tr>
              <td colSpan={3} style={infoCell}>
                Buyer's name &amp; address &nbsp;<strong style={{ color: '#0044cc' }}>{invoice.dept_name}</strong>
              </td>
            </tr>
            <tr>
              <td style={infoCell}>Vendor no. <strong style={{ color: '#0044cc' }}>30021379</strong></td>
              <td style={infoCell}>Vehicle no. <strong style={{ color: '#0044cc' }}>{invoice.vehicle_number}</strong></td>
              <td style={infoCell}>Telephone no.</td>
            </tr>
            <tr>
              <td style={infoCell}>S.T. registration no. <strong style={{ color: '#0044cc' }}>07-018708-153-73</strong></td>
              <td style={infoCell}>N.T.N no. <strong style={{ color: '#0044cc' }}>1218638-4</strong></td>
              <td style={infoCell}>Account no. <strong style={{ color: '#0044cc' }}>0010000506690012 Allied Bank Ltd.</strong></td>
            </tr>
          </tbody>
        </table>

        {/* Items table */}
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', marginTop: '12px' }}>
          <thead>
            <tr style={{ background: '#f3f4f6' }}>
              <th style={thStyle}>#</th>
              <th style={{ ...thStyle, textAlign: 'left' }}>Description</th>
              <th style={{ ...thStyle, textAlign: 'left' }}>Value excl<br />sales tax</th>
              <th style={thStyle}>Rate of<br />sales tax</th>
              <th style={{ ...thStyle, textAlign: 'left' }}>Total sales<br />tax payable</th>
              <th style={{ ...thStyle, textAlign: 'left' }}>Value incl<br />sales tax</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={row.item.id} style={{ background: 'lightyellow' }}>
                <td style={tdCenter}>{i + 1}</td>
                <td style={tdLeft}>{row.item.descp}</td>

                {/* Value excl sales tax */}
                <td style={tdLeft}>
                  {row.isGst
                    ? `Rs. ${(row.exclTax ?? 0).toLocaleString()}-`
                    : row.isNil
                    ? `Rs. ${(row.exclTax ?? 0).toLocaleString()}`
                    : ''}
                </td>

                {/* Rate */}
                <td style={tdCenter}>
                  {row.isGst
                    ? `${row.rate}%`
                    : row.isNil
                    ? 'Nil'
                    : ''}
                </td>

                {/* Total tax payable */}
                <td style={tdLeft}>
                  {row.isGst
                    ? `Rs. ${(row.taxAmount ?? 0).toLocaleString()}`
                    : row.isNil
                    ? 'Nil'
                    : ''}
                </td>

                {/* Value incl sales tax */}
                <td style={tdLeft}>
                  {row.isGst
                    ? `Rs. ${(row.inclTax ?? 0).toLocaleString()}`
                    : row.isNil
                    ? `Rs. ${(row.inclTax ?? 0).toLocaleString()}`
                    : ''}
                </td>
              </tr>
            ))}

            {/* Totals row */}
            <tr>
              <td style={tdCenter}></td>
              <td style={{ ...tdLeft, color: '#0044cc', fontWeight: 600 }}>
                {numberToWords(invoice.total_bill)} Rupees Only
              </td>
              <td style={{ ...tdLeft, color: '#0044cc', fontWeight: 600 }}>
                Rs. {totalExcl.toLocaleString()}/-
              </td>
              <td style={tdCenter}></td>
              <td style={{ ...tdLeft, color: '#0044cc', fontWeight: 600 }}>
                Rs. {totalTax.toLocaleString()}/-
              </td>
              <td style={{ ...tdLeft, color: '#0044cc', fontWeight: 700 }}>
                Rs. {totalIncl.toLocaleString()}/-
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
})

const infoCell: React.CSSProperties = {
  borderBottom: '0.5px solid #999',
  padding: '4px 6px',
  fontSize: '11px',
  textAlign: 'left',
}
const thStyle: React.CSSProperties = {
  border: '0.5px solid #aaa',
  padding: '6px 6px',
  textAlign: 'center',
  fontWeight: 600,
  fontSize: '11px',
}
const tdCenter: React.CSSProperties = {
  border: '0.5px solid #aaa',
  padding: '4px 6px',
  textAlign: 'center',
  fontSize: '12px',
}
const tdLeft: React.CSSProperties = {
  border: '0.5px solid #aaa',
  padding: '4px 6px',
  textAlign: 'left',
  fontSize: '12px',
}

BillTemplate2.displayName = 'BillTemplate2'
export default BillTemplate2
