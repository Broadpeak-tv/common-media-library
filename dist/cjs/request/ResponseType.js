"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResponseType = void 0;
const RESPONSE_TYPE_ARRAYBUFFER_js_1 = require("./RESPONSE_TYPE_ARRAYBUFFER.js");
const RESPONSE_TYPE_JSON_1 = require("./RESPONSE_TYPE_JSON");
const RESPONSE_TYPE_TEXT_1 = require("./RESPONSE_TYPE_TEXT");
/**
 * Response type
 *
 * @group request
 *
 * @enum
 *
 * @beta
 */
exports.ResponseType = {
    /**
     * Array buffer
     */
    ARRAYBUFFER: RESPONSE_TYPE_ARRAYBUFFER_js_1.RESPONSE_TYPE_ARRAYBUFFER,
    /**
     * JSON
     */
    JSON: RESPONSE_TYPE_JSON_1.RESPONSE_TYPE_JSON,
    /**
     * text
     */
    TEXT: RESPONSE_TYPE_TEXT_1.RESPONSE_TYPE_TEXT,
};
//# sourceMappingURL=ResponseType.js.map