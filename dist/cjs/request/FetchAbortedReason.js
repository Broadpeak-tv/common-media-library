"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchAbortedReason = void 0;
const FETCH_ABORTED_USER_1 = require("./FETCH_ABORTED_USER");
const FETCH_ABORTED_TIMEOUT_1 = require("./FETCH_ABORTED_TIMEOUT");
/**
 * Fetch aborted reasons.
 *
 * @group Request
 *
 * @enum
 *
 * @beta
 */
exports.FetchAbortedReason = {
    /**
     * User
     */
    USER: FETCH_ABORTED_USER_1.FETCH_ABORTED_USER,
    /**
     * Query string
     */
    TIMEOUT: FETCH_ABORTED_TIMEOUT_1.FETCH_ABORTED_TIMEOUT,
};
//# sourceMappingURL=FetchAbortedReason.js.map