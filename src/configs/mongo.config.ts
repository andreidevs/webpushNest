import { ConfigService } from '@nestjs/config';
import { TypegooseModule, TypegooseModuleOptions } from 'nestjs-typegoose';

export const getMongoConfig = async (configService: ConfigService): Promise<TypegooseModuleOptions> => {
    return {
        uri: configService.get('MONGO_URI').toString(),
        ...getMongoOptions()
    }
};

const getMongoString = (configService: ConfigService) => configService.get('MONGO_URI')


const getMongoOptions = () => ({
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
})

