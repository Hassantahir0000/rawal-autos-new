import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import AppLayout from './components/layout/AppLayout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import CreateBill from './pages/CreateBill'
import BillHistory from './pages/BillHistory'
import Departments from './pages/Departments'
import Ledger from './pages/Ledger'
import CancelledBills from './pages/CancelledBills'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="create-bill" element={<CreateBill />} />
          <Route path="bill-history" element={<BillHistory />} />
          <Route path="departments" element={<Departments />} />
          <Route path="ledger" element={<Ledger />} />
          <Route path="cancelled" element={<CancelledBills />} />
        </Route>
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
