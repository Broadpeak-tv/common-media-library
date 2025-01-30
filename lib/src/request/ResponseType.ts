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
export const ResponseType = {

  /**
   * Array buffer
   */
  ARRAYBUFFER: RESPONSE_TYPE_ARRAYBUFFER as typeof RESPONSE_TYPE_ARRAYBUFFER,

  /**
   * JSON
   */
  JSON: RESPONSE_TYPE_JSON as typeof RESPONSE_TYPE_JSON,

  /**
   * text
   */
  TEXT: RESPONSE_TYPE_TEXT as typeof RESPONSE_TYPE_TEXT,

} as const;

/**
 * @beta
 */
export type ResponseType = ValueOf<typeof ResponseType>;
