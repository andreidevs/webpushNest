import { Type } from 'class-transformer';
import { IsArray, IsNumber, IsString } from 'class-validator';

export class NotificationBody {

    @IsString()
    title: string;

    @IsString()
    body: string;

    @IsString()
    icon: string;

    @IsNumber()
    expirationTime?: number;
}

export class SendPushDto {

    @IsArray()
    @IsString({ each: true })
    types: string[]

    @Type(() => NotificationBody)
    payload: NotificationBody
}