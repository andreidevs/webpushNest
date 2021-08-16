import { SendPushDto } from './dto/send-push.dto';
import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, HttpCode } from '@nestjs/common';
import { PushService } from './push.service';
import { CreatePushDto } from './dto/create-push.dto';


@Controller('push')
export class PushController {
  constructor(private readonly pushService: PushService) { }

  @HttpCode(201)
  @Post('/subscribe')
  async subscribe(@Body() createPushDto: CreatePushDto) {
    return this.pushService.subscribe(createPushDto);
  }

  @HttpCode(200)
  @Post('/send-push')
  async sendPush(@Body() body: SendPushDto): Promise<void> {
    return this.pushService.sendPush(body)
  }


  @HttpCode(200)
  @Post('/update-subscribe')
  async updateSubscribe(@Body() createPushDto: CreatePushDto) {
    return this.pushService.updateSubscribe(createPushDto)
  }



}
