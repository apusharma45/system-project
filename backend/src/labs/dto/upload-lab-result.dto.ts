import { IsInt, IsOptional, IsString, MaxLength, Min, MinLength } from 'class-validator';

export class UploadLabResultDto {
  @IsString()
  @MinLength(5)
  fileUrl: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  filePublicId?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  fileMimeType?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  fileSizeBytes?: number;
}
