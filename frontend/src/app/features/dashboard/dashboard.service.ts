import { Injectable, signal, computed } from '@angular/core';
import { LockerApiService } from '../../core/services/locker-api.service';
import { Locker, Package, LockerSize } from '../../core/models';

/**
 * DashboardService — owns all data and derived state for the dashboard.
 * The component becomes a pure view, just reading signals.
 */
@Injectable({ providedIn: 'root' })
export class DashboardService {
  // ── State (signals) ───────────────────────────────────────────────
  readonly lockers  = signal<Locker[]>([]);
  readonly packages = signal<Package[]>([]);
  readonly loading  = signal(false);

  // ── Derived state (computed) ──────────────────────────────────────
  readonly totalLockers     = computed(() => this.lockers().length);
  readonly availableLockers = computed(() => this.lockers().filter(l => l.isAvailable).length);
  readonly occupiedLockers  = computed(() => this.lockers().filter(l => !l.isAvailable).length);
  readonly activePackages   = computed(() => this.packages().filter(p => p.status === 'STORED').length);

  readonly recentActivity = computed(() =>
    [...this.packages()]
      .sort((a, b) => new Date(b.storedAt).getTime() - new Date(a.storedAt).getTime())
      .slice(0, 5)
  );

  readonly utilizationBySize = computed(() => {
    const sizes: LockerSize[] = ['SMALL', 'MEDIUM', 'LARGE'];
    return sizes.map(size => {
      const all      = this.lockers().filter(l => l.size === size);
      const occupied = all.filter(l => !l.isAvailable);
      return {
        size,
        total:   all.length,
        occupied: occupied.length,
        pct:     all.length > 0 ? Math.round((occupied.length / all.length) * 100) : 0,
      };
    });
  });

  constructor(private api: LockerApiService) {}

  refresh(): void {
    this.loading.set(true);
    this.api.getLockers().subscribe({
      next: res  => this.lockers.set(res.data ?? []),
      error: () => {},
    });
    this.api.getPackages().subscribe({
      next:  res => { this.packages.set(res.data ?? []); this.loading.set(false); },
      error: () => this.loading.set(false),
    });
  }
}
