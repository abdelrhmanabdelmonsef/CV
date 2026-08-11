import { Controller, Get } from '@nestjs/common';
import cvData from 'cv-data';

@Controller('cv')
export class CvController {
  @Get()
  getCv() {
    return cvData;
  }
}
