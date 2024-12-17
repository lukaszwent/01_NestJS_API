import { ExternalListItem } from './external-list-item.interface';

export interface ExternalListResponse<T = ExternalListItem> {
  message: string;
  total_records: number;
  total_pages: number;
  previous: string;
  next: string;
  results: T[];
}
