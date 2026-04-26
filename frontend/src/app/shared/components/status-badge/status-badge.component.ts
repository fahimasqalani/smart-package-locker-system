import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type BadgeVariant = 'available' | 'occupied' | 'stored' | 'retrieved' | 'small' | 'medium' | 'large';

/**
 * StatusBadgeComponent — reusable badge following single-responsibility.
 * Centralises all badge styling in one place so changes propagate everywhere.
 */
@Component({
  selector: 'app-status-badge',
  standalone: true,
  imports: [CommonModule],
  template: `<span class="badge" [class]="variant">{{ label }}</span>`,
  styles: [`
    .badge {
      display: inline-block;
      font-size: 11px;
      font-weight: 600;
      padding: 3px 8px;
      border-radius: 4px;
      white-space: nowrap;
    }
    .available  { background: rgba(34,197,94,.12);  color: #15803d; border-radius: 99px; }
    .occupied   { background: rgba(184,144,10,.12); color: #b8900a; border-radius: 99px; }
    .stored     { background: rgba(184,144,10,.12); color: #b8900a; border-radius: 99px; }
    .retrieved  { background: rgba(34,197,94,.12);  color: #15803d; border-radius: 99px; }
    .small      { background: rgba(59,130,246,.12);  color: #2563eb; }
    .medium     { background: rgba(184,144,10,.12);  color: #b8900a; }
    .large      { background: rgba(168,85,247,.12);  color: #7c3aed; }
  `]
})
export class StatusBadgeComponent {
  @Input({ required: true }) label!: string;
  @Input({ required: true }) variant!: BadgeVariant;
}
