import { z } from 'zod';

// Shared phone pattern
const phoneRegex = /^[6-9]\d{9}$/;
const panRegex = /^[A-Z]{5}\d{4}[A-Z]$/;
const aadharRegex = /^\d{12}$/;
const vinRegex = /^[A-HJ-NPR-Z0-9]{17}$/;
const licenseRegex = /^[A-Z]{2}[0-9]{13}$/;

export const CustomerSchema = z.object({
  firstName: z.string().min(2, 'Minimum 2 characters').max(50, 'Maximum 50 characters').regex(/^[a-zA-Z\s]+$/, 'Only letters and spaces allowed'),
  lastName: z.string().min(2, 'Minimum 2 characters').max(50, 'Maximum 50 characters').regex(/^[a-zA-Z\s]+$/, 'Only letters and spaces allowed'),
  email: z.string().email('Invalid email address').max(100, 'Maximum 100 characters').optional().or(z.literal('')),
  phone: z.string()
    .min(10, 'Phone must be at least 10 digits')
    .transform(val => val.replace(/\s+/g, '').replace(/^(\+91|91|0)/, '').slice(-10))
    .refine(val => /^[6-9]\d{9}$/.test(val), 'Must be a valid Indian mobile number'),
  alternatePhone: z.string()
    .transform(val => val ? val.replace(/\s+/g, '').replace(/^(\+91|91|0)/, '').slice(-10) : '')
    .refine(val => !val || /^[6-9]\d{9}$/.test(val), 'Must be a valid Indian mobile number')
    .optional().or(z.literal('')),
  address: z.string().max(500, 'Maximum 500 characters').optional().or(z.literal('')),
  city: z.string().max(50, 'Max 50 characters').optional().or(z.literal('')),
  state: z.string().max(50, 'Max 50 characters').optional().or(z.literal('')),
  pincode: z.string().regex(/^\d{6}$/, 'Must be a valid 6-digit number').optional().or(z.literal('')),
  dateOfBirth: z.string().optional().or(z.literal('')),
  anniversaryDate: z.string().optional().or(z.literal('')),
  panNumber: z.string()
    .transform(val => val.toUpperCase())
    .refine(val => !val || /^[A-Z]{5}\d{4}[A-Z]$/.test(val), 'Must match ABCDE1234F')
    .optional().or(z.literal('')),
  aadharNumber: z.string().regex(aadharRegex, 'Must be exactly 12 digits').optional().or(z.literal('')),
  drivingLicense: z.string().max(20, 'Max 20 characters').optional().or(z.literal('')),
  customerType: z.enum(['INDIVIDUAL', 'CORPORATE'], { required_error: 'Type is required' }),
  notes: z.string().max(1000, 'Maximum 1000 characters').optional().or(z.literal(''))
}).refine(data => {
  if (data.phone && data.alternatePhone) {
    return data.phone !== data.alternatePhone;
  }
  return true;
}, {
  message: "Alternate phone must be different from primary phone",
  path: ["alternatePhone"]
});

export const VehicleSchema = z.object({
  variantId: z.string().nonempty('Variant is required'),
  vin: z.string().regex(vinRegex, 'Must be exactly 17 characters without I, O, Q'),
  chassisNumber: z.string().min(10, 'Minimum 10 characters').max(30, 'Maximum 30 characters'),
  engineNumber: z.string().min(5, 'Minimum 5 characters').max(30, 'Maximum 30 characters'),
  color: z.string().nonempty('Color is required').max(30, 'Maximum 30 characters'),
  manufacturingYear: z.preprocess((val) => Number(val), z.number().min(2000, 'Year must be 2000 or later').max(2100, 'Max 2100')),
  manufacturingMonth: z.preprocess((val) => Number(val), z.number().min(1, 'Month is required').max(12, 'Invalid month')),
  sellingPrice: z.preprocess((val) => Number(val), z.number().min(1, 'Must be greater than 0')),
  purchasePrice: z.union([z.number(), z.string()]).optional(),
  stockyardId: z.union([z.number(), z.string()]).optional()
});

export const TestDriveSchema = z.object({
  date: z.string().nonempty('Date is required').refine((val) => {
    const selectedDate = new Date(val);
    const todayDate = new Date();
    todayDate.setHours(0, 0, 0, 0);
    return selectedDate >= todayDate;
  }, { message: 'Date must be today or in the future' }),
  time: z.string().nonempty('Time is required')
});

export const BookingSchema = z.object({
  bookingAmount: z.preprocess((val) => Number(val), z.number().min(10000, 'Minimum booking amount is ₹10,000')),
  expectedDeliveryDate: z.string().nonempty('Expected delivery date is required').refine((val) => {
    const selectedDate = new Date(val);
    const todayDate = new Date();
    todayDate.setHours(0, 0, 0, 0);
    return selectedDate >= todayDate;
  }, { message: 'Date must be today or in the future' })
});

export const LoginSchema = z.object({
  email: z.string().nonempty('Email or username is required'),
  password: z.string().nonempty('Password is required')
});

export const AccessorySchema = z.object({
  accessoryName: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name too long'),
  accessoryCode: z.string().regex(/^[A-Z0-9-]+$/, 'Uppercase letters, numbers, and hyphens only'),
  category: z.string().max(50, 'Category too long').optional().or(z.literal('')),
  description: z.string().max(500, 'Description too long').optional().or(z.literal('')),
  price: z.preprocess((val) => Number(val), z.number().min(0.01, 'Price must be greater than 0'))
});

export const VariantSchema = z.object({
  modelId: z.preprocess((val) => Number(val), z.number().positive('Model is required')),
  variantName: z.string().min(2, 'Variant name is required').max(100, 'Name too long'),
  variantCode: z.string().regex(/^[A-Z0-9-]+$/, 'Uppercase letters, numbers, and hyphens only'),
  fuelType: z.enum(['PETROL', 'DIESEL', 'ELECTRIC', 'HYBRID', 'CNG'], { required_error: 'Fuel type is required' }),
  transmission: z.enum(['MANUAL', 'AUTOMATIC', 'AMT', 'CVT', 'DCT'], { required_error: 'Transmission is required' }),
  engineCapacity: z.string().max(20, 'Engine capacity too long').optional().or(z.literal('')),
  seatingCapacity: z.preprocess((val) => Number(val), z.number().min(2, 'Min 2 seats').max(20, 'Max 20 seats')),
  basePrice: z.preprocess((val) => Number(val), z.number().min(0.01, 'Price must be greater than 0')),
  exShowroomPrice: z.preprocess((val) => Number(val), z.number().min(0.01, 'Price must be greater than 0')),
  features: z.string().max(2000, 'Features too long').optional().or(z.literal(''))
});
