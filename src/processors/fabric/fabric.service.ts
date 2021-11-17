/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-10-05 21:43:45
 * @LastEditTime: 2021-02-19 17:12:51
 * @LastEditors: Please set LastEditors
 */
import { Injectable} from '@nestjs/common'
const fabric = require('fabric').fabric
const fs = require('fs')
const out = fs.createWriteStream(__dirname + '/helloworld.png');


@Injectable()
export class FabricService {
    private canvas: fabric.Canvas

    create(json?: any): Promise<any> {
        if(this.canvas) {
            this.canvas.clear();
        } else {
            this.canvas = new fabric.StaticCanvas(null, {width:375,height:667});
        }
        json = {
            "version": "4.6.0",
            "objects": [{
                "type": "i-text",
                "version": "4.6.0",
                "originX": "left",
                "originY": "top",
                "left": 92,
                "top": 60,
                "width": 197.85,
                "height": 45.2,
                "fill": "#333",
                "stroke": null,
                "strokeWidth": 1,
                "strokeDashArray": null,
                "strokeLineCap": "butt",
                "strokeDashOffset": 0,
                "strokeLineJoin": "miter",
                "strokeUniform": false,
                "strokeMiterLimit": 4,
                "scaleX": 1,
                "scaleY": 1,
                "angle": 0,
                "flipX": false,
                "flipY": false,
                "opacity": 1,
                "shadow": null,
                "visible": true,
                "backgroundColor": "",
                "fillRule": "nonzero",
                "paintFirst": "fill",
                "globalCompositeOperation": "source-over",
                "skewX": 0,
                "skewY": 0,
                "fontFamily": "Times New Roman",
                "fontWeight": "normal",
                "fontSize": 40,
                "text": "Hello World",
                "underline": false,
                "overline": false,
                "linethrough": false,
                "textAlign": "left",
                "fontStyle": "normal",
                "lineHeight": 1.16,
                "textBackgroundColor": "",
                "charSpacing": 0,
                "styles": {},
                "direction": "ltr",
                "path": null,
                "pathStartOffset": 0,
                "pathSide": "left"
            }, {
                "type": "image",
                "version": "4.6.0",
                "originX": "left",
                "originY": "top",
                "left": 70,
                "top": 295.33,
                "width": 100,
                "height": 100,
                "fill": "rgb(0,0,0)",
                "stroke": null,
                "strokeWidth": 0,
                "strokeDashArray": null,
                "strokeLineCap": "butt",
                "strokeDashOffset": 0,
                "strokeLineJoin": "miter",
                "strokeUniform": false,
                "strokeMiterLimit": 4,
                "scaleX": 0.5,
                "scaleY": 0.5,
                "angle": 0,
                "flipX": false,
                "flipY": false,
                "opacity": 1,
                "shadow": null,
                "visible": true,
                "backgroundColor": "",
                "fillRule": "nonzero",
                "paintFirst": "fill",
                "globalCompositeOperation": "source-over",
                "skewX": 0,
                "skewY": 0,
                "cropX": 0,
                "cropY": 0,
                "src": "data:image/png;base64,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",
                "crossOrigin": null,
                "filters": []
            }, {
                "type": "image",
                "version": "4.6.0",
                "originX": "left",
                "originY": "top",
                "left": 143,
                "top": 146.33,
                "width": 225,
                "height": 225,
                "fill": "rgb(0,0,0)",
                "stroke": null,
                "strokeWidth": 0,
                "strokeDashArray": null,
                "strokeLineCap": "butt",
                "strokeDashOffset": 0,
                "strokeLineJoin": "miter",
                "strokeUniform": false,
                "strokeMiterLimit": 4,
                "scaleX": 0.5,
                "scaleY": 0.5,
                "angle": 0,
                "flipX": false,
                "flipY": false,
                "opacity": 1,
                "shadow": null,
                "visible": true,
                "backgroundColor": "",
                "fillRule": "nonzero",
                "paintFirst": "fill",
                "globalCompositeOperation": "source-over",
                "skewX": 0,
                "skewY": 0,
                "cropX": 0,
                "cropY": 0,
                "src": "data:image/jpeg;base64,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",
                "crossOrigin": null,
                "filters": []
            }, {
                "type": "circle",
                "version": "4.6.0",
                "originX": "left",
                "originY": "top",
                "left": 164,
                "top": 356.33,
                "width": 100,
                "height": 100,
                "fill": "#06c",
                "stroke": null,
                "strokeWidth": 1,
                "strokeDashArray": null,
                "strokeLineCap": "butt",
                "strokeDashOffset": 0,
                "strokeLineJoin": "miter",
                "strokeUniform": false,
                "strokeMiterLimit": 4,
                "scaleX": 1,
                "scaleY": 1,
                "angle": 0,
                "flipX": false,
                "flipY": false,
                "opacity": 1,
                "shadow": null,
                "visible": true,
                "backgroundColor": "",
                "fillRule": "nonzero",
                "paintFirst": "fill",
                "globalCompositeOperation": "source-over",
                "skewX": 0,
                "skewY": 0,
                "radius": 50,
                "startAngle": 0,
                "endAngle": 6.283185307179586
            }],
            "background": "#fff"
        }
        return new Promise((resolve, reject) => {
            this.canvas.loadFromJSON(json, () => {
                // 渲染
                this.canvas.renderAll();
                const stream = (this.canvas as any).createPNGStream();
                let data;
                stream.on('data', (chunk) => {
                    out.write(chunk)
                })
                // 可以上传至CDN
                stream.on('end', () => {
                    console.log(data, 'data============')
                    resolve('结束了')
                })
            })
        })
    }
}