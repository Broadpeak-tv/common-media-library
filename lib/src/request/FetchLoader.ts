import { CommonMediaRequest, CommonMediaResponse } from "../request";
import { FetchLoaderOptions } from "./FetchLoaderOptions";
import { FetchAbortedReason } from "./FetchAbortedReason";
import { ResponseType } from "./ResponseType";

const DEFAULT_REQUEST_LOADER_OPTIONS: FetchLoaderOptions = {
  useResourceTimingApi: true
}


export interface FetchProgress {
  response: CommonMediaResponse
  timestamp: Number
  loaded: Number
  total?: Number
  data?: Uint8Array
}


export interface FetchLoaderListener {
  /**
   * The headers listener to be notified when the headers have been received.
   */
  onheaders?: (response: CommonMediaResponse) => void

  /**
   * The progress listener to be notified when the request receives more data.
   */
  onprogress?: (response: CommonMediaResponse, e: FetchProgress) => void
}

/**
 * The request loader using fetch API.
 *
 * @group request
 *
 * @beta
 */
export class FetchLoader {

  private options: FetchLoaderOptions = DEFAULT_REQUEST_LOADER_OPTIONS;
  private cmRequest: CommonMediaRequest | null = null;
  private cmResponse: CommonMediaResponse | null = null;
  private abortController: AbortController | null = null;
  private timeoutID: number = NaN
  private listeners: FetchLoaderListener[] = [];
  
  constructor(options: FetchLoaderOptions = DEFAULT_REQUEST_LOADER_OPTIONS) {
    this.options = options;
  }

  public addListener(listener: FetchLoaderListener) {
    this.listeners.push(listener);
  }

  public async load(request: CommonMediaRequest): Promise<CommonMediaResponse> {
    this.cmRequest = request;

    this.cmResponse = {
      request: this.cmRequest,
      resourceTiming: {
        startTime: Date.now(),
        encodedBodySize: 0
      },
      status: 0
    };

    // Abort controller to enable request aborting
    this.abortController = new AbortController();
    this.abortController.signal.onabort = (() => this.onAbort());

    // Set request headers
    const headers = new Headers();
    if (this.cmRequest.headers) {
        for (let header in this.cmRequest.headers) {
            let value = this.cmRequest.headers[header];
            if (value) {
                headers.append(header, value);
            }
        }
    }

    // Set request options
    const options: RequestInit = {
      method: this.cmRequest.method,
      headers,
      credentials: this.cmRequest.credentials,
      signal: this.abortController ? this.abortController.signal : undefined,
    }

    try {
      this.cmResponse.resourceTiming.startTime = this.timestamp();

      this.setTimeout(this.cmRequest.timeout);

      const response = await fetch(this.cmRequest.url, options);

      this.cmResponse.resourceTiming.responseStart = this.timestamp();

      this.cancelTimeout();

      // Response status
      this.cmResponse.status = response.status;
      this.cmResponse.statusText = response.statusText;

      // Response url in case of redirection
      this.cmResponse.url = response.url;

      // Response headers
      const responseHeaders: Record<string, string> = {};
      for (const key of response.headers.keys()) {
        responseHeaders[key] = response.headers.get(key)!!;
      }
      this.cmResponse.headers = responseHeaders;

      // Response headers received
      this.listeners.forEach(listener => listener.onheaders && listener.onheaders(this.cmResponse!!));

      // Response data
      this.cmResponse.data = await this.getResponseData(response);

      this.cmResponse.resourceTiming.responseEnd = this.timestamp();
      this.cmResponse.resourceTiming.duration = this.cmResponse.resourceTiming.responseEnd - this.cmResponse.resourceTiming.startTime;
      this.cmResponse.resourceTiming.encodedBodySize = Number(this.cmResponse.headers['content-length']);

      // Set resource timing data
      this.addResourceTimingValues();
    } catch (e) {
      this.cancelTimeout();
    }

    return this.cmResponse;
  }

  public abort() {
    if (!this.cmResponse) {
      return;
    }
    this.cmResponse.abortReason = FetchAbortedReason.USER;
    this.abortController?.abort();
  }

  public reset() {
    this.cmRequest = null;
    this.cmResponse = null;
  }

  private setTimeout(timeout: number | undefined) {
    if (timeout === undefined || isNaN(timeout) || timeout === -1) {
      return;
    }
    this.timeoutID = window.setTimeout(() => {
      if (this.cmResponse) {
        this.cmResponse.abortReason = FetchAbortedReason.TIMEOUT;
      }
      this.abortController?.abort()
    }, timeout)
  }

  private cancelTimeout() {
    if (isNaN(this.timeoutID)) {
      return;
    }
    window.clearTimeout(this.timeoutID);
    this.timeoutID = NaN;
  }

  private onAbort(/*e: any*/) {
    if (!this.cmResponse) {
      return;
    }
    this.cmResponse.aborted = true;
  }

  private async getResponseData(response: Response): Promise<any> {
    if (!this.cmRequest) {
      return null;
    }
    let data: any = null;
    switch (this.cmRequest.responseType) {
      case ResponseType.TEXT:
        data = await response.text();
        break;
      case ResponseType.JSON:
        data = await response.json();
        break;
      case ResponseType.ARRAYBUFFER:
        data = this.listeners.length === 0 ? await response.arrayBuffer() : await this.readBody(response);
        break;
      default:
        break;
    }
    return data;
  }

  private async readBody(response: Response): Promise<ArrayBufferLike | null> {
    const body = response.body;
    if (body === null || !this.cmResponse) {
      return null
    }

    const contentLength = (this.cmResponse.headers && this.cmResponse.headers['content-length']) ? Number(this.cmResponse.headers['content-length']) : 0;
    const reader = body.getReader();

    let data: Uint8Array = new Uint8Array();
    let loaded = 0;

    while (true) {
      const { done, value } = await reader.read();

      if (done) {
        break;
      }

      if (value && value.length > 0) {

        loaded += value.length;

        data = this.appendData(data, value);

        const fetchProgress: FetchProgress = {
          response: this.cmResponse,
          timestamp: this.timestamp(),
          loaded,
          total: contentLength,
          data: value,
        }

        this.listeners.forEach(listener => listener.onprogress && listener.onprogress(this.cmResponse!!, fetchProgress));
      }
    }
    return data.buffer;
  }

  /**
   * Adds the values from the Resource Timing API, see https://developer.mozilla.org/en-US/docs/Web/API/Resource_Timing_API/Using_the_Resource_Timing_API
   * 
   * @internal
   */
  private addResourceTimingValues() {
    if (!this.cmRequest || !this.cmResponse) {
      return;
    }
    if (!this.options.useResourceTimingApi) {
      return;
    }

    // Check performance support. We do not support range requests, needs to figure out how to find the right resource here.
    if (typeof performance === 'undefined' || (this.cmRequest.headers && this.cmRequest.headers['range'])) {
        return;
    }

    // Get a list of "resource" performance entries
    const resources: PerformanceResourceTiming[] = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
    if (resources === undefined || resources.length <= 0) {
        return;
    }

    // Find the right resource
    let i = 0;
    let resource: PerformanceResourceTiming | null = null;
    while (i < resources.length) {
      if (resources[i].name === this.cmRequest.url) {
        resource = resources[i];
        break;
      }
      i += 1;
    }

    if (!resource) {
      return;
    }

    // Check if PerformanceResourceTiming values are usable
    // Note: to allow seeing cross-origin timing information, the Timing-Allow-Origin HTTP response header needs to be set
    // See https://developer.mozilla.org/en-US/docs/Web/API/PerformanceResourceTiming#cross-origin_timing_information
    if (!this.areResourceTimingValuesUsable(resource)) {
      return;
    }

    // Update CommonMediaResponse Resource Timing info
    this.cmResponse.resourceTiming.startTime = resource.startTime;
    this.cmResponse.resourceTiming.encodedBodySize = resource.encodedBodySize;
    this.cmResponse.resourceTiming.responseStart = resource.startTime;
    this.cmResponse.resourceTiming.responseEnd = resource.responseEnd;
    this.cmResponse.resourceTiming.duration = resource.duration;
  }

  /**
   * Checks if we got usable ResourceTimingAPI values
   *
   * @param resource - Resource timing values 
   * @returns true if resource timing values are usable 
   * 
   * @internal
   */
  private areResourceTimingValuesUsable(resource: PerformanceResourceTiming) {
    return resource &&
      !isNaN(resource.responseStart) && resource.responseStart > 0 &&
      !isNaN(resource.responseEnd) && resource.responseEnd > 0 &&
      !isNaN(resource.transferSize) && resource.transferSize > 0
  }

  private timestamp(): number {
    if (typeof performance !== 'undefined' && typeof performance.now === 'function') {
        return performance.now();
    } else {
        return Date.now();
    }
  }

  private appendData(data: Uint8Array, newData: Uint8Array) {
    if (!data || data.length === 0) {
        return newData;
    }
    const _data = new Uint8Array(data.length + newData.length);
    _data.set(data);
    _data.set(newData, data.length);

    return _data;
  }

};
