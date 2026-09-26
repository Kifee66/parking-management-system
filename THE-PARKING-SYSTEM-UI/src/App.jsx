import { useCallback, useEffect, useMemo, useState } from 'react'
import DashboardSummary from './components/DashboardSummary'
import ParkingGrid from './components/ParkingGrid'
import VehicleEntryForm from './components/VehicleEntryForm'
import VehicleExitPanel from './components/VehicleExitPanel'
import BarrierSimulation from './components/BarrierSimulation'
import HistoryTable from './components/HistoryTable'
import {
  registerVehicle,
  calculateDuration,
  calculateParkingFee,
  processPayment,
  findParkedVehicle,
} from './algorithms/parkingSystem'
import { supabase } from './lib/supabase'

function App() {
  const [slots, setSlots] = useState([])
  const [vehicles, setVehicles] = useState([])
  const [transactions, setTransactions] = useState([])
  const [selectedSlot, setSelectedSlot] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [barrierState, setBarrierState] = useState('CLOSED')
  const [paymentStatus, setPaymentStatus] = useState('PENDING')
  const [submitting, setSubmitting] = useState(false)
  const [processingExit, setProcessingExit] = useState(false)
  const [notice, setNotice] = useState('System ready for vehicle entry.')

  useEffect(() => {
    const loadParkingData = async () => {
      if (!supabase) {
        setNotice('Supabase is not configured yet. Add your environment variables.')
        return
      }

      try {
        const [slotsResponse, vehiclesResponse, transactionsResponse] = await Promise.all([
          supabase.from('parking_slots').select('*').order('slot_number', { ascending: true }),
          supabase.from('vehicles').select('*').order('created_at', { ascending: false }),
          supabase.from('parking_transactions').select('*').order('created_at', { ascending: false }),
        ])

        if (slotsResponse.error) throw slotsResponse.error
        if (vehiclesResponse.error) throw vehiclesResponse.error
        if (transactionsResponse.error) throw transactionsResponse.error

        const nextSlots = (slotsResponse.data ?? []).map((slot) => ({
          id: slot.slot_id,
          slotNumber: slot.slot_number,
          status: slot.status || 'AVAILABLE',
          vehicleId: slot.vehicle_id,
        }))

        const occupiedVehicleIds = new Set(
          nextSlots.filter((slot) => slot.status === 'OCCUPIED' && slot.vehicleId).map((slot) => slot.vehicleId),
        )

        const nextVehicles = (vehiclesResponse.data ?? []).map((vehicle) => ({
          id: vehicle.vehicle_id,
          registrationNo: vehicle.registration_no,
          vehicleType: vehicle.vehicle_type,
          ownerName: vehicle.owner_name,
          phoneNumber: vehicle.phone_number || 'Not provided',
          entryTime: vehicle.created_at,
          slotNumber: nextSlots.find((slot) => slot.vehicleId === vehicle.vehicle_id)?.slotNumber || 'N/A',
          status: occupiedVehicleIds.has(vehicle.vehicle_id) ? 'Parked' : 'Exited',
          paymentStatus: 'PENDING',
        }))

        const nextTransactions = (transactionsResponse.data ?? []).map((transaction) => ({
          id: transaction.transaction_id,
          registrationNo: nextVehicles.find((vehicle) => vehicle.id === transaction.vehicle_id)?.registrationNo || 'Unknown',
          slot: nextSlots.find((slot) => slot.id === transaction.slot_id)?.slotNumber || 'N/A',
          entryTime: transaction.entry_time,
          exitTime: transaction.exit_time,
          durationMinutes: transaction.duration_minutes || 0,
          amountDue: Number(transaction.amount_due || 0),
          paymentStatus: transaction.payment_status,
          vehicleType: nextVehicles.find((vehicle) => vehicle.id === transaction.vehicle_id)?.vehicleType || 'Car',
        }))

        setSlots(nextSlots)
        setVehicles(nextVehicles)
        setTransactions(nextTransactions)
        setNotice('Parking data loaded from Supabase.')
      } catch (error) {
        setNotice(error.message || 'Unable to load parking data from Supabase.')
      }
    }

    loadParkingData()
  }, [])

  const availableSlots = useMemo(
    () => slots.filter((slot) => slot.status === 'AVAILABLE').length,
    [slots],
  )
  const occupiedSlots = useMemo(
    () => slots.filter((slot) => slot.status === 'OCCUPIED').length,
    [slots],
  )
  const totalSlots = slots.length
  const todayRevenue = useMemo(
    () => transactions.reduce((sum, item) => sum + Number(item.amountDue || 0), 0),
    [transactions],
  )

  const handleVehicleEntry = async (formData) => {
    try {
      setSubmitting(true)

      if (!supabase) {
        setNotice('Supabase is not configured. Add your environment variables first.')
        return
      }

      const { vehicle, slot } = registerVehicle(formData, slots, vehicles)

      const { data: newVehicle, error: vehicleInsertError } = await supabase
        .from('vehicles')
        .insert({
          registration_no: vehicle.registrationNo,
          vehicle_type: vehicle.vehicleType,
          owner_name: vehicle.ownerName,
          phone_number: vehicle.phoneNumber,
        })
        .select()
        .single()

      if (vehicleInsertError) {
        throw vehicleInsertError
      }

      const { error: slotUpdateError } = await supabase
        .from('parking_slots')
        .update({
          status: 'OCCUPIED',
          vehicle_id: newVehicle.vehicle_id,
          updated_at: new Date().toISOString(),
        })
        .eq('slot_number', slot.slotNumber)

      if (slotUpdateError) {
        throw slotUpdateError
      }

      const savedVehicle = {
        ...vehicle,
        id: newVehicle.vehicle_id,
        entryTime: newVehicle.created_at || vehicle.entryTime,
      }

      setSlots((currentSlots) =>
        currentSlots.map((item) =>
          item.slotNumber === slot.slotNumber
            ? { ...item, status: 'OCCUPIED', vehicleId: savedVehicle.id }
            : item,
        ),
      )

      setVehicles((currentVehicles) => [...currentVehicles, savedVehicle])
      setSelectedSlot({ ...slot, status: 'OCCUPIED', vehicleId: savedVehicle.id })
      setNotice(`Vehicle ${savedVehicle.registrationNo} assigned to slot ${savedVehicle.slotNumber}.`)
      setBarrierState('CLOSED')
      setPaymentStatus('PENDING')
    } catch (error) {
      setNotice(error.message || 'Unable to register vehicle in the database.')
    } finally {
      setSubmitting(false)
    }
  }

  const findVehicleForExit = useCallback(() => {
    const vehicle = findParkedVehicle(vehicles, searchTerm)
    if (!vehicle) {
      return null
    }

    const slot = slots.find((item) => item.slotNumber === vehicle.slotNumber)
    const durationMinutes = calculateDuration(vehicle.entryTime, new Date().toISOString())
    const amountDue = calculateParkingFee(durationMinutes, vehicle.vehicleType)

    return {
      ...vehicle,
      slotNumber: slot?.slotNumber || vehicle.slotNumber,
      durationMinutes,
      amountDue,
    }
  }, [searchTerm, slots, vehicles])

  const handleVehicleExit = async () => {
    if (!searchTerm.trim()) {
      setNotice('Enter a registration number first.')
      return
    }

    try {
      setProcessingExit(true)

      if (!supabase) {
        setNotice('Supabase is not configured. Add your environment variables first.')
        return
      }

      const foundVehicle = findVehicleForExit()
      if (!foundVehicle) {
        setNotice('Vehicle not found or already exited.')
        return
      }

      const { data: slotRecord, error: slotLookupError } = await supabase
        .from('parking_slots')
        .select('*')
        .eq('slot_number', foundVehicle.slotNumber)
        .single()

      if (slotLookupError) {
        throw slotLookupError
      }

      const { error: slotUpdateError } = await supabase
        .from('parking_slots')
        .update({
          status: 'AVAILABLE',
          vehicle_id: null,
          updated_at: new Date().toISOString(),
        })
        .eq('slot_number', foundVehicle.slotNumber)

      if (slotUpdateError) {
        throw slotUpdateError
      }

      const { error: transactionInsertError } = await supabase.from('parking_transactions').insert({
        vehicle_id: foundVehicle.id,
        slot_id: slotRecord.slot_id,
        entry_time: foundVehicle.entryTime,
        exit_time: new Date().toISOString(),
        duration_minutes: foundVehicle.durationMinutes,
        amount_due: foundVehicle.amountDue,
        payment_status: 'PAID',
        payment_time: new Date().toISOString(),
      })

      if (transactionInsertError) {
        throw transactionInsertError
      }

      setPaymentStatus('PAID')
      setBarrierState('OPEN')

      const updatedVehicle = processPayment({
        ...foundVehicle,
        paymentStatus: 'PAID',
      })

      setVehicles((currentVehicles) =>
        currentVehicles.map((vehicle) =>
          vehicle.id === updatedVehicle.id
            ? { ...vehicle, status: 'Exited', paymentStatus: 'PAID' }
            : vehicle,
        ),
      )

      setSlots((currentSlots) =>
        currentSlots.map((slot) =>
          slot.slotNumber === foundVehicle.slotNumber
            ? { ...slot, status: 'AVAILABLE', vehicleId: null }
            : slot,
        ),
      )

      setTransactions((currentTransactions) => [
        {
          id: `txn-${Date.now()}`,
          registrationNo: foundVehicle.registrationNo,
          slot: foundVehicle.slotNumber,
          entryTime: foundVehicle.entryTime,
          exitTime: new Date().toISOString(),
          durationMinutes: foundVehicle.durationMinutes,
          amountDue: foundVehicle.amountDue,
          paymentStatus: 'PAID',
          vehicleType: foundVehicle.vehicleType,
        },
        ...currentTransactions,
      ])

      setNotice(`Payment confirmed. Barrier opened for ${foundVehicle.registrationNo}.`)
      setSelectedSlot(null)
      setTimeout(() => {
        setBarrierState('VEHICLE EXITED')
        setPaymentStatus('PAID')
      }, 700)
    } catch (error) {
      setNotice(error.message || 'Unable to complete vehicle exit.')
      setBarrierState('PAYMENT REQUIRED')
      setPaymentStatus('FAILED')
    } finally {
      setProcessingExit(false)
    }
  }

  const exitVehicleRecord = useMemo(() => {
    if (!searchTerm.trim()) return null
    return findVehicleForExit()
  }, [searchTerm, findVehicleForExit])

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800">
      <div className="mx-auto max-w-7xl p-4 md:p-8">
        <header className="mb-6 flex flex-col gap-3 rounded-3xl bg-slate-900 p-6 text-white shadow-lg md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-sky-300">DSA Project</p>
            <h1 className="mt-2 text-3xl font-bold">Smart Parking Management System</h1>
          </div>
          <div className="rounded-xl border border-sky-500/40 bg-sky-500/10 px-4 py-2 text-sm text-sky-100">
            {notice}
          </div>
        </header>

        <DashboardSummary
          totalSlots={totalSlots}
          availableSlots={availableSlots}
          occupiedSlots={occupiedSlots}
          revenue={todayRevenue}
        />

        <div className="mt-6 grid gap-6 xl:grid-cols-[1.5fr_0.9fr]">
          <ParkingGrid slots={slots} selectedSlot={selectedSlot} onSelectSlot={setSelectedSlot} />
          <div className="space-y-6">
            <VehicleEntryForm slots={slots} onSubmit={handleVehicleEntry} submitting={submitting} />
            <BarrierSimulation barrierState={barrierState} paymentStatus={paymentStatus} />
          </div>
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900">Vehicle Exit</h2>

            <div className="mt-4 flex gap-3">
              <input
                type="text"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search by registration number"
                className="flex-1 rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 outline-none focus:border-sky-500 focus:bg-white"
              />
              <button
                type="button"
                onClick={() => setSearchTerm(searchTerm.trim())}
                className="rounded-xl bg-slate-700 px-4 py-2 font-medium text-white hover:bg-slate-800"
              >
                Search
              </button>
            </div>

            {exitVehicleRecord && (
              <div className="mt-5 space-y-3 text-sm text-slate-700">
                <div className="grid gap-2 sm:grid-cols-2">
                  <div><span className="font-semibold">Registration:</span> {exitVehicleRecord.registrationNo}</div>
                  <div><span className="font-semibold">Vehicle Type:</span> {exitVehicleRecord.vehicleType}</div>
                  <div><span className="font-semibold">Assigned Slot:</span> {exitVehicleRecord.slotNumber}</div>
                  <div><span className="font-semibold">Entry Time:</span> {new Date(exitVehicleRecord.entryTime).toLocaleString()}</div>
                  <div><span className="font-semibold">Parking Duration:</span> {exitVehicleRecord.durationMinutes} minutes</div>
                  <div><span className="font-semibold">Amount Due:</span> KES {exitVehicleRecord.amountDue.toLocaleString()}</div>
                </div>
                <button
                  type="button"
                  onClick={handleVehicleExit}
                  disabled={processingExit}
                  className="mt-3 w-full rounded-xl bg-emerald-600 px-4 py-3 font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                >
                  {processingExit ? 'Processing...' : 'Confirm Payment & Open Barrier'}
                </button>
              </div>
            )}
          </div>

          <VehicleExitPanel
            vehicle={exitVehicleRecord}
            onExit={handleVehicleExit}
            loading={processingExit}
          />
        </div>

        <div className="mt-6">
          <HistoryTable transactions={transactions} />
        </div>
      </div>
    </div>
  )
}

export default App
