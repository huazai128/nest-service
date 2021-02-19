/*
 * @Author: your name
 * @Date: 2021-01-25 18:09:09
 * @LastEditTime: 2021-02-06 11:02:28
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
    private event: EventEmitter
    constructor() {
        if (!this.event) {
            this.event = new EventEmitter()
        }
        console.log('=======初始化了')
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
                    this.event.emit('imageData', data)
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
                // 在page创建后触发
                this.clientPage.on('onInitialized', () => {
                    console.log('[phantomjs task log]page创建后触发')
                })
                // 监听url变化
                this.clientPage.on('onUrlChanged', (targetUrl) => {
                    console.log('[phantomjs task log]监听url', targetUrl)
                })
                // 打卡页面, es6代码不支持, 也不支持伪ssr, 千聊项目所使用的是ssr,获取的是html文件不包含react代码
                const result = await this.clientPage.open('http://m.dev1.qlchat.com/fire/test')
                // 查看页面
                const content = await this.clientPage.property('content')
                // console.log(content)
                console.log('[phantomjs task log]完成页面加载', result)
                return result
            } catch (error) {
                console.log('page error:', error)
                this.phantomInstance && this.phantomInstance.exit()
                this.phantomInstance = null
                this.clientPage = null
                // 限制次数
                if (this.num < 10) {
                    this.num++
                    setTimeout(() => {
                        this.initTask
                    }, 2000)
                } else {
                    console.error('启动次数达到上线10次，请检查业务逻辑!!!')
                }
            }
        }
    }

    /**
     * 创建画卡数据传递
     * @param {*} cardData
     * @returns
     * @memberof PhantomTask
     */
    public async createShareCard(cardData): Promise<string> {
        if (!this.clientPage) {
            console.error('[phantomjs task error]: 页面未初始化成功！')
            return null
        }
        return new Promise((resolve, reject) => {
            this.event.once('imageData', (data) => {
                console.log('[phantomjs task log]: 图片生产完成')
                resolve(data)
            })
            // page打开页面的上下文（下文直接用page上下文指代）执行function的功能
            this.clientPage.evaluate(function(data) {
                // 不支持es6 语法
                console.log('提供window操作， 例如触发画卡功能')
                // const test = () => {
                //     console.log(1)
                // }
                // test()
            }, [cardData])
        })

    }
}