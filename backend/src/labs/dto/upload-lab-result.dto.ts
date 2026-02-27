import { IsString, MinLength } from 'class-validator';

export class UploadLabResultDto {
  @IsString()
  @MinLength(5)
  fileUrl: string;
}
