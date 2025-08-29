export interface BatchUpdatePayload {
  ids: number[];
  action: 'publish' | 'unpublish' | 'delete';
}

export interface BatchUpdateResponse {
  message: string;
  successfulIds: number[];
  failedIds: number[];
  successfulCount: number;
  failedCount: number;
}
