import { Module } from '@nestjs/common';
import { CvModule } from './cv/cv.module';
import { ContactModule } from './contact/contact.module';

@Module({
  imports: [CvModule, ContactModule],
  controllers: [],
  providers: []
})
export class AppModule {}
