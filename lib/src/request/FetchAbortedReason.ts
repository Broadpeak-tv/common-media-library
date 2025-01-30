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
export const FetchAbortedReason = {
	/**
	 * User
	 */
	USER: FETCH_ABORTED_USER as typeof FETCH_ABORTED_USER,

	/**
	 * Query string
	 */
	TIMEOUT: FETCH_ABORTED_TIMEOUT as typeof FETCH_ABORTED_TIMEOUT,

} as const;

/**
 * @beta
 */
export type FetchAbortedReason = ValueOf<typeof FetchAbortedReason>;
