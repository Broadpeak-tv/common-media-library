import type { ValueOf } from '../utils/ValueOf.js';
import { RESPONSE_TYPE_ARRAYBUFFER } from './RESPONSE_TYPE_ARRAYBUFFER.js';
import { RESPONSE_TYPE_JSON } from './RESPONSE_TYPE_JSON';
import { RESPONSE_TYPE_TEXT } from './RESPONSE_TYPE_TEXT';
/**
 * Response type
 *
 * @group request
 *
 * @enum
 *
 * @beta
 */
export declare const ResponseType: {
    /**
     * Array buffer
     */
    readonly ARRAYBUFFER: typeof RESPONSE_TYPE_ARRAYBUFFER;
    /**
     * JSON
     */
    readonly JSON: typeof RESPONSE_TYPE_JSON;
    /**
     * text
     */
    readonly TEXT: typeof RESPONSE_TYPE_TEXT;
};
/**
 * @beta
 */
export type ResponseType = ValueOf<typeof ResponseType>;
//# sourceMappingURL=ResponseType.d.ts.map