import { IsDateString } from 'class-validator';

export class ScheduleAppointmentDto {
  @IsDateString()
  scheduledAt!: string;
}
