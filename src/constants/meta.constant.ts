// import * as constants from '@nestjs/common/constants'
import { CACHE_KEY_METADATA } from '@nestjs/common/cache/cache.constants'

export const HTTP_ERROR_CODE = '__httpErrorCode__'
export const HTTP_SUCCESS_CODE = '__httpSuccessCode__'

export const HTTP_MESSAGE = '__httpMessage__'
export const HTTP_ERROR_MESSAGE = '__httpErrorMessage__'
export const HTTP_SUCCESS_MESSAGE = '__httpSuccessMessage__'

export const HTTP_RES_TRANSFORM_PAGINATE = '__httpResTransformPagenate__'

export const HTTP_CACHE_KEY_METADATA = CACHE_KEY_METADATA
export const HTTP_CACHE_TTL_METADATA = '__customHttpCacheTTL__'