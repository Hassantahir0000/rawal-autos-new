import type { Department, Invoice, DashboardStats, MonthlyData } from '../types'

export const mockDepartments: Department[] = [
  { dept_id: 1, dept_name: 'Housing Federation', dept_address: 'Islamabad', dept_contact: '051268634' },
  { dept_id: 2, dept_name: 'Capital Development Authority', dept_address: 'Islamabad', dept_contact: '0517367122' },
  { dept_id: 3, dept_name: 'PIMS Hospital', dept_address: 'PIMS Islamabad', dept_contact: '0517316231' },
  { dept_id: 4, dept_name: 'Test Department', dept_address: 'Test Address', dept_contact: '0512312332' },
  { dept_id: 5, dept_name: 'Ministry of Finance', dept_address: 'F-6, Islamabad', dept_contact: '0519212300' },
]

export const mockInvoices: Invoice[] = [
  {
    id: 1, invoice_id: '1000', custom_id: 'RA-1000', b4_id: 'GT-1000', b5_id: 'CM-1000',
    dept: 1, dept_name: 'Housing Federation',
    invoice_date: '2022-12-10', vehicle_number: 'L3W-221', vehicle_type: 'Sedan',
    odo_meter: '45200', total_bill: 4244, bill4_value: 5, bill5_value: 15, status: 'active',
    items: [
      { id: 1, descp: 'Break Shoes', quantity: 2, unit_price: 2000, total_price: 4000, gst: 244, bill_id: '1000' },
    ],
  },
  {
    id: 2, invoice_id: '1001', custom_id: 'RA-1001', b4_id: 'GT-1001', b5_id: 'CM-1001',
    dept: 2, dept_name: 'Capital Development Authority',
    invoice_date: '2022-05-06', vehicle_number: 'LW-991', vehicle_type: 'Pickup',
    odo_meter: '32000', total_bill: 200, bill4_value: 0, bill5_value: 0, status: 'active',
    items: [
      { id: 2, descp: 'Engine Oil Change', quantity: 1, unit_price: 200, total_price: 200, gst: null, bill_id: '1001' },
    ],
  },
  {
    id: 3, invoice_id: '1002', custom_id: 'RA-1002', b4_id: 'GT-1002', b5_id: 'CM-1002',
    dept: 3, dept_name: 'PIMS Hospital',
    invoice_date: '2022-05-13', vehicle_number: 'LW-998', vehicle_type: 'Pickup',
    odo_meter: '61000', total_bill: 1000, bill4_value: 5, bill5_value: 0, status: 'active',
    items: [
      { id: 3, descp: 'Air Filter', quantity: 1, unit_price: 500, total_price: 500, gst: null, bill_id: '1002' },
      { id: 4, descp: 'Oil Filter', quantity: 1, unit_price: 500, total_price: 500, gst: null, bill_id: '1002' },
    ],
  },
  {
    id: 4, invoice_id: '1003', custom_id: 'RA-1003', b4_id: 'GT-1003', b5_id: 'CM-1003',
    dept: 1, dept_name: 'Housing Federation',
    invoice_date: '2022-05-15', vehicle_number: 'LS-998', vehicle_type: 'Wagon-R',
    odo_meter: '29400', total_bill: 2000, bill4_value: 0, bill5_value: 0, status: 'active',
    items: [
      { id: 5, descp: 'Clutch Plate', quantity: 1, unit_price: 2000, total_price: 2000, gst: null, bill_id: '1003' },
    ],
  },
  {
    id: 5, invoice_id: '1004', custom_id: 'RA-1004', b4_id: 'GT-1004', b5_id: 'CM-1004',
    dept: 3, dept_name: 'PIMS Hospital',
    invoice_date: '2022-05-05', vehicle_number: 'LS-022', vehicle_type: 'Pickup',
    odo_meter: '55000', total_bill: 3000, bill4_value: 5, bill5_value: 15, status: 'active',
    items: [
      { id: 6, descp: 'Wiper Blades', quantity: 2, unit_price: 800, total_price: 1600, gst: null, bill_id: '1004' },
      { id: 7, descp: 'GST Applied (17%)', quantity: 1, unit_price: 1400, total_price: 1400, gst: 17, bill_id: '1004' },
    ],
  },
  {
    id: 6, invoice_id: '1005', custom_id: 'RA-1005', b4_id: 'GT-1005', b5_id: 'CM-1005',
    dept: 2, dept_name: 'Capital Development Authority',
    invoice_date: '2023-01-10', vehicle_number: 'BH-901', vehicle_type: 'SUV',
    odo_meter: '72100', total_bill: 5500, bill4_value: 5, bill5_value: 15, status: 'active',
    items: [
      { id: 8, descp: 'Battery Replacement', quantity: 1, unit_price: 4500, total_price: 4500, gst: null, bill_id: '1005' },
      { id: 9, descp: 'Battery Fitting', quantity: 1, unit_price: 1000, total_price: 1000, gst: null, bill_id: '1005' },
    ],
  },
  {
    id: 7, invoice_id: '1006', custom_id: 'RA-1006', b4_id: 'GT-1006', b5_id: 'CM-1006',
    dept: 5, dept_name: 'Ministry of Finance',
    invoice_date: '2023-02-14', vehicle_number: 'ISD-002', vehicle_type: 'Corolla',
    odo_meter: '88000', total_bill: 7200, bill4_value: 5, bill5_value: 15, status: 'cancelled',
    items: [
      { id: 10, descp: 'Wheel Alignment', quantity: 1, unit_price: 1200, total_price: 1200, gst: null, bill_id: '1006' },
      { id: 11, descp: 'Tyre Rotation', quantity: 4, unit_price: 300, total_price: 1200, gst: null, bill_id: '1006' },
      { id: 12, descp: 'Engine Tune Up', quantity: 1, unit_price: 4800, total_price: 4800, gst: null, bill_id: '1006' },
    ],
  },
]

export const mockStats: DashboardStats = {
  total_bills: mockInvoices.filter(i => i.status === 'active').length,
  total_bills_amount: mockInvoices.filter(i => i.status === 'active').reduce((s, i) => s + i.total_bill, 0),
  total_dept: mockDepartments.length,
  average_total_bill: Math.round(
    mockInvoices.filter(i => i.status === 'active').reduce((s, i) => s + i.total_bill, 0) /
    mockInvoices.filter(i => i.status === 'active').length
  ),
}

export const mockMonthlyData: MonthlyData[] = [
  { month: 'Jan', amount: 8500, bills: 3 },
  { month: 'Feb', amount: 12400, bills: 5 },
  { month: 'Mar', amount: 7200, bills: 2 },
  { month: 'Apr', amount: 15800, bills: 6 },
  { month: 'May', amount: 11200, bills: 4 },
  { month: 'Jun', amount: 9600, bills: 3 },
  { month: 'Jul', amount: 18300, bills: 7 },
  { month: 'Aug', amount: 14100, bills: 5 },
  { month: 'Sep', amount: 10500, bills: 4 },
  { month: 'Oct', amount: 16900, bills: 6 },
  { month: 'Nov', amount: 13200, bills: 5 },
  { month: 'Dec', amount: 21000, bills: 8 },
]

export const mockLedger = mockDepartments.map(dept => ({
  dept_id: dept.dept_id,
  dept_name: dept.dept_name,
  invoices: mockInvoices.filter(i => i.dept === dept.dept_id && i.status === 'active'),
  total: mockInvoices
    .filter(i => i.dept === dept.dept_id && i.status === 'active')
    .reduce((s, i) => s + i.total_bill, 0),
}))
