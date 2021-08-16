import { IsArray, IsObject, IsString } from 'class-validator'


export class CreatePushDto {

    @IsString()
    endpoint: string;

    @IsString()
    auth: string;

    @IsString()
    p256dh: string;

    @IsString()
    language: string;

    @IsString({ each: true })
    @IsArray()
    notify_type?: string[]

    @IsString()
    platform: string;

    @IsObject()
    browser: {
        name: string;

        version: string;
    }

}
