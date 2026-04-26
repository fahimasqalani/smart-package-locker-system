import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DeliveryService } from './delivery.service';
import { LockerSize } from '../../core/models';

@Component({
  selector: 'app-delivery',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './delivery.component.html',
  styleUrl: './delivery.component.scss'
})
export class DeliveryComponent {
  customerId  = '';
  readonly packageSize = signal<LockerSize | ''>('');

  readonly sizes = [
    { value: 'SMALL' as LockerSize,  dim: '30×30 cm', x: 6,  y: 4, w: 12, h: 16, x2: 18 },
    { value: 'MEDIUM' as LockerSize, dim: '50×50 cm', x: 4,  y: 3, w: 16, h: 18, x2: 20 },
    { value: 'LARGE' as LockerSize,  dim: '80×80 cm', x: 2,  y: 2, w: 20, h: 20, x2: 22 },
  ];

  constructor(readonly svc: DeliveryService) {}

  submit(): void {
    if (!this.customerId.trim() || !this.packageSize()) return;
    this.svc.storePackage(this.packageSize() as LockerSize, this.customerId.trim());
  }

  reset(): void {
    this.svc.reset();
    this.customerId = '';
    this.packageSize.set('');
  }
}
