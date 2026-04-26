import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LockersService, LockerFilter } from './lockers.service';
import { AsVariantPipe } from '../../shared/pipes/as-variant.pipe';
import { StatusBadgeComponent } from '../../shared/components/status-badge/status-badge.component';

const FILTERS: LockerFilter[] = ['ALL', 'AVAILABLE', 'OCCUPIED', 'SMALL', 'MEDIUM', 'LARGE'];

@Component({
  selector: 'app-lockers',
  standalone: true,
  imports: [CommonModule, FormsModule, StatusBadgeComponent, AsVariantPipe],
  templateUrl: './lockers.component.html',
  styleUrl: './lockers.component.scss'
})
export class LockersComponent implements OnInit {
  readonly showForm    = signal(false);
  readonly selectedSize = signal('');
  readonly filters     = FILTERS;
  readonly sizes = [
    { value: 'SMALL',  dim: '30×30 cm', x: 6, y: 4, w: 12, h: 16 },
    { value: 'MEDIUM', dim: '50×50 cm', x: 4, y: 3, w: 16, h: 18 },
    { value: 'LARGE',  dim: '80×80 cm', x: 2, y: 2, w: 20, h: 20 },
  ];

  constructor(readonly svc: LockersService) {}

  ngOnInit(): void { this.svc.load(); }

  submit(): void {
    this.svc.createLocker(this.selectedSize());
    this.selectedSize.set('');
    setTimeout(() => this.showForm.set(false), 1500);
  }
}
