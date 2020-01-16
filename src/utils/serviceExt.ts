import { isDocumentExist, handleReturn } from '@app/utils/common'

export default class ServiceExt {
    /**
     * 通过DB查询文档是否已存在
     *
     * @memberof ServiceExt
     */
    readonly isDocumentExist = isDocumentExist
    /**
     * 组装接口返回数据
     *
     * @memberof ServiceExt
     */
    readonly handleReturn = handleReturn
}
