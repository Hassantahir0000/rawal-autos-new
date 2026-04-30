import type { InvoiceItem } from '../types'

const GST_LABELS: Record<string, number> = {
  'GST Applied (17%)': 17,
  'GST Applied (18%)': 18,
  'GST Applied (16%)': 16,
  'GST Applied (15%)': 15,
  'GST Applied (5%)': 5,
}

export interface Bill2Row {
  item: InvoiceItem
  exclTax: number | null
  rate: number | null
  taxAmount: number | null
  inclTax: number | null
  isGst: boolean
  isNil: boolean
}

export function computeBill2Rows(items: InvoiceItem[]): Bill2Row[] {
  // Find the index of each GST row
  const gstIndices = items
    .map((item, i) => (GST_LABELS[item.descp] ? i : -1))
    .filter(i => i >= 0)

  const lastGstIndex = gstIndices.length > 0 ? Math.max(...gstIndices) : -1

  let runningTotal = 0
  return items.map((item, i) => {
    const rate = GST_LABELS[item.descp]
    if (rate) {
      // GST row — value excl tax = total accumulated BEFORE this row
      const exclTax = runningTotal
      const taxAmount = Number(item.total_price)
      runningTotal += taxAmount
      return {
        item, exclTax, rate, taxAmount,
        inclTax: exclTax + taxAmount,
        isGst: true, isNil: false,
      }
    } else if (i > lastGstIndex && lastGstIndex >= 0) {
      // NIL item — normal item appearing after all GST rows
      const itemTotal = Number(item.total_price)
      runningTotal += itemTotal
      return {
        item,
        exclTax: itemTotal,
        rate: 0,       // NIL
        taxAmount: 0,
        inclTax: itemTotal,
        isGst: false, isNil: true,
      }
    } else {
      // Regular item before any GST row — blank in tax columns
      runningTotal += Number(item.total_price)
      return {
        item, exclTax: null, rate: null, taxAmount: null, inclTax: null,
        isGst: false, isNil: false,
      }
    }
  })
}

export function computeBill2Totals(rows: Bill2Row[]) {
  let totalExcl = 0, totalTax = 0, totalIncl = 0
  rows.forEach(r => {
    if (r.isGst) {
      totalExcl += r.exclTax ?? 0
      totalTax  += r.taxAmount ?? 0
      totalIncl += r.inclTax ?? 0
    } else if (r.isNil) {
      totalExcl += r.exclTax ?? 0
      totalIncl += r.inclTax ?? 0
    }
  })
  return { totalExcl, totalTax, totalIncl }
}

export function applyMarkup(items: InvoiceItem[], pct: number): { items: InvoiceItem[]; total: number } {
  const factor = 1 + pct / 100
  const adjusted = items.map(item => ({
    ...item,
    unit_price: item.unit_price * factor,
    total_price: item.total_price * factor,
  }))
  const total = adjusted.reduce((s, it) => s + it.total_price, 0)
  return { items: adjusted, total }
}

// Shared print page styles injected into the hidden print area
export const PRINT_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');
  * { margin: 0; padding: 0; box-sizing: border-box; font-family: 'Poppins', sans-serif; }
  table { border-collapse: collapse; width: 100%; }
  @page { margin: 12mm; size: A4; }
  body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
`
