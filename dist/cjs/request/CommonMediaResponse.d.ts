import type { CommonMediaRequest } from './CommonMediaRequest.js';
import type { ResourceTiming } from './ResourceTiming.js';
import type { FetchAbortedReason } from './FetchAbortedReason.js';
/**
 * Common response API.
 *
 * @group Request
 *
 * @beta
 */
export type CommonMediaResponse = {
    /**
     * The origin request.
     */
    request: CommonMediaRequest;
    /**
     * The final URL obtained after any redirects.
     */
    url?: string;
    /**
     * Indicates whether or not the request was redirected.
     */
    redirected?: boolean;
    /**
     * Indicates whether or not the request has been aborted.
     */
    aborted?: boolean;
    /**
     * The reasonfor which the request has been aborted.
     */
    abortReason?: FetchAbortedReason;
    /**
     * The HTTP status code of the response.
     */
    status?: number;
    /**
     * The status message corresponding to the HTTP status code.
     */
    statusText?: string;
    /**
     * The response headers.
     */
    headers?: Record<string, string>;
    /**
     * The response data.
     */
    data?: any;
    /**
     * The network timing of the request/response.
     */
    resourceTiming: ResourceTiming;
};
//# sourceMappingURL=CommonMediaResponse.d.ts.map