import { IsString, IsUrl } from 'class-validator';

export class UrlDTO {
  @IsString({ message: 'URL must be a string!' })
  @IsUrl(undefined, { message: 'Must be a valid URL' })
  url: string;
}
