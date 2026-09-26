export const VEHICLE_RATES = {
  Car: 150,
  Motorcycle: 80,
  Truck: 220,
}

export function generateParkingSlots(count = 20) {
  return Array.from({ length: count }, (_, index) => ({
    id: index + 1,
    slotNumber: `A${String(index + 1).padStart(2, '0')}`,
    status: 'AVAILABLE',
    vehicleId: null,
  }))
}

export function findAvailableSlot(slots) {
  return slots.find((slot) => slot.status === 'AVAILABLE') ?? null
}

export function allocateSlot(slots, vehicleId) {
  const slot = findAvailableSlot(slots)

  if (!slot) {
    return null
  }

  slot.status = 'OCCUPIED'
  slot.vehicleId = vehicleId
  return slot
}

export function releaseSlot(slots, slotNumber) {
  const slot = slots.find((item) => item.slotNumber === slotNumber)

  if (!slot) {
    return null
  }

  slot.status = 'AVAILABLE'
  slot.vehicleId = null
  return slot
}

export function findParkedVehicle(vehicles, registrationNo) {
  return vehicles.find(
    (vehicle) =>
      vehicle.registrationNo.trim().toLowerCase() === registrationNo.trim().toLowerCase() &&
      vehicle.status === 'Parked',
  )
}

export function registerVehicle({ registrationNo, vehicleType, ownerName, phoneNumber }, slots, vehicles) {
  const cleanRegistration = registrationNo.trim()
  const cleanOwner = ownerName.trim()

  if (!cleanRegistration) {
    throw new Error('Registration number is required.')
  }

  if (!cleanOwner) {
    throw new Error('Owner or driver name is required.')
  }

  if (!vehicleType || !VEHICLE_RATES[vehicleType]) {
    throw new Error('Invalid vehicle type.')
  }

  const duplicate = findParkedVehicle(vehicles, cleanRegistration)
  if (duplicate) {
    throw new Error('Vehicle already parked.')
  }

  const availableSlot = findAvailableSlot(slots)
  if (!availableSlot) {
    throw new Error('Parking lot is full.')
  }

  const vehicle = {
    id: crypto.randomUUID(),
    registrationNo: cleanRegistration,
    vehicleType,
    ownerName: cleanOwner,
    phoneNumber: phoneNumber?.trim() || 'Not provided',
    entryTime: new Date().toISOString(),
    slotNumber: availableSlot.slotNumber,
    status: 'Parked',
    paymentStatus: 'PENDING',
  }

  const allocated = allocateSlot(slots, vehicle.id)
  if (!allocated) {
    throw new Error('No available slot was found.')
  }

  vehicles.push(vehicle)
  return { vehicle, slot: allocated }
}

export function calculateDuration(entryTime, exitTime) {
  const entry = new Date(entryTime).getTime()
  const exit = new Date(exitTime).getTime()

  if (Number.isNaN(entry) || Number.isNaN(exit) || exit < entry) {
    return 0
  }

  return Math.max(1, Math.ceil((exit - entry) / 60000))
}

export function calculateParkingFee(durationMinutes, vehicleType) {
  const rate = VEHICLE_RATES[vehicleType] ?? VEHICLE_RATES.Car
  const billableHours = Math.max(1, Math.ceil(durationMinutes / 60))
  return billableHours * rate
}

export function processPayment(transaction) {
  if (!transaction) {
    return null
  }

  return {
    ...transaction,
    paymentStatus: 'PAID',
    paymentTime: new Date().toISOString(),
  }
}

export function enqueueVehicle(waitingQueue, registrationNo) {
  const queue = [...waitingQueue]
  queue.push(registrationNo)
  return queue
}
