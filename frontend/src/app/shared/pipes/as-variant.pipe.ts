import { Pipe, PipeTransform } from '@angular/core';
import { BadgeVariant } from '../components/status-badge/status-badge.component';

/**
 * AsVariantPipe — safely casts a lowercase string to BadgeVariant.
 * Avoids unsafe type assertions scattered across templates.
 */
@Pipe({ name: 'asVariant', standalone: true })
export class AsVariantPipe implements PipeTransform {
  transform(value: string): BadgeVariant {
    return value as BadgeVariant;
  }
}
