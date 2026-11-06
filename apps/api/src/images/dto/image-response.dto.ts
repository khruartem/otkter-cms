export class ImageResponseDto {
  id: string;
  storageKey: string;
  mimeType: string | null;
  width: number | null;
  height: number | null;
  size: number;
  url: string;
}
