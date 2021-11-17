
import { CacheModule as NestCacheModule, Module } from '@nestjs/common'
import { FabricService } from './fabric.service'


@Module({
    imports: [],
    providers: [FabricService],
    exports: [FabricService],
})
export class FabricModule {}