DATA STRUCTURES AND THEIR USE IN THE PARKING SYSTEM

The parking system requires data structures that can store, search, update, and retrieve information efficiently. Different modules use different structures depending on the operation required.

| Data Structure | Used In Module | Reason for Use |
| --- | --- | --- |
| Array/List | Parking Availability Display, Slot Allocation | A parking lot contains a fixed number of slots, so an array or list is suitable for storing slot IDs, slot numbers, and status values such as AVAILABLE or OCCUPIED. |
| Hash Table / Dictionary | Vehicle Registration and Lookup | Registration numbers are unique, so a hash table allows very fast lookup and prevents duplicate vehicle records. |
| Queue | Waiting Vehicles / Full Parking Management | A queue works on FIFO principle and is useful when vehicles arrive while the parking lot is full. It keeps them in order for processing when a slot becomes available. |
| Record / Structure / Class | Vehicle Information | A record combines related items such as vehicle_id, registration_no, vehicle_type, owner_name, and phone_number into one manageable unit. |
| Linked List (optional) | Dynamic Slot and Transaction Records | A linked list can be used when records need to be inserted or removed dynamically without shifting the entire structure. |
| Database Table | All Modules | The database provides persistent storage for vehicles, slots, transactions, rates, and payments so data remains available even after program termination. |

Reasons for Choosing These Structures
1. Arrays and lists are simple and efficient for storing parking slots because the total number of slots is known.
2. Hash tables provide quick access to vehicles using registration number, which is important when checking repeated entries.
3. Queues maintain fairness and order when vehicles are waiting for space.
4. Records and objects make the system easier to model and manage.
5. A database ensures permanent storage, dynamic updating, and retrieval of records.

In summary, the system combines both memory-based structures for fast processing and a database for permanent storage. This makes the design efficient, reliable, and suitable for a real parking environment.

Complexity Considerations
- Searching for a free slot in an array may take O(n) in the worst case.
- Looking up a vehicle by registration number in a hash table is usually O(1).
- Queue operations are efficient: enqueue and dequeue are O(1).
- Database operations are slower than memory operations but necessary for reliability and persistence.

This combination of structures ensures the system remains efficient while supporting real-time operation and data integrity.
