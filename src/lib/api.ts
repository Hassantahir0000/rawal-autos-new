import { useAuthStore } from '../store/auth'

const BASE_URL = import.meta.env.VITE_API_URL as string

function getHeaders(): HeadersInit {
  const token = useAuthStore.getState().token
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    if (res.status === 401) {
      useAuthStore.getState().logout()
      window.location.href = '/login'
    }
    const body = await res.text()
    throw new Error(body || `HTTP ${res.status}`)
  }
  return res.json() as Promise<T>
}

export async function apiGet<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'GET',
    headers: getHeaders(),
  })
  return handleResponse<T>(res)
}

export async function apiPost<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(body),
  })
  return handleResponse<T>(res)
}

// ─── Response shapes (mirror the backend) ────────────────────────────────────

export interface LoginResponse {
  token: string
  user?: { id: number; name: string; email: string }
}

export interface StatsResponse {
  total_bills: number
  total_bills_amount: number | string
  total_dept: number
  average_total_bill: number | string
}

export interface ApiInvoice {
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
  total_bill: number | string
  bill4_value?: number | null
  bill5_value?: number | null
  status: 'active' | 'cancelled'
}

export interface ApiInvoiceItem {
  id: number
  descp: string
  quantity: number
  unit_price: number | string
  total_price: number | string
  gst: number | string | null
  bill_id: string
}

export interface BillsResponse {
  data: ApiInvoice[]
  totalPages: number
}

export interface BillDetailResponse {
  data: ApiInvoice[]
  items: ApiInvoiceItem[]
}

export interface ApiDepartment {
  dept_id: number
  dept_name: string
  dept_address: string
  dept_contact: string
}

export interface LedgerEntry {
  dept_id: number
  dept_name: string
  invoices: ApiInvoice[]
  total: number | string
}

// ─── API functions ────────────────────────────────────────────────────────────

export const api = {
  // Auth
  login: (email: string, password: string) =>
    apiPost<LoginResponse>('/login', { email, password }),

  // Dashboard
  getStats: () => apiGet<{ data: StatsResponse; status: boolean }>('/getStats'),

  // Bills
  getAllBills: (page = 1, limit = 50) =>
    apiGet<BillsResponse>(`/getAllBills?page=${page}&limit=${limit}`),

  getBillDetail: (invoice_id: string) =>
    apiGet<BillDetailResponse>(`/getbill?invoice_id=${invoice_id}`),

  getLastId: () => apiGet<{ data: Array<{ invoice_id: string }>; status: boolean }>('/lastId'),

  addBill: (payload: {
    dept: string
    invoice_date: string
    vehicle_number: string
    vehicle_type: string
    total_bill: number
    bill4_value: number
    bill5_value: number
    items: { descp: string; quantity: number; unit_price: number; total_price: number; gst: number | null }[]
  }) => apiPost<{ status: boolean; message: string }>('/addBill', payload),

  cancelBill: (invoice_id: string) =>
    apiPost<{ status: boolean }>('/cancelBill', { invoice_id }),

  updateBill: (invoice_id: string, bill4_value: number, bill5_value: number) =>
    apiPost<{ status: boolean }>('/updateBill', { invoice_id, bill4_value, bill5_value }),

  updateBillId: (invoice_id: string, new_id: string) =>
    apiPost<{ status: boolean }>('/update_bill_id', { invoice_id, new_id }),

  getCancelledBills: () => apiGet<{ data: ApiInvoice[] }>('/getCancelBills'),

  // Departments
  getDepartments: () => apiGet<{ data: ApiDepartment[] }>('/getDept'),

  addDepartment: (dept_name: string, dept_address: string, dept_contact: string) =>
    apiPost<{ status: boolean }>('/addDept', { dept_name, dept_address, dept_contact }),

  // Ledger
  getLedger: () => apiGet<{ data: LedgerEntry[] }>('/getLedger'),
}
