import { Injectable, signal, computed } from '@angular/core';
import { LockerApiService } from '../../core/services/locker-api.service';
import { Package, PackageStatus } from '../../core/models';
import { ApiError } from '../../core/errors/api-error';

export type HistoryFilter = 'ALL' | PackageStatus;

@Injectable({ providedIn: 'root' })
export class HistoryService {
  readonly packages    = signal<Package[]>([]);
  readonly filter      = signal<HistoryFilter>('ALL');
  readonly searchTerm  = signal('');
  readonly loading     = signal(false);

  readonly storedCount    = computed(() => this.packages().filter(p => p.status === 'STORED').length);
  readonly retrievedCount = computed(() => this.packages().filter(p => p.status === 'RETRIEVED').length);

  readonly filtered = computed(() => {
    const f    = this.filter();
    const term = this.searchTerm().toLowerCase();
    return this.packages().filter(p => {
      const matchFilter = f === 'ALL' || p.status === f;
      const matchSearch = !term ||
        p.customerId.toLowerCase().includes(term) ||
        p.id.toLowerCase().includes(term) ||
        p.pickupCode.toLowerCase().includes(term);
      return matchFilter && matchSearch;
    });
  });

  constructor(private api: LockerApiService) {}

  load(): void {
    this.loading.set(true);
    this.api.getPackages().subscribe({
      next:  res => { this.packages.set(res.data ?? []); this.loading.set(false); },
      error: err => { this.loading.set(false); console.error((err as ApiError).message); },
    });
  }

  setFilter(f: HistoryFilter): void { this.filter.set(f); }
  setSearch(term: string): void     { this.searchTerm.set(term); }
}
