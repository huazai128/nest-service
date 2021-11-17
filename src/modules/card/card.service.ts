
import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import ServiceExt from '@app/utils/serviceExt'
import { FabricService } from '@app/processors/fabric/fabric.service'

@Injectable()
export class CardService extends ServiceExt {
    constructor(
        private readonly fabricService: FabricService,
    ) {
        super()
    }

    /**
     * 开始画卡
     * @memberof CardService
     */
    async create() {
        try {
            const result = await this.fabricService.create();
            return this.handleReturn({ msg: '绘制成功', code:200, data: result })
        } catch (error) {
            console.log(error, 'error')
            return {msg: '绘制失败', code: 500, }
        }
    }
    
}