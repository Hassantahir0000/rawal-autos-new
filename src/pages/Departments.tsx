import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Building2, Plus, Phone, MapPin, XCircle, Loader2 } from 'lucide-react'
import { useState } from 'react'
import { useDepartments, useAddDepartment } from '../hooks/useApi'

const schema = z.object({
  dept_name: z.string().min(1, 'Department name is required'),
  dept_address: z.string().min(1, 'Address is required'),
  dept_contact: z.string().min(1, 'Contact is required'),
})
type FormData = z.infer<typeof schema>

export default function Departments() {
  const [showModal, setShowModal] = useState(false)

  const { data: departments = [], isLoading } = useDepartments()
  const addDepartment = useAddDepartment()

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    await addDepartment.mutateAsync({
      dept_name: data.dept_name,
      dept_address: data.dept_address,
      dept_contact: data.dept_contact,
    })
    reset()
    setShowModal(false)
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Departments</h1>
          <p className="text-slate-400 text-sm mt-1">{departments.length} departments registered</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Department
        </button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20 text-slate-400 gap-2">
          <Loader2 className="w-5 h-5 animate-spin" /> Loading departments...
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {departments.map((dept, i) => (
            <div key={dept.dept_id} className="card p-5 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-start gap-4">
                <div className="bg-blue-50 rounded-xl p-3 shrink-0">
                  <Building2 className="w-5 h-5 text-blue-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs text-slate-400 font-medium">#{i + 1}</span>
                    <h3 className="font-semibold text-slate-800 text-sm truncate">{dept.dept_name}</h3>
                  </div>
                  <div className="space-y-1.5 mt-2">
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <MapPin className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{dept.dept_address}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <Phone className="w-3.5 h-3.5 shrink-0" />
                      <span>{dept.dept_contact}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Department Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
              <h2 className="font-semibold text-slate-800">Add Department</h2>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
              <div>
                <label className="form-label">Department Name</label>
                <input {...register('dept_name')} type="text" placeholder="e.g. PIMS Hospital" className="form-input" />
                {errors.dept_name && <p className="text-xs text-red-500 mt-1">{errors.dept_name.message}</p>}
              </div>
              <div>
                <label className="form-label">Address</label>
                <input {...register('dept_address')} type="text" placeholder="e.g. G-8, Islamabad" className="form-input" />
                {errors.dept_address && <p className="text-xs text-red-500 mt-1">{errors.dept_address.message}</p>}
              </div>
              <div>
                <label className="form-label">Contact Number</label>
                <input {...register('dept_contact')} type="text" placeholder="e.g. 0519210000" className="form-input" />
                {errors.dept_contact && <p className="text-xs text-red-500 mt-1">{errors.dept_contact.message}</p>}
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => { reset(); setShowModal(false) }} className="btn-secondary">Cancel</button>
                <button
                  type="submit"
                  disabled={addDepartment.isPending}
                  className="btn-primary flex items-center gap-2 disabled:opacity-60"
                >
                  {addDepartment.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                  Save Department
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
