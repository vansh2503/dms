# Requirements Document

## Introduction

This feature provides a permanent, race-condition-free inline customer creation flow within the New Booking form. When a staff member cannot find an existing customer via search, they can create a new customer in a modal without losing any booking form state. After successful creation, the new customer is immediately and reliably selected in the booking form, and the Customers page cache is invalidated so the new record appears there too.

The fix addresses a fragile timing dependency in the current implementation: `SearchableSelect` manages its own `selectedItem` state internally, and the `preselectedItem` prop-to-state sync via `useEffect` can miss the update if the component remounts during modal close animation. The permanent fix lifts customer selection state out of `SearchableSelect` into `NewBookingForm` (controlled mode), eliminating the race condition entirely.

---

## Glossary

- **Booking_Form**: The `NewBookingForm` React component used to create a new vehicle booking.
- **Customer_Search**: The `SearchableSelect` component instance used for customer lookup within the Booking_Form.
- **Add_Customer_Modal**: The modal dialog containing `AddCustomerForm`, opened from within the Booking_Form.
- **AddCustomerForm**: The existing React component used on both the Customers page and within the Add_Customer_Modal.
- **CustomerResponse**: The backend DTO returned by `POST /api/customers`, containing `customerId`, `firstName`, `lastName`, `fullName`, `phone`, `email`, and other fields.
- **ApiResponse**: The backend wrapper type `{ success: boolean, data: T, message: string }` returned by all customer API endpoints.
- **Customer_Cache**: The React Query cache entries keyed by `['customers', ...]` used by the Customers page.
- **Selected_Customer**: The customer object currently chosen in the Booking_Form's customer field, stored as controlled state in `NewBookingForm`.
- **SearchableSelect**: The generic reusable dropdown search component. In controlled mode, it accepts an `value` prop and delegates selection state to the parent.

---

## Requirements

### Requirement 1: Customer Search in Booking Form

**User Story:** As a staff member creating a booking, I want to search for existing customers by name, phone, or email, so that I can quickly associate a booking with the correct customer.

#### Acceptance Criteria

1. WHEN the staff member types 3 or more characters into the customer search field, THE Customer_Search SHALL query the customer API with the entered search term.
2. WHEN the customer API returns results, THE Customer_Search SHALL display each matching customer's full name, phone number, and email address in the dropdown.
3. WHEN the staff member types fewer than 3 characters, THE Customer_Search SHALL NOT issue an API query and SHALL NOT display a results dropdown.
4. WHEN the staff member selects a customer from the dropdown, THE Booking_Form SHALL set the `customerId` form field to the selected customer's `customerId`.
5. WHEN a customer is selected, THE Customer_Search SHALL display a selected-chip showing the customer's `fullName` and `phone`.
6. WHEN the staff member clears the selected customer chip, THE Booking_Form SHALL reset the `customerId` form field to empty.

---

### Requirement 2: "Add New Customer" Option in Dropdown

**User Story:** As a staff member, I want an "Add New Customer" option to appear in the search dropdown, so that I can create a new customer without navigating away from the booking form.

#### Acceptance Criteria

1. WHEN the staff member has typed 3 or more characters and the customer API returns zero results, THE Customer_Search SHALL display an "Add New Customer" action item in the dropdown.
2. WHEN the staff member has typed 3 or more characters and the customer API returns one or more results, THE Customer_Search SHALL display the "Add New Customer" action item below the result list, separated by a divider.
3. WHEN the staff member clicks the "Add New Customer" action item, THE Booking_Form SHALL open the Add_Customer_Modal.
4. WHEN the Add_Customer_Modal opens, THE Customer_Search SHALL close the results dropdown.

---

### Requirement 3: Customer Creation via Modal

**User Story:** As a staff member, I want to create a new customer from within the booking form, so that I can complete a booking for a walk-in customer in a single workflow.

#### Acceptance Criteria

1. THE Add_Customer_Modal SHALL render the AddCustomerForm component, identical to the form used on the Customers page.
2. WHEN the staff member submits the AddCustomerForm with valid data, THE AddCustomerForm SHALL call `POST /api/customers` with the submitted customer data.
3. WHEN `POST /api/customers` returns HTTP 201 with a valid CustomerResponse, THE Add_Customer_Modal SHALL display a success toast for 1200ms before closing.
4. IF `POST /api/customers` returns an error response, THEN THE AddCustomerForm SHALL display the error message and THE Add_Customer_Modal SHALL remain open.
5. IF `POST /api/customers` returns an error response, THEN THE Booking_Form SHALL leave the `customerId` field empty.
6. WHEN the staff member clicks Cancel in the Add_Customer_Modal, THE Add_Customer_Modal SHALL close without modifying any Booking_Form field.

---

### Requirement 4: Reliable Post-Creation Customer Selection

**User Story:** As a staff member, I want the newly created customer to be automatically selected in the booking form after creation, so that I can proceed to complete the booking without extra steps.

#### Acceptance Criteria

1. WHEN `POST /api/customers` returns a valid CustomerResponse, THE Booking_Form SHALL set the `customerId` form field to the returned `customerId` value.
2. WHEN `POST /api/customers` returns a valid CustomerResponse, THE Customer_Search SHALL display a selected-chip showing the customer's `fullName` and `phone`.
3. THE Booking_Form SHALL store the Selected_Customer as controlled state and pass it to Customer_Search as a controlled `value` prop, so that customer selection does not depend on `useEffect` timing or component remount behavior.
4. WHEN the Add_Customer_Modal closes after successful creation, THE Customer_Search SHALL reflect the Selected_Customer without requiring a re-render cycle triggered by prop diffing.
5. WHEN the Add_Customer_Modal closes after successful creation, THE Booking_Form SHALL retain all previously entered values in the `bookingAmount` and `expectedDeliveryDate` fields.

---

### Requirement 5: Customer Cache Invalidation

**User Story:** As a staff member, I want the newly created customer to appear on the Customers page immediately, so that the customer list stays up to date.

#### Acceptance Criteria

1. WHEN `POST /api/customers` returns a valid CustomerResponse, THE Booking_Form SHALL call `queryClient.invalidateQueries({ queryKey: ['customers'] })` using the object-wrapper form required by React Query v5.
2. WHEN the Customer_Cache is invalidated, THE Customers page SHALL re-fetch its customer list on next mount or focus, causing the new customer to appear.
3. THE Customers.jsx `updatePhoneMutation` and `updateEmailMutation` SHALL call `queryClient.invalidateQueries({ queryKey: ['customers'] })` using the object-wrapper form, consistent with React Query v5 API.

---

### Requirement 6: Duplicate Customer Prevention

**User Story:** As a staff member, I want the system to prevent duplicate customers, so that the customer database remains clean and accurate.

#### Acceptance Criteria

1. WHEN a customer creation request is submitted with a phone number that already belongs to an active customer, THE CustomerController SHALL return an error response indicating the phone number is already in use.
2. WHEN a customer creation request is submitted with an email address that already belongs to an active customer, THE CustomerController SHALL return an error response indicating the email address is already in use.
3. WHEN the AddCustomerForm receives a duplicate-phone or duplicate-email error from the API, THE AddCustomerForm SHALL display the specific error message returned by the server.

---

### Requirement 7: Booking Form State Preservation

**User Story:** As a staff member, I want my partially filled booking form to be preserved when I open and close the customer creation modal, so that I don't lose my work.

#### Acceptance Criteria

1. WHEN the Add_Customer_Modal is opened, THE Booking_Form SHALL retain the current values of `bookingAmount`, `expectedDeliveryDate`, and `vehicleId` without modification.
2. WHEN the Add_Customer_Modal is closed (by Cancel or by successful creation), THE Booking_Form SHALL retain the current values of `bookingAmount`, `expectedDeliveryDate`, and `vehicleId` without modification.
3. THE Add_Customer_Modal SHALL be rendered as a child of the Booking_Form using conditional rendering (`isOpen` prop), so that the Booking_Form component is never unmounted during the modal lifecycle.

---

## Correctness Properties

The following properties define the invariants that must hold for this feature to be considered correct. These are suitable for property-based testing.

### Property 1: Customer Selection Invariant

FOR ALL valid CustomerResponse objects `c` returned by `POST /api/customers`:
- `Booking_Form.customerId === c.customerId`
- `Customer_Search` selected-chip text contains `c.fullName`
- `Customer_Search` selected-chip text contains `c.phone`

This property must hold regardless of the timing of modal close animation, React render batching, or component re-render order.

### Property 2: Error Isolation Invariant

FOR ALL error responses `e` returned by `POST /api/customers`:
- `Booking_Form.customerId` remains empty (unchanged from its pre-modal-open value)
- The Add_Customer_Modal remains open
- The AddCustomerForm displays a non-empty error message derived from `e`

### Property 3: Form State Preservation Invariant

FOR ALL partial booking form states `s` (any combination of `bookingAmount`, `expectedDeliveryDate`, `vehicleId` values):
- Opening the Add_Customer_Modal does not change any field in `s`
- Closing the Add_Customer_Modal (Cancel) does not change any field in `s`
- Closing the Add_Customer_Modal (successful creation) does not change `bookingAmount`, `expectedDeliveryDate`, or `vehicleId` in `s`

### Property 4: Search Result Relevance

FOR ALL search strings `q` of length >= 3 passed to the customer search API:
- Every CustomerResponse in the result set must satisfy: `fullName` contains `q` (case-insensitive) OR `phone` contains `q` OR `email` contains `q`

### Property 5: Duplicate Rejection

FOR ALL pairs of CustomerRequest objects `(r1, r2)` where `r1.phone === r2.phone` OR `r1.email === r2.email` (and both emails/phones are non-null):
- IF `r1` was successfully created (HTTP 201), THEN submitting `r2` must return an error response (non-201 status)

### Property 6: Existing Customer Selection Regression

FOR ALL CustomerResponse objects `c` returned by the customer search API:
- Selecting `c` from the dropdown must set `Booking_Form.customerId === c.customerId`
- The selected-chip must display `c.fullName` and `c.phone`

This property must hold after the inline creation feature is added (regression guard).
