import { IsString, IsUrl } from 'class-validator';

export class OriginalDTO {
  @IsString({ message: 'URL must be a string!' })
  @IsUrl(undefined, { message: 'shortURL must be a valid URL' })
  shortURL: string;
}
