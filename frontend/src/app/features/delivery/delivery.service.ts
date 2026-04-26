import { Injectable, signal } from '@angular/core';
import { LockerApiService } from '../../core/services/locker-api.service';
import { StorePackageResponse, LockerSize } from '../../core/models';
import { ApiError } from '../../core/errors/api-error';

@Injectable({ providedIn: 'root' })
export class DeliveryService {
  readonly result  = signal<StorePackageResponse | null>(null);
  readonly loading = signal(false);
  readonly error   = signal<string | null>(null);

  constructor(private api: LockerApiService) {}

  storePackage(packageSize: LockerSize, customerId: string): void {
    this.loading.set(true);
    this.error.set(null);
    this.result.set(null);

    this.api.storePackage({ packageSize, customerId }).subscribe({
      next:  res => { this.loading.set(false); this.result.set(res); },
      error: err => { this.loading.set(false); this.error.set((err as ApiError).message); },
    });
  }

  reset(): void {
    this.result.set(null);
    this.error.set(null);
  }
}
