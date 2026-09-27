ALGORITHMS FOR THE PARKING MANAGEMENT SYSTEM

The following algorithms represent the main logic for each module in the parking system. They are designed to solve the client’s requirements in a clear, step-by-step manner.

MODULE 1: PARKING AVAILABILITY DISPLAY
ALGORITHM DISPLAY_AVAILABILITY
START
    1. Retrieve all parking slot records.
    2. Set AVAILABLE_COUNT ← 0.
    3. Set OCCUPIED_COUNT ← 0.
    4. FOR each slot in the parking list DO
           IF slot.status = "AVAILABLE" THEN
               Display slot number as AVAILABLE.
               AVAILABLE_COUNT ← AVAILABLE_COUNT + 1.
           ELSE
               Display slot number as OCCUPIED.
               OCCUPIED_COUNT ← OCCUPIED_COUNT + 1.
           END IF
       END FOR
    5. Display total available slots.
    6. Display total occupied slots.
END

MODULE 2: VEHICLE REGISTRATION / ENTRY
ALGORITHM VEHICLE_ENTRY
START
    1. Check whether any parking slot is available.
    2. IF no slot is available THEN
           Display "Parking Full".
           STOP.
       END IF
    3. Read vehicle registration number.
    4. Search the vehicle database for the registration number.
    5. IF vehicle already exists THEN
           Display "Vehicle already registered in the system".
           STOP.
       END IF
    6. Read vehicle type, owner name, and contact details.
    7. Set ENTRY_TIME ← current system time.
    8. Create a new vehicle record.
    9. Send vehicle data to the slot allocation module.
    10. Save the record in the database.
    11. Display "Vehicle entered successfully".
END

MODULE 3: PARKING SLOT ALLOCATION
ALGORITHM ALLOCATE_SLOT
START
    1. Search the list of parking slots.
    2. Find the first slot whose status is AVAILABLE.
    3. IF no such slot exists THEN
           Return "Parking Full".
       ELSE
           Assign the slot to the vehicle.
           Update slot.status ← "OCCUPIED".
           Store vehicle_id in the assigned slot record.
       END IF
    4. Update the slot information in the database.
    5. Return assigned slot number.
END

MODULE 4: PARKING TIME TRACKING
ALGORITHM CALCULATE_PARKING_TIME
START
    1. Retrieve ENTRY_TIME for the vehicle from the transaction record.
    2. Set EXIT_TIME ← current system time.
    3. PARKING_DURATION ← EXIT_TIME - ENTRY_TIME.
    4. Convert the duration into minutes or hours as required.
    5. Return PARKING_DURATION.
END

MODULE 5: BILLING AND PAYMENT CALCULATION
ALGORITHM CALCULATE_PAYMENT
START
    1. Receive PARKING_DURATION.
    2. Determine the vehicle type.
    3. Retrieve the corresponding parking rate.
    4. Calculate BILLABLE_HOURS.
    5. AMOUNT ← BILLABLE_HOURS × PARKING_RATE.
    6. Display the amount payable.
    7. Receive payment confirmation.
    8. IF payment is successful THEN
           Mark payment_status as "PAID".
           Save payment time.
           Send confirmation to exit barrier module.
       ELSE
           Display "Payment unsuccessful".
           Keep barrier closed.
       END IF
END

MODULE 6: EXIT BARRIER CONTROL
ALGORITHM EXIT_BARRIER
START
    1. Receive payment status from payment module.
    2. IF payment status = "PAID" THEN
           Open exit barrier.
           Allow vehicle to leave.
           Wait until the vehicle has passed.
           Close exit barrier.
       ELSE
           Keep barrier closed.
           Display "Payment required".
       END IF
END

MODULE 7: SLOT RELEASE AND PARKING COMPLETION
ALGORITHM RELEASE_SLOT
START
    1. Identify the parking slot assigned to the vehicle.
    2. Change slot.status from "OCCUPIED" to "AVAILABLE".
    3. Remove the vehicle_id from that slot record.
    4. Update the parking slot database.
    5. Refresh the parking availability display.
    6. Mark the transaction as completed.
END

MODULE 8: DYNAMIC DATABASE MANAGEMENT
ALGORITHM UPDATE_DATABASE
START
    1. Receive system events such as entry, payment, exit, or slot release.
    2. Update the relevant table in the database.
    3. Save transaction details, payment details, and slot status.
    4. Ensure the latest status is available for the display module.
    5. Return confirmation of successful update.
END

These algorithms form the logic required to automate the parking process from arrival to exit.

-- You can get the site hosted on vercel using the link "https://parking-system-pi-indol.vercel.app"