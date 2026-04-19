# DMS Project - Documentation & Comments Guide

## 📋 Overview
This guide provides the commenting standards and examples for the Hyundai Dealer Management System (DMS) project. All developers should follow these conventions when adding or updating code.

---

## 🎯 Commenting Principles

### DO:
✅ Add class-level comments explaining the purpose  
✅ Document method parameters and return values  
✅ Comment complex business logic  
✅ Use professional, concise language  
✅ Follow standard JavaDoc/JSDoc format  

### DON'T:
❌ State the obvious (e.g., `// Set name` for `setName()`)  
❌ Add redundant comments  
❌ Write essays - keep it concise  
❌ Leave outdated comments  
❌ Comment every single line  

---

## 📚 Backend (Java/Spring Boot)

### Controller Comments

```java
/**
 * Controller for managing vehicle inventory operations.
 * Handles CRUD operations, filtering, pagination, and status updates for vehicles.
 * 
 * @author DMS Team
 * @version 1.0
 */
@RestController
@RequestMapping("/api/vehicles")
@RequiredArgsConstructor
public class VehicleController {

    private final VehicleService vehicleService;
    private final VehicleRepository vehicleRepository;

    /**
     * Creates a new vehicle in the inventory.
     * 
     * @param request Vehicle details including VIN, model, variant, color, price
     * @return Created vehicle with generated ID
     */
    @PostMapping
    public ResponseEntity<ApiResponse<VehicleResponse>> add(@Valid @RequestBody VehicleRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(vehicleService.addVehicle(request)));
    }

    /**
     * Retrieves a specific vehicle by its ID.
     * 
     * @param id Vehicle ID
     * @return Vehicle details if found
     * @throws ResourceNotFoundException if vehicle doesn't exist
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<VehicleResponse>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(vehicleService.getVehicleById(id)));
    }

    /**
     * Retrieves all vehicles with optional filtering and pagination.
     * Supports filtering by dealership, status, color, year.
     * Supports pagination with custom sorting.
     * 
     * @param search Optional search keyword
     * @param dealershipId Optional dealership filter
     * @param status Optional vehicle status filter (IN_SHOWROOM, BOOKED, etc.)
     * @param color Optional color filter
     * @param year Optional manufacturing year filter
     * @param page Page number for pagination (0-indexed)
     * @param size Number of items per page (default: 20)
     * @param sort Field to sort by (default: sellingPrice)
     * @param dir Sort direction: asc or desc (default: asc)
     * @return Paginated list of vehicles or flat list if page is null
     */
    @GetMapping
    public ResponseEntity<?> getAll(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Long dealershipId,
            @RequestParam(required = false) VehicleStatus status,
            @RequestParam(required = false) String color,
            @RequestParam(required = false) Integer year,
            @RequestParam(required = false) Integer page,
            @RequestParam(required = false, defaultValue = "20") int size,
            @RequestParam(required = false, defaultValue = "sellingPrice") String sort,
            @RequestParam(required = false, defaultValue = "asc") String dir) {

        // Paginated response when page parameter is provided
        if (page != null) {
            Sort.Direction direction = "desc".equalsIgnoreCase(dir) 
                    ? Sort.Direction.DESC 
                    : Sort.Direction.ASC;
            Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sort));

            // Apply filters based on provided parameters
            Page<Vehicle> vehiclePage;
            if (dealershipId != null && status != null) {
                vehiclePage = vehicleRepository.findByDealershipDealershipIdAndStatus(
                        dealershipId, status, pageable);
            } else if (dealershipId != null) {
                vehiclePage = vehicleRepository.findByDealershipDealershipId(
                        dealershipId, pageable);
            } else if (status != null) {
                vehiclePage = vehicleRepository.findByStatus(status, pageable);
            } else {
                vehiclePage = vehicleRepository.findAll(pageable);
            }

            PagedResponse<VehicleResponse> paged = PagedResponse.of(
                    vehiclePage.map(VehicleMapper::toResponse));
            return ResponseEntity.ok(ApiResponse.success(paged));
        }

        // Legacy flat-list response for backward compatibility
        List<Vehicle> vehicles = fetchVehiclesWithFilters(
                search, dealershipId, status);

        // Apply additional filters
        if (color != null) {
            vehicles = vehicles.stream()
                    .filter(v -> v.getColor().equalsIgnoreCase(color))
                    .collect(Collectors.toList());
        }
        if (year != null) {
            vehicles = vehicles.stream()
                    .filter(v -> v.getManufacturingYear().equals(year))
                    .collect(Collectors.toList());
        }

        List<VehicleResponse> responses = vehicles.stream()
                .map(VehicleMapper::toResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.success(responses));
    }

    /**
     * Updates the status of a vehicle (e.g., IN_SHOWROOM to BOOKED).
     * 
     * @param id Vehicle ID
     * @param status New status to set
     * @return Updated vehicle details
     */
    @PatchMapping("/{id}/status")
    public ResponseEntity<ApiResponse<VehicleResponse>> updateStatus(
            @PathVariable Long id,
            @RequestParam VehicleStatus status) {
        return ResponseEntity.ok(ApiResponse.success(
                vehicleService.updateVehicleStatus(id, status)));
    }

    /**
     * Deletes a vehicle from the inventory.
     * 
     * @param id Vehicle ID to delete
     * @return 204 No Content on success
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        vehicleService.deleteVehicle(id);
        return ResponseEntity.noContent().build();
    }
}
```

### Service Comments

```java
/**
 * Service implementation for vehicle management operations.
 * Handles business logic for vehicle CRUD, status updates, and filtering.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class VehicleServiceImpl implements VehicleService {

    private final VehicleRepository vehicleRepository;
    private final DealershipRepository dealershipRepository;
    private final VehicleVariantRepository variantRepository;

    /**
     * Adds a new vehicle to the inventory.
     * Validates dealership and variant existence before creating.
     * 
     * @param request Vehicle creation request with all required fields
     * @return Created vehicle response with generated ID
     * @throws ResourceNotFoundException if dealership or variant not found
     */
    @Override
    @Transactional
    public VehicleResponse addVehicle(VehicleRequest request) {
        log.info("Adding new vehicle: VIN={}, Model={}", 
                request.getVin(), request.getModel());

        // Validate dealership exists
        Dealership dealership = dealershipRepository.findById(request.getDealershipId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Dealership not found with id: " + request.getDealershipId()));

        // Validate variant exists
        VehicleVariant variant = variantRepository.findById(request.getVariantId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Variant not found with id: " + request.getVariantId()));

        // Create and save vehicle
        Vehicle vehicle = new Vehicle();
        mapRequestToEntity(request, vehicle, dealership, variant);
        vehicle = vehicleRepository.save(vehicle);

        log.info("Vehicle added successfully: id={}, VIN={}", 
                vehicle.getVehicleId(), vehicle.getVin());
        return mapToResponse(vehicle);
    }

    /**
     * Maps request DTO to vehicle entity.
     * Helper method to reduce code duplication.
     * 
     * @param request Source request DTO
     * @param vehicle Target entity
     * @param dealership Associated dealership
     * @param variant Associated variant
     */
    private void mapRequestToEntity(VehicleRequest request, Vehicle vehicle,
                                    Dealership dealership, VehicleVariant variant) {
        vehicle.setVin(request.getVin());
        vehicle.setModel(request.getModel());
        vehicle.setVariant(variant);
        vehicle.setColor(request.getColor());
        vehicle.setManufacturingYear(request.getManufacturingYear());
        vehicle.setSellingPrice(request.getSellingPrice());
        vehicle.setDealership(dealership);
        vehicle.setStatus(VehicleStatus.IN_STOCKYARD);
    }
}
```

### DTO Comments

```java
/**
 * Request DTO for creating or updating a vehicle.
 * Contains all required fields for vehicle registration.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class VehicleRequest {

    /**
     * Vehicle Identification Number (VIN).
     * Must be unique across the system.
     */
    @NotBlank(message = "VIN is required")
    @Size(min = 17, max = 17, message = "VIN must be exactly 17 characters")
    private String vin;

    /**
     * Vehicle model name (e.g., "Creta", "Venue", "Verna").
     */
    @NotBlank(message = "Model is required")
    private String model;

    /**
     * ID of the vehicle variant.
     * References the VehicleVariant entity.
     */
    @NotNull(message = "Variant ID is required")
    private Long variantId;

    /**
     * Vehicle color (e.g., "White", "Black", "Silver").
     */
    @NotBlank(message = "Color is required")
    private String color;

    /**
     * Manufacturing year (e.g., 2024, 2025).
     */
    @NotNull(message = "Manufacturing year is required")
    @Min(value = 2000, message = "Year must be 2000 or later")
    @Max(value = 2100, message = "Year must be 2100 or earlier")
    private Integer manufacturingYear;

    /**
     * Selling price in INR.
     */
    @NotNull(message = "Selling price is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Price must be greater than 0")
    private BigDecimal sellingPrice;

    /**
     * ID of the dealership owning this vehicle.
     */
    @NotNull(message = "Dealership ID is required")
    private Long dealershipId;
}
```

### Entity Comments

```java
/**
 * Entity representing a vehicle in the inventory.
 * Tracks vehicle details, status, location, and associations.
 */
@Entity
@Table(name = "vehicles")
@Data
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class Vehicle {

    /**
     * Primary key - auto-generated vehicle ID.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long vehicleId;

    /**
     * Vehicle Identification Number (VIN) - unique identifier.
     */
    @Column(unique = true, nullable = false, length = 17)
    private String vin;

    /**
     * Vehicle model name (e.g., "Creta", "Venue").
     */
    @Column(nullable = false)
    private String model;

    /**
     * Current status of the vehicle in the sales pipeline.
     */
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private VehicleStatus status;

    /**
     * Associated dealership owning this vehicle.
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "dealership_id", nullable = false)
    private Dealership dealership;

    /**
     * Timestamp when the vehicle was created in the system.
     */
    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    /**
     * Timestamp when the vehicle was last updated.
     */
    @LastModifiedDate
    private LocalDateTime updatedAt;
}
```

---

## 🎨 Frontend (React/JavaScript)

### Page Component Comments

```javascript
/**
 * Dashboard page component displaying key metrics and analytics.
 * Shows KPIs, sales charts, recent bookings, and upcoming test drives.
 * 
 * Features:
 * - Real-time KPI cards (vehicles, bookings, revenue)
 * - Monthly sales trend chart
 * - Inventory status pie chart
 * - Recent bookings table
 * - Today's test drives list
 * 
 * @component
 */
const Dashboard = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  /**
   * Fetches dashboard KPI data from the backend.
   * Includes total vehicles, bookings today, deliveries, and revenue.
   */
  const { data: kpiData, isLoading: kpiLoading } = useQuery({
    queryKey: ['dashboard-kpi'],
    queryFn: dashboardService.getKPIData,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  /**
   * Fetches monthly sales data for the trend chart.
   * Returns sales count and revenue for the last 6 months.
   */
  const { data: monthlySales, isLoading: salesLoading } = useQuery({
    queryKey: ['monthly-sales'],
    queryFn: dashboardService.getMonthlySales,
  });

  /**
   * Handles manual refresh of all dashboard data.
   * Invalidates all queries to force refetch.
   */
  const handleRefresh = () => {
    queryClient.invalidateQueries(['dashboard-kpi']);
    queryClient.invalidateQueries(['monthly-sales']);
    queryClient.invalidateQueries(['inventory-status']);
  };

  // Show loading state while data is being fetched
  if (kpiLoading || salesLoading) {
    return <SkeletonLoader />;
  }

  return (
    <div className="dashboard-container">
      {/* KPI Cards Section */}
      <div className="kpi-grid">
        <KPICard
          title="Total Vehicles"
          value={kpiData?.totalVehicles || 0}
          icon={<Car />}
          trend={kpiData?.vehiclesTrend}
        />
        {/* More KPI cards... */}
      </div>

      {/* Charts Section */}
      <div className="charts-grid">
        <SalesChart data={monthlySales} />
        <InventoryChart data={inventoryStatus} />
      </div>

      {/* Recent Activity Section */}
      <div className="activity-section">
        <RecentBookings />
        <TodayTestDrives />
      </div>
    </div>
  );
};

export default Dashboard;
```

### Service Comments

```javascript
/**
 * Service for vehicle-related API operations.
 * Handles all HTTP requests for vehicle management.
 */
export const vehicleService = {
  /**
   * Retrieves all vehicles with optional filtering and pagination.
   * 
   * @param {Object} filters - Filter criteria
   * @param {string} filters.search - Search keyword
   * @param {number} filters.dealershipId - Dealership ID filter
   * @param {string} filters.status - Vehicle status filter
   * @param {number} filters.page - Page number (0-indexed)
   * @param {number} filters.size - Items per page
   * @param {string} filters.sort - Sort field
   * @param {string} filters.dir - Sort direction (asc/desc)
   * @returns {Promise<ApiResponse>} Paginated vehicle list
   */
  getAllVehicles: async (filters = {}) => {
    const params = new URLSearchParams();
    
    // Add filters to query string
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== '' && value !== null && value !== undefined) {
        params.append(key, value);
      }
    });
    
    const response = await axiosInstance.get(`/vehicles?${params}`);
    return response.data;
  },

  /**
   * Retrieves a specific vehicle by ID.
   * 
   * @param {number} id - Vehicle ID
   * @returns {Promise<ApiResponse>} Vehicle details
   * @throws {Error} If vehicle not found (404)
   */
  getVehicleById: async (id) => {
    const response = await axiosInstance.get(`/vehicles/${id}`);
    return response.data;
  },

  /**
   * Creates a new vehicle in the inventory.
   * 
   * @param {Object} vehicleData - Vehicle details
   * @param {string} vehicleData.vin - Vehicle VIN (17 characters)
   * @param {string} vehicleData.model - Model name
   * @param {number} vehicleData.variantId - Variant ID
   * @param {string} vehicleData.color - Vehicle color
   * @param {number} vehicleData.manufacturingYear - Year
   * @param {number} vehicleData.sellingPrice - Price in INR
   * @param {number} vehicleData.dealershipId - Dealership ID
   * @returns {Promise<ApiResponse>} Created vehicle
   * @throws {Error} If validation fails (400)
   */
  createVehicle: async (vehicleData) => {
    const response = await axiosInstance.post('/vehicles', vehicleData);
    return response.data;
  },

  /**
   * Updates vehicle status (e.g., IN_SHOWROOM to BOOKED).
   * 
   * @param {number} id - Vehicle ID
   * @param {string} status - New status (VehicleStatus enum)
   * @returns {Promise<ApiResponse>} Updated vehicle
   */
  updateVehicleStatus: async (id, status) => {
    const params = new URLSearchParams({ status });
    const response = await axiosInstance.patch(`/vehicles/${id}/status?${params}`);
    return response.data;
  },

  /**
   * Deletes a vehicle from the inventory.
   * 
   * @param {number} id - Vehicle ID to delete
   * @returns {Promise<void>} No content on success
   */
  deleteVehicle: async (id) => {
    await axiosInstance.delete(`/vehicles/${id}`);
    return { success: true };
  },
};
```

### Component Comments

```javascript
/**
 * Reusable modal component for displaying content in an overlay.
 * Supports different sizes, custom titles, and close handlers.
 * 
 * @component
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Controls modal visibility
 * @param {Function} props.onClose - Callback when modal is closed
 * @param {string} props.title - Modal title text
 * @param {string} props.size - Modal size: 'sm', 'md', 'lg', 'xl' (default: 'md')
 * @param {ReactNode} props.children - Modal content
 * 
 * @example
 * <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Add Vehicle" size="lg">
 *   <VehicleForm onSubmit={handleSubmit} />
 * </Modal>
 */
const Modal = ({ isOpen, onClose, title, size = 'md', children }) => {
  /**
   * Handles escape key press to close modal.
   * Adds/removes event listener based on modal state.
   */
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Don't render if modal is closed
  if (!isOpen) return null;

  /**
   * Handles click on backdrop to close modal.
   * Prevents closing when clicking inside modal content.
   */
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleBackdropClick}>
      <div className={`modal-content modal-${size}`}>
        <div className="modal-header">
          <h2>{title}</h2>
          <button onClick={onClose} className="modal-close">
            <X />
          </button>
        </div>
        <div className="modal-body">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
```

### Hook Comments

```javascript
/**
 * Custom hook for managing form toast notifications.
 * Provides success, error, and info toast messages with auto-dismiss.
 * 
 * @returns {Object} Toast state and control functions
 * @returns {Object} return.toast - Current toast object {message, type}
 * @returns {Function} return.showSuccess - Show success toast
 * @returns {Function} return.showError - Show error toast
 * @returns {Function} return.showInfo - Show info toast
 * @returns {Function} return.clearToast - Manually clear toast
 * 
 * @example
 * const { showSuccess, showError } = useFormToast();
 * 
 * try {
 *   await saveData();
 *   showSuccess('Data saved successfully!');
 * } catch (error) {
 *   showError('Failed to save data');
 * }
 */
export const useFormToast = () => {
  const [toast, setToast] = useState(null);

  /**
   * Shows a success toast message.
   * Auto-dismisses after 3 seconds.
   * 
   * @param {string} message - Success message to display
   */
  const showSuccess = (message) => {
    setToast({ message, type: 'success' });
    setTimeout(() => setToast(null), 3000);
  };

  /**
   * Shows an error toast message.
   * Auto-dismisses after 5 seconds (longer for errors).
   * 
   * @param {string} message - Error message to display
   */
  const showError = (message) => {
    setToast({ message, type: 'error' });
    setTimeout(() => setToast(null), 5000);
  };

  /**
   * Shows an info toast message.
   * Auto-dismisses after 3 seconds.
   * 
   * @param {string} message - Info message to display
   */
  const showInfo = (message) => {
    setToast({ message, type: 'info' });
    setTimeout(() => setToast(null), 3000);
  };

  /**
   * Manually clears the current toast.
   * Useful for dismissing toast before auto-dismiss timer.
   */
  const clearToast = () => {
    setToast(null);
  };

  return { toast, showSuccess, showError, showInfo, clearToast };
};
```

---

## 📝 Comment Templates

### Java Class Template
```java
/**
 * [Brief description of what this class does].
 * [Additional context if needed].
 * 
 * @author [Team Name]
 * @version 1.0
 * @since [Date or Version]
 */
```

### Java Method Template
```java
/**
 * [What the method does].
 * [Additional details about behavior].
 * 
 * @param paramName [Description of parameter]
 * @return [Description of return value]
 * @throws ExceptionType [When this exception is thrown]
 */
```

### JavaScript Function Template
```javascript
/**
 * [What the function does].
 * [Additional details about behavior].
 * 
 * @param {Type} paramName - [Description of parameter]
 * @returns {Type} [Description of return value]
 * @throws {Error} [When error is thrown]
 * 
 * @example
 * const result = functionName(param);
 */
```

### React Component Template
```javascript
/**
 * [Component description and purpose].
 * [Key features or behavior].
 * 
 * @component
 * @param {Object} props - Component props
 * @param {Type} props.propName - [Description]
 * 
 * @example
 * <ComponentName prop1="value" prop2={data} />
 */
```

---

## 🔍 Complex Logic Comments

### When to Add Inline Comments:

**✅ DO Comment:**
- Complex algorithms or calculations
- Non-obvious business rules
- Workarounds or temporary solutions
- Performance optimizations
- Security-related code

**❌ DON'T Comment:**
- Self-explanatory code
- Standard patterns
- Simple assignments
- Obvious conditionals

### Examples:

**Good Inline Comment:**
```java
// Calculate discount based on tiered pricing:
// 0-5 vehicles: 0% discount
// 6-10 vehicles: 5% discount
// 11+ vehicles: 10% discount
BigDecimal discount = calculateTieredDiscount(quantity);
```

**Bad Inline Comment:**
```java
// Set the name
user.setName(name); // ❌ Obvious, don't comment
```

**Good Complex Logic Comment:**
```javascript
// Filter vehicles by multiple criteria with priority:
// 1. Status must match if provided
// 2. Then filter by dealership if provided
// 3. Finally apply search keyword across model, VIN, and color
const filteredVehicles = vehicles
  .filter(v => !status || v.status === status)
  .filter(v => !dealershipId || v.dealershipId === dealershipId)
  .filter(v => !search || 
    v.model.includes(search) || 
    v.vin.includes(search) || 
    v.color.includes(search)
  );
```

---

## 📊 Documentation Status

### Backend:
- ✅ Controllers: 15/20 documented
- ⏳ Services: 0/15 documented
- ⏳ DTOs: 0/40 documented
- ⏳ Entities: 0/15 documented
- ⏳ Repositories: 0/15 documented

### Frontend:
- ⏳ Pages: 0/13 documented
- ⏳ Components: 0/50 documented
- ⏳ Services: 0/12 documented
- ⏳ Hooks: 0/5 documented
- ⏳ Utils: 0/5 documented

---

## 🎯 Next Steps

1. Complete remaining 5 backend controllers
2. Document all service implementations
3. Add comments to DTOs and entities
4. Document frontend pages
5. Add comments to reusable components
6. Document services and hooks
7. Review and update existing comments

---

**Last Updated:** April 15, 2026  
**Maintained By:** DMS Development Team
