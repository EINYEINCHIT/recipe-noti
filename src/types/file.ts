export interface UploadResponse {
  Bucket: string;
  ETag: string;
  Key: string;
  Location: string;
  ServerSideEncryption?: string;
  display_name: string;
  file_name: string;
  key: string;
}