import { useState, useCallback } from 'react'
import { useForm, useFieldArray, useWatch } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Plus, Trash2, CheckCircle, Loader2 } from 'lucide-react'
import { useDepartments, useLastId, useAddBill } from '../hooks/useApi'

const itemSchema = z.object({
  descp: z.string().min(1, 'Required'),
  quantity: z.coerce.number().min(1, 'Min 1'),
  unit_price: z.coerce.number().min(0, 'Required'),
  gst: z.coerce.number().nullable(),
})

const schema = z.object({
  dept: z.string().min(1, 'Select a department'),
  invoice_date: z.string().min(1, 'Required'),
  vehicle_number: z.string().min(1, 'Required'),
  vehicle_type: z.string().min(1, 'Required'),
  odo_meter: z.string().optional(),
  bill4_value: z.coerce.number().min(0).max(100),
  bill5_value: z.coerce.number().min(0).max(100),
  items: z.array(itemSchema).min(1, 'Add at least one item'),
})
type BillFormData = z.infer<typeof schema>

const GST_RATES = [5, 15, 16, 17, 18]

export default function CreateBill() {
  const [submitted, setSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const { data: deptsData, isLoading: deptsLoading } = useDepartments()
  const { data: lastIdData } = useLastId()
  const addBill = useAddBill()

  const departments = deptsData ?? []
  const nextBillNo = lastIdData ? Number(lastIdData.lastId) + 1 : '—'

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { register, control, handleSubmit, reset, formState: { errors } } = useForm<BillFormData>({
    resolver: zodResolver(schema) as any,
    defaultValues: {
      dept: '',
      invoice_date: new Date().toISOString().split('T')[0],
      vehicle_number: '',
      vehicle_type: '',
      odo_meter: '',
      bill4_value: 0,
      bill5_value: 0,
      items: [{ descp: '', quantity: 1, unit_price: 0, gst: null }],
    },
  })

  const { fields, append, remove } = useFieldArray({ control, name: 'items' })
  const watchedItems = useWatch({ control, name: 'items' })

  const grandTotal = (watchedItems ?? []).reduce((sum: number, item) => {
    return sum + (Number(item.quantity) || 0) * (Number(item.unit_price) || 0)
  }, 0)

  const applyGst = useCallback((rate: number) => {
    const gstAmount = Math.round(grandTotal * rate / 100)
    append({ descp: `GST Applied (${rate}%)`, quantity: 1, unit_price: gstAmount, gst: rate })
  }, [grandTotal, append])

  const onSubmit = async (data: BillFormData) => {
    setSubmitError('')
    const items = data.items.map(item => ({
      descp: item.descp,
      quantity: Number(item.quantity),
      unit_price: Number(item.unit_price),
      total_price: Number(item.quantity) * Number(item.unit_price),
      gst: item.gst != null ? Number(item.gst) : null,
    }))
    const total_bill = items.reduce((sum, item) => sum + item.total_price, 0)

    try {
      await addBill.mutateAsync({
        dept: data.dept,
        invoice_date: data.invoice_date,
        vehicle_number: data.vehicle_number,
        vehicle_type: data.vehicle_type,
        total_bill,
        bill4_value: Number(data.bill4_value),
        bill5_value: Number(data.bill5_value),
        items,
      })
      setSubmitted(true)
    } catch {
      setSubmitError('Failed to submit bill. Please try again.')
    }
  }

  if (submitted) {
    return (
      <div className="p-6 max-w-4xl mx-auto flex flex-col items-center justify-center min-h-96">
        <div className="card p-10 text-center">
          <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-800 mb-2">Bill Submitted!</h2>
          <p className="text-slate-500 mb-6">The invoice has been created successfully.</p>
          <button
            onClick={() => { setSubmitted(false); reset() }}
            className="btn-primary"
          >
            Create Another Bill
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Create New Bill</h1>
        <p className="text-slate-400 text-sm mt-1">
          Bill No: <span className="font-semibold text-blue-600">#{nextBillNo}</span>
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        {submitError && (
          <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-4 py-3">
            {submitError}
          </div>
        )}

        {/* Top Section */}
        <div className="card p-6 mb-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left */}
            <div className="space-y-4">
              <div>
                <label className="form-label">Department</label>
                <select {...register('dept')} className="form-input" disabled={deptsLoading}>
                  <option value="">{deptsLoading ? 'Loading departments...' : 'Select Department'}</option>
                  {departments.map(d => (
                    <option key={d.dept_id} value={d.dept_name}>{d.dept_name}</option>
                  ))}
                </select>
                {errors.dept && <p className="text-xs text-red-500 mt-1">{errors.dept.message}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Bill 4 %</label>
                  <input {...register('bill4_value')} type="number" min="0" max="100" className="form-input" />
                </div>
                <div>
                  <label className="form-label">Bill 5 %</label>
                  <input {...register('bill5_value')} type="number" min="0" max="100" className="form-input" />
                </div>
              </div>
            </div>

            {/* Right */}
            <div className="space-y-4">
              <div>
                <label className="form-label">Date</label>
                <input {...register('invoice_date')} type="date" className="form-input" />
                {errors.invoice_date && <p className="text-xs text-red-500 mt-1">{errors.invoice_date.message}</p>}
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="form-label">Vehicle No.</label>
                  <input {...register('vehicle_number')} type="text" placeholder="e.g. LW-991" className="form-input" />
                  {errors.vehicle_number && <p className="text-xs text-red-500 mt-1">{errors.vehicle_number.message}</p>}
                </div>
                <div>
                  <label className="form-label">Vehicle Type</label>
                  <input {...register('vehicle_type')} type="text" placeholder="e.g. Pickup" className="form-input" />
                </div>
                <div>
                  <label className="form-label">ODO Meter</label>
                  <input {...register('odo_meter')} type="text" placeholder="km" className="form-input" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Items Section */}
        <div className="card mb-5">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="font-semibold text-slate-800">Bill Items</h2>
            <div className="flex gap-2 flex-wrap">
              {GST_RATES.map(rate => (
                <button
                  key={rate}
                  type="button"
                  onClick={() => applyGst(rate)}
                  className="text-xs px-3 py-1.5 bg-slate-100 hover:bg-blue-100 hover:text-blue-700 text-slate-600 rounded-lg font-medium transition-colors"
                >
                  GST {rate}%
                </button>
              ))}
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-12 gap-3 mb-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
              <div className="col-span-1">#</div>
              <div className="col-span-5">Description / Particular</div>
              <div className="col-span-2">Qty</div>
              <div className="col-span-2">Unit Price</div>
              <div className="col-span-1">Total</div>
              <div className="col-span-1"></div>
            </div>

            <div className="space-y-3">
              {fields.map((field, index) => {
                const qty = Number(watchedItems?.[index]?.quantity) || 0
                const price = Number(watchedItems?.[index]?.unit_price) || 0
                const total = qty * price
                return (
                  <div key={field.id} className="grid grid-cols-12 gap-3 items-center">
                    <div className="col-span-1 text-sm text-slate-400 font-medium">{index + 1}</div>
                    <div className="col-span-5">
                      <input
                        {...register(`items.${index}.descp`)}
                        placeholder="Particulars"
                        className="form-input"
                      />
                    </div>
                    <div className="col-span-2">
                      <input {...register(`items.${index}.quantity`)} type="number" min="1" className="form-input" />
                    </div>
                    <div className="col-span-2">
                      <input {...register(`items.${index}.unit_price`)} type="number" min="0" placeholder="0" className="form-input" />
                    </div>
                    <div className="col-span-1 text-sm font-medium text-slate-700">
                      {total.toLocaleString()}
                    </div>
                    <div className="col-span-1 flex justify-end">
                      <button
                        type="button"
                        onClick={() => remove(index)}
                        disabled={fields.length === 1}
                        className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-30"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>

            <button
              type="button"
              onClick={() => append({ descp: '', quantity: 1, unit_price: 0, gst: null })}
              className="mt-4 flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              <Plus className="w-4 h-4" /> Add Item
            </button>

            {errors.items && typeof errors.items === 'object' && 'message' in errors.items && (
              <p className="text-xs text-red-500 mt-2">{(errors.items as { message: string }).message}</p>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 rounded-b-xl flex items-center justify-between">
            <div className="text-xs text-slate-500 leading-relaxed">
              <span className="block">Vendor No: 30021379 | NTN: 1218638-4 | STR: 0701870815373</span>
              <span>A/C: 001000506690012 | Allied Bank Ltd. — Civic Center G-6 Islamabad</span>
            </div>
            <div className="text-right">
              <p className="text-sm text-slate-500">Grand Total</p>
              <p className="text-xl font-bold text-slate-800">Rs. {grandTotal.toLocaleString()}/-</p>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end gap-3">
          <button type="button" onClick={() => reset()} className="btn-secondary">Reset</button>
          <button
            type="submit"
            disabled={addBill.isPending}
            className="btn-primary px-8 flex items-center gap-2 disabled:opacity-60"
          >
            {addBill.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
            Submit Bill
          </button>
        </div>
      </form>
    </div>
  )
}
