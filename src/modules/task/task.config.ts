/*
 * @Author: your name
 * @Date: 2021-01-25 18:09:09
 * @LastEditTime: 2021-01-27 19:16:29
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /nest-service/src/modules/task/task.config.ts
 */

import { create, PhantomJS, WebPage } from 'phantom'
import { EventEmitter } from 'events'

/**
 * 用于node层画卡、微信消息推送卡、截图功能实现
 * @export
 * @class PhantomTask
 */
export class PhantomTask {
    public clientPage: WebPage
    public phantomInstance: PhantomJS
    private num: number = 0
    constructor() {
        this.initTask()
    }
    /**
     * 初始化访问页面
     * @memberof PhantomTask
     */
    public async initTask() {
        if (!this.clientPage) {
            try {
                this.phantomInstance = await create(['--ignore-ssl-errors=yes'])
                // 创建页面
                this.clientPage =  await this.phantomInstance.createPage()
                // 开始时间
                let _serverRequestStartTime: [number, number] = process.hrtime()
                // 传递给服务器的userAgent字符串
                this.clientPage.setting('userAgent', 'Mozilla/5.0 (Linux; Android 5.1.1; NX511J Build/LMY47V; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/53.0.2785.49 Mobile MQQBrowser/6.2 TBS/043124 Safari/537.36 MicroMessenger/6.5.4.1000 NetType/4G Language/zh_CN')
                // 是否执行页面内的javascript
                this.clientPage.setting('javascriptEnabled', true)
                // 是否载入图片
                this.clientPage.setting('loadImages', true)
                // 资源开始加载的时候
                this.clientPage.on('onLoadStarted', () => {
                    console.log('[phantomjs task log]: 开始下载资源')
                    _serverRequestStartTime = process.hrtime()
                })
                // 页面所有资源载入完成后触发
                this.clientPage.on('onLoadFinished', (status) => {
                    if (Object.is(status, 'success')) {
                        const _serverRequestEndTime: [number, number] = process.hrtime()
                        const ms = (_serverRequestEndTime[0] - _serverRequestStartTime[0]) * 1e3 + (_serverRequestEndTime[1] - _serverRequestStartTime[1]) * 1e-6
                        console.log('[phantomjs task log]: 页面所有资源加载完成，耗时 ', ms, 'ms')
                    } else {
                        console.log('[phantomjs task log]: 页面所有资源加载失败')
                    }
                })
                // 捕获到alert
                this.clientPage.on('onAlert', (data) => {
                    console.log('onAlert:========', data)
                })
                // 捕获所有page上下文发生的javascript错误
                this.clientPage.on('onError', (msg, trace) => {
                    console.error('onError ------ ', msg, trace)
                })
                // 可以捕获console消息
                this.clientPage.on('onConsoleMessage', (msg, lineNum, sourceId) => {
                    console.log('onConsoleMessage ------ ', msg, lineNum, sourceId)
                })
                // 打卡页面 // es6代码不支持, 也不支持伪ssr
                const result = await this.clientPage.open('http://m.dev1.qlchat.com/fire/test')
                // 查看页面
                const content = await this.clientPage.property('content')
                console.log(content)
                console.log('[phantomjs task log]完成页面加载', result)
                return result
            } catch (error) {
                console.log('page error:', error)
                this.phantomInstance && this.phantomInstance.exit()
                this.phantomInstance = null
                this.clientPage = null
                // 限制次数
                if (this.num < 3) {
                    this.num++
                    setTimeout(() => {
                        this.initTask
                    }, 2000)
                }
            }
        }
    }
}