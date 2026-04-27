export interface Department {
  dept_id: number
  dept_name: string
  dept_address: string
  dept_contact: string
}

export interface InvoiceItem {
  id: number
  descp: string
  quantity: number
  unit_price: number
  total_price: number
  gst: number | null
  bill_id: string
}

export interface Invoice {
  id: number
  invoice_id: string
  custom_id?: string
  b4_id?: string
  b5_id?: string
  dept: number
  dept_name: string
  invoice_date: string
  vehicle_number: string
  vehicle_type: string
  odo_meter?: string
  total_bill: number
  bill4_value?: number
  bill5_value?: number
  status: 'active' | 'cancelled'
  items: InvoiceItem[]
}

export interface DashboardStats {
  total_bills: number
  total_bills_amount: number
  total_dept: number
  average_total_bill: number
}

export interface User {
  id: number
  name: string
  email: string
}

export interface MonthlyData {
  month: string
  amount: number
  bills: number
}
