import { Controller, Get, Query } from '@nestjs/common'
import { CardService } from './card.service'

@Controller('card')
export class CardController {
    constructor(private readonly cardService: CardService) {

    }

    @Get('getTplList')
    getArticleList(@Query() query:any){
        return '1212'
    }
    
    @Get('generate')
    async generateCard() {
        return await this.cardService.create();
    }
}