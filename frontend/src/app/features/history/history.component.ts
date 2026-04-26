import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HistoryService, HistoryFilter } from './history.service';
import { AsVariantPipe } from '../../shared/pipes/as-variant.pipe';
import { StatusBadgeComponent } from '../../shared/components/status-badge/status-badge.component';

const FILTERS: HistoryFilter[] = ['ALL', 'STORED', 'RETRIEVED'];

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [CommonModule, FormsModule, StatusBadgeComponent, AsVariantPipe],
  templateUrl: './history.component.html',
  styleUrl: './history.component.scss'
})
export class HistoryComponent implements OnInit {
  readonly filters = FILTERS;
  constructor(readonly svc: HistoryService) {}
  ngOnInit(): void { this.svc.load(); }
}
