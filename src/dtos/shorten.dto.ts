import { IsString, IsUrl } from 'class-validator';

export class ShortenDTO {
  @IsString({ message: 'URL must be a string!' })
  @IsUrl(undefined, { message: 'originalURL must be a valid URL' })
  originalURL: string;
}
