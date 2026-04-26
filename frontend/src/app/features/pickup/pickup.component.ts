import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PickupService } from './pickup.service';

@Component({
  selector: 'app-pickup',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pickup.component.html',
  styleUrl: './pickup.component.scss'
})
export class PickupComponent {
  lockerId   = '';
  pickupCode = '';

  constructor(readonly svc: PickupService) {}

  submit(): void {
    if (!this.lockerId.trim() || !this.pickupCode.trim()) return;
    this.svc.retrievePackage(this.lockerId.trim(), this.pickupCode.trim());
  }

  reset(): void {
    this.svc.reset();
    this.lockerId = '';
    this.pickupCode = '';
  }
}
