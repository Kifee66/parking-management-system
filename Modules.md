MODULES FOR THE PARKING MANAGEMENT SYSTEM

Critical Analysis of the Client Requirements
The client requires a system that provides a visual display of parking availability, records vehicles on arrival, calculates parking duration on exit, computes the amount payable, and opens the barrier only after payment has been made. These requirements show that the system must not only store vehicle data but also manage real-time allocation, payment logic, and exit control. Therefore, the parking system must be designed as a set of connected modules instead of a single program. Each module performs a specific task, and together they form a complete and automated parking management system.

The following modules are proposed to meet all the requirements of the ToR.

Module 1 — Parking Availability Display
This module shows drivers the current number of free parking slots before they enter the facility. It displays the parking status visually so that users can determine whether the car park is full or has space available. This helps reduce congestion, improve customer experience, and prevent unnecessary waiting.

Module 2 — Vehicle Registration / Entry Management
This module records each vehicle as it arrives at the parking lot. It captures relevant details such as registration number, vehicle type, driver or owner details, and entry time. It also checks whether the vehicle is already in the system before allowing entry.

Module 3 — Parking Slot Allocation
This module searches for an available slot and assigns it to the incoming vehicle. It updates the slot status from AVAILABLE to OCCUPIED and stores the mapping between the vehicle and slot. This module ensures that vehicles are parked in a safe and organized manner.

Module 4 — Parking Time Tracking
This module records the time a vehicle enters the parking lot and the time it leaves. It calculates the total time spent in the parking area, usually in hours or minutes. This information is essential for billing and for producing accurate transaction records.

Module 5 — Billing and Payment Calculation
This module calculates the amount owed based on the vehicle type and the duration of parking. It retrieves the appropriate parking rate, multiplies it by the chargeable time, and displays the total amount due. It also records the payment status and ensures that fees are paid before the vehicle exits.

Module 6 — Exit Barrier Control
This module controls the barrier at the exit point. It checks whether payment has been completed successfully. If the payment is confirmed, the barrier opens to allow the car to leave; otherwise, the barrier remains closed and the driver is asked to pay the required amount.

Module 7 — Slot Release and Parking Completion
This module handles the release of a parking slot when a vehicle exits. It updates the slot status from OCCUPIED to AVAILABLE and clears the vehicle assignment from that slot. It also refreshes the parking display so the next driver can see the updated availability.

Module 8 — Dynamic Parking Records / Database Management
This module manages all data related to vehicles, parking slots, transactions, payments, and rates. It stores information permanently and updates it in real time as vehicles enter, park, pay, and leave. This module supports reporting, audit trails, and efficient system management.

These eight modules work together as one integrated system to satisfy the client’s requirements: visual display of available slots, vehicle entry recording, automatic duration calculation, fee calculation at exit, payment control, barrier operation, and dynamic database management.