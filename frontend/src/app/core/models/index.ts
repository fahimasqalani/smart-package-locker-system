export type LockerSize = 'SMALL' | 'MEDIUM' | 'LARGE';
export type PackageStatus = 'STORED' | 'RETRIEVED';

export interface Locker {
  id: string;
  size: LockerSize;
  isAvailable: boolean;
  assignedPackageId: string | null;
  createdAt: string;
}

export interface Package {
  id: string;
  size: LockerSize;
  customerId: string;
  pickupCode: string;
  lockerId: string;
  storedAt: string;
  retrievedAt: string | null;
  status: PackageStatus;
}

export interface StorageChargeTier {
  days: number;
  multiplier: number;
  charge: number;
}

export interface StorageCharge {
  totalDays: number;
  charge: number;
  breakdown: StorageChargeTier[];
  currency: string;
  baseRate: number;
}

// ── API request/response shapes ───────────────────────────────────────────────

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  total?: number;
}

export interface StorePackageRequest {
  packageSize: LockerSize;
  customerId: string;
}

export interface StorePackageResponse {
  success: boolean;
  message: string;
  packageId: string;
  lockerId: string;
  lockerSize: LockerSize;
  pickupCode: string;
  storedAt: string;
  note: string;
}

export interface RetrievePackageRequest {
  lockerId: string;
  pickupCode: string;
}

export interface RetrievePackageResponse {
  success: boolean;
  message: string;
  packageId: string;
  lockerId: string;
  customerId: string;
  storedAt: string;
  retrievedAt: string;
  storageCharge: StorageCharge;
}
