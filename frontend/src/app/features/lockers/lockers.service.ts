import { Injectable, signal, computed } from '@angular/core';
import { LockerApiService } from '../../core/services/locker-api.service';
import { Locker } from '../../core/models';
import { ApiError } from '../../core/errors/api-error';

export type LockerFilter = 'ALL' | 'AVAILABLE' | 'OCCUPIED' | 'SMALL' | 'MEDIUM' | 'LARGE';

@Injectable({ providedIn: 'root' })
export class LockersService {
  readonly lockers      = signal<Locker[]>([]);
  readonly activeFilter = signal<LockerFilter>('ALL');
  readonly loading      = signal(false);
  readonly error        = signal<string | null>(null);
  readonly successMsg   = signal<string | null>(null);

  readonly filtered = computed(() => {
    const f = this.activeFilter();
    return this.lockers().filter(l => {
      if (f === 'ALL')       return true;
      if (f === 'AVAILABLE') return l.isAvailable;
      if (f === 'OCCUPIED')  return !l.isAvailable;
      return l.size === f;
    });
  });

  constructor(private api: LockerApiService) {}

  load(): void {
    this.api.getLockers().subscribe({
      next:  res  => this.lockers.set(res.data ?? []),
      error: err  => this.error.set((err as ApiError).message),
    });
  }

  setFilter(filter: LockerFilter): void {
    this.activeFilter.set(filter);
  }

  createLocker(size: string): void {
    this.loading.set(true);
    this.error.set(null);
    this.successMsg.set(null);

    this.api.createLocker(size).subscribe({
      next: res => {
        this.loading.set(false);
        if (res.success) {
          this.successMsg.set(`${size} locker created successfully.`);
          this.load();
          setTimeout(() => this.successMsg.set(null), 3000);
        }
      },
      error: err => {
        this.loading.set(false);
        this.error.set((err as ApiError).message);
      },
    });
  }
}
