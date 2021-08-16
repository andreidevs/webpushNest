import { TypegooseModule } from 'nestjs-typegoose';
import { Module } from '@nestjs/common';
import { PushService } from './push.service';
import { PushController } from './push.controller';
import { PushModel } from './push.model';

@Module({
  imports: [
    TypegooseModule.forFeature([
      {
        typegooseClass: PushModel,
        schemaOptions: {
          collection: 'Push'
        }
      }
    ]),
  ],
  controllers: [PushController],
  providers: [PushService]
})
export class PushModule { }
