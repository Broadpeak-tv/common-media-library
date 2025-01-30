import type { ValueOf } from '../utils/ValueOf';
import { FETCH_ABORTED_USER } from './FETCH_ABORTED_USER';
import { FETCH_ABORTED_TIMEOUT } from './FETCH_ABORTED_TIMEOUT';
/**
 * Fetch aborted reasons.
 *
 * @group Request
 *
 * @enum
 *
 * @beta
 */
export declare const FetchAbortedReason: {
    /**
     * User
     */
    readonly USER: typeof FETCH_ABORTED_USER;
    /**
     * Query string
     */
    readonly TIMEOUT: typeof FETCH_ABORTED_TIMEOUT;
};
/**
 * @beta
 */
export type FetchAbortedReason = ValueOf<typeof FetchAbortedReason>;
//# sourceMappingURL=FetchAbortedReason.d.ts.map