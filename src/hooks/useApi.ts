import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../lib/api'
import type { Invoice, InvoiceItem, Department, DashboardStats, MonthlyData } from '../types'
import type { ApiInvoice, ApiInvoiceItem, ApiDepartment, StatsResponse, LedgerEntry } from '../lib/api'

// ─── Normalizers: coerce API strings to correct types ────────────────────────

function normalizeInvoice(raw: ApiInvoice): Invoice {
  return {
    id: raw.id,
    invoice_id: raw.invoice_id,
    custom_id: raw.custom_id,
    b4_id: raw.b4_id,
    b5_id: raw.b5_id,
    dept: raw.dept,
    dept_name: raw.dept_name,
    invoice_date: raw.invoice_date,
    vehicle_number: raw.vehicle_number,
    vehicle_type: raw.vehicle_type,
    odo_meter: raw.odo_meter,
    total_bill: Number(raw.total_bill),
    bill4_value: raw.bill4_value != null ? Number(raw.bill4_value) : 0,
    bill5_value: raw.bill5_value != null ? Number(raw.bill5_value) : 0,
    status: raw.status,
    items: [],
  }
}

function normalizeItem(raw: ApiInvoiceItem): InvoiceItem {
  return {
    id: raw.id,
    descp: raw.descp,
    quantity: Number(raw.quantity),
    unit_price: Number(raw.unit_price),
    total_price: Number(raw.total_price),
    gst: raw.gst != null ? Number(raw.gst) : null,
    bill_id: raw.bill_id,
  }
}

function normalizeDept(raw: ApiDepartment): Department {
  return {
    dept_id: raw.dept_id,
    dept_name: raw.dept_name,
    dept_address: raw.dept_address,
    dept_contact: raw.dept_contact,
  }
}

function normalizeStats(raw: StatsResponse): DashboardStats {
  return {
    total_bills: Number(raw.total_bills),
    total_bills_amount: Number(raw.total_bills_amount),
    total_dept: Number(raw.total_dept),
    average_total_bill: Number(raw.average_total_bill),
  }
}

// ─── Monthly chart data is not in the API — keep mock for now ────────────────
import { mockMonthlyData } from '../data/mock'
export function useMonthlyData(): MonthlyData[] { return mockMonthlyData }

// ─── Dashboard ────────────────────────────────────────────────────────────────

export function useStats() {
  return useQuery({
    queryKey: ['stats'],
    queryFn: async () => {
      const res = await api.getStats()
      // Backend wraps stats in { data: { total_bills, ... } }
      return normalizeStats(res.data)
    },
  })
}

// ─── Bills ────────────────────────────────────────────────────────────────────

export function useAllBills(page = 1, limit = 50) {
  return useQuery({
    queryKey: ['bills', page, limit],
    queryFn: async () => {
      const res = await api.getAllBills(page, limit)
      return {
        data: res.data.map(normalizeInvoice),
        totalPages: res.totalPages,
      }
    },
  })
}

export function useBillDetail(invoice_id: string | null) {
  return useQuery({
    queryKey: ['bill', invoice_id],
    queryFn: async () => {
      const res = await api.getBillDetail(invoice_id!)
      const invoice = normalizeInvoice(res.data[0])
      invoice.items = res.items.map(normalizeItem)
      return invoice
    },
    enabled: !!invoice_id,
  })
}

export function useLastId() {
  return useQuery({
    queryKey: ['lastId'],
    queryFn: async () => {
      const res = await api.getLastId()
      // Backend returns { data: [{ invoice_id: "1234" }], status: boolean }
      const rawId = res.data?.[0]?.invoice_id ?? '0'
      return { lastId: rawId }
    },
    staleTime: 0,
  })
}

export function useAddBill() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: api.addBill,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['bills'] }); qc.invalidateQueries({ queryKey: ['lastId'] }) },
  })
}

export function useCancelBill() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (invoice_id: string) => api.cancelBill(invoice_id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['bills'] }),
  })
}

export function useUpdateBill() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ invoice_id, bill4_value, bill5_value }: { invoice_id: string; bill4_value: number; bill5_value: number }) =>
      api.updateBill(invoice_id, bill4_value, bill5_value),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['bills'] }),
  })
}

export function useUpdateBillId() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ invoice_id, new_id }: { invoice_id: string; new_id: string }) =>
      api.updateBillId(invoice_id, new_id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['bills'] }),
  })
}

export function useCancelledBills() {
  return useQuery({
    queryKey: ['cancelledBills'],
    queryFn: async () => {
      const res = await api.getCancelledBills()
      return res.data.map(normalizeInvoice)
    },
  })
}

// ─── Departments ──────────────────────────────────────────────────────────────

export function useDepartments() {
  return useQuery({
    queryKey: ['departments'],
    queryFn: async () => {
      const res = await api.getDepartments()
      return res.data.map(normalizeDept)
    },
  })
}

export function useAddDepartment() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ dept_name, dept_address, dept_contact }: { dept_name: string; dept_address: string; dept_contact: string }) =>
      api.addDepartment(dept_name, dept_address, dept_contact),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['departments'] }),
  })
}

// ─── Ledger ───────────────────────────────────────────────────────────────────

export function useLedger() {
  return useQuery({
    queryKey: ['ledger'],
    queryFn: async () => {
      const res = await api.getLedger()
      return (res.data as LedgerEntry[]).map(entry => ({
        dept_id: entry.dept_id,
        dept_name: entry.dept_name,
        invoices: (entry.invoices ?? []).map(normalizeInvoice),
        total: Number(entry.total),
      }))
    },
  })
}
