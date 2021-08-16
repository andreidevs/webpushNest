import { ModelType } from '@typegoose/typegoose/lib/types';
import { ApiProperty } from '@nestjs/swagger';
import { modelOptions, mongoose, prop } from '@typegoose/typegoose';
import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';

export class Browser {
    @prop()
    name: string;
    @prop()
    version: string;
}

export interface PushModel extends Base { }
export class PushModel extends TimeStamps {

    @prop({ required: true })
    endpoint: string;

    @prop({ required: false })
    expirationTime?: number;

    @prop({ required: true })
    auth: string;

    @prop({ required: true, default: 'dev' })
    status: string;

    @prop({ required: true })
    p256dh: string;


    @prop()
    language: string;

    @prop()
    platform: string;

    @prop({ type: () => Browser })
    browser: Browser

    @prop({ type: () => [String] })
    notify_type?: string[];


}