import { SendPushDto } from './dto/send-push.dto';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { CreatePushDto } from './dto/create-push.dto';
import { PushModel } from './push.model';
import * as webPush from 'web-push'
import { query } from 'express';




const publicVapidKey = process.env.PUBLIC_VAPID_KEY;
const privateVapidKey = process.env.PRIVATE_VAPID_KEY;



@Injectable()
export class PushService {

  constructor(@InjectModel(PushModel) private readonly pushModel: ModelType<PushModel>) { }

  async subscribe(dto: CreatePushDto) {

    const user = await this.pushModel.findOne({ auth: dto.auth })

    if (!user) {
      return this.pushModel.create(dto)
    }

    return user

  }

  async sendPush(body: SendPushDto) {

    let query: any = {
      status: process.env.APP_TYPE,
    }

    if (body.types.length > 0) query.notify_type = { $in: body.types }

    const payload = JSON.stringify(body.payload);

    const subList = await this.pushModel.find(query);

    subList.map((sub) => {
      return new Promise((resolve, reject) => {
        webPush.sendNotification({
          endpoint: sub.endpoint,
          keys: {
            p256dh: sub.p256dh,
            auth: sub.auth
          }
        }, payload)
          .then(res => {
            resolve(res)
          })
          .catch(err => {
            if (err.statusCode === 404 || err.statusCode === 410) {
              this.pushModel.findByIdAndDelete(sub._id).exec()
            }
            reject(err.statusCode)

          })
      })
    })

  }

  async updateSubscribe(dto: CreatePushDto) {

    return await this.pushModel.findOneAndUpdate({ auth: dto.auth }, dto, { new: true }).exec()

  }

}
