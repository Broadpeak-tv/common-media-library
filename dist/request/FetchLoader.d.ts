import { CommonMediaRequest, CommonMediaResponse } from "../request";
import { FetchLoaderOptions } from "./FetchLoaderOptions";
export interface FetchProgress {
    response: CommonMediaResponse;
    timestamp: Number;
    loaded: Number;
    total?: Number;
    data?: Uint8Array;
}
export interface FetchLoaderListener {
    /**
     * The headers listener to be notified when the headers have been received.
     */
    onheaders?: (response: CommonMediaResponse) => void;
    /**
     * The progress listener to be notified when the request receives more data.
     */
    onprogress?: (response: CommonMediaResponse, e: FetchProgress) => void;
}
/**
 * The request loader using fetch API.
 *
 * @group request
 *
 * @beta
 */
export declare class FetchLoader {
    private options;
    private cmRequest;
    private cmResponse;
    private abortController;
    private timeoutID;
    private listeners;
    constructor(options?: FetchLoaderOptions);
    addListener(listener: FetchLoaderListener): void;
    load(request: CommonMediaRequest): Promise<CommonMediaResponse>;
    abort(): void;
    reset(): void;
    private setTimeout;
    private cancelTimeout;
    private onAbort;
    private getResponseData;
    private readBody;
    /**
     * Adds the values from the Resource Timing API, see https://developer.mozilla.org/en-US/docs/Web/API/Resource_Timing_API/Using_the_Resource_Timing_API
     *
     * @internal
     */
    private addResourceTimingValues;
    /**
     * Checks if we got usable ResourceTimingAPI values
     *
     * @param resource - Resource timing values
     * @returns true if resource timing values are usable
     *
     * @internal
     */
    private areResourceTimingValuesUsable;
    private timestamp;
    private appendData;
}
//# sourceMappingURL=FetchLoader.d.ts.map