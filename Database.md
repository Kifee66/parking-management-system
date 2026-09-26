DYNAMIC DATABASE DESIGN FOR THE PARKING SYSTEM

A dynamic database is required because the system must continuously update records as vehicles enter, use parking slots, pay for services, and leave the facility. The database must therefore support real-time changes, accurate transaction tracking, and quick retrieval of parking status.

TABLE 1: VEHICLES
vehicle_id          PK
registration_no     UNIQUE
vehicle_type
owner_name
phone_number

Purpose:
This table stores details of all vehicles entering the parking lot. It is useful for customer identification and for ensuring that a vehicle is not registered twice.

TABLE 2: PARKING_SLOTS
slot_id             PK
slot_number         UNIQUE
status
vehicle_id          FK

Purpose:
This table stores the status of every parking slot. A slot may be AVAILABLE or OCCUPIED. It also links each occupied slot to the vehicle currently assigned to it.

TABLE 3: PARKING_TRANSACTIONS
transaction_id      PK
vehicle_id          FK
slot_id             FK
entry_time
exit_time
duration_minutes
amount_due
payment_status
payment_time

Purpose:
This table records each parking session from entry to exit. It stores the duration of stay, amount payable, and whether payment has been completed.

TABLE 4: PARKING_RATES
rate_id             PK
vehicle_type
rate_per_hour

Purpose:
This table stores the rate charged for each type of vehicle, such as car, motorcycle, or truck. This allows the billing module to calculate fees accurately.

Relationship Explanation
- One vehicle can have many parking transactions.
- One slot can be used by many vehicles over different times.
- A vehicle is linked to one slot while parked.
- Each transaction is linked to a vehicle, a slot, and a parking rate.

Why This Database Is Dynamic
The database is dynamic because it changes continuously during system operation. When a vehicle arrives, a new record is added. When a slot is allocated, the status is updated. When a transaction is completed, exit time and payment details are recorded. This keeps the system accurate and current.

This database design satisfies the client requirements by supporting real-time updates, durable records, and proper fee calculation at exit. It also allows the system to provide accurate reporting and management control.