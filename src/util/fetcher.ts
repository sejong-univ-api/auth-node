import ConnectionError from 'error/connection-error';

const _createRequestBody = (data: FetcherRequestBody, isFormEncoded: boolean): string =>
     isFormEncoded ? new URLSearchParams(data).toString() : JSON.stringify(data);

const _createHeaders = (
     isFormEncoded: boolean,
     customHeaders: FetcherHeaders = {}
): HeadersInit => ({
     'Content-Type': isFormEncoded ? 'application/x-www-form-urlencoded' : 'application/json',
     ...customHeaders,
});

const _parseResponse = async (response: Response): Promise<FetcherResponse> => {
     return {
          body: await _parseBody(response),
          headers: _parseHeaders(response),
          cookies: _parseCookies(response),
     };
};

const _parseHeaders = (response: Response): FetcherHeaders =>
     Object.fromEntries(response.headers.entries());

const _parseCookies = (response: Response): FetcherCookies => {
     const cookiesHeader = response.headers.get('Set-Cookie');
     const cookies: Record<string, string> = {};
     if (cookiesHeader) {
          const cookieStrings = cookiesHeader.split(/,(?=\s*[A-Za-z0-9_-]+=)/);
          cookieStrings.forEach((cookieStr) => {
               const parts = cookieStr.split(';')[0].trim();
               const [key, value] = parts.split('=');
               if (key && value) {
                    cookies[key.trim()] = value.trim();
               }
          });
     }
     return cookies;
};

const _parseBody = async (response: Response): Promise<FetcherObject | FetcherText> => {
     const contentType = response.headers.get('Content-Type') || '';
     if (contentType.includes('application/json')) {
          return (await response.json()) as FetcherObject;
     }
     if (contentType.includes('text/html')) {
          return await response.text();
     }
     return await response.text(); // 기본적으로 text 반환
};

const _postRequest = async (
     url: string,
     body: FetcherRequestBody,
     isFormEncoded: boolean,
     customHeaders: FetcherHeaders
): Promise<FetcherResponse> => {
     const response = await fetch(url, {
          method: 'POST',
          headers: _createHeaders(isFormEncoded, customHeaders),
          body: _createRequestBody(body, isFormEncoded),
     });

     if (!response.ok) {
          throw new ConnectionError(response.statusText, response.status);
     }

     return await _parseResponse(response);
};

const joinCookies = (cookies: FetcherCookies): string => {
     return Object.entries(cookies)
          .map(([key, value]) => `${key}=${value}`)
          .join('; ');
};

const _getRequest = async (
     url: string,
     params: Record<string, string> = {},
     headers: FetcherHeaders = {},
     cookies: FetcherCookies = {}
): Promise<FetcherResponse> => {
     const queryString = new URLSearchParams(params).toString();
     const cookieString = joinCookies(cookies);
     if (cookieString) {
          headers['Cookie'] = cookieString;
     }
     const response = await fetch(`${url}?${queryString}`, {
          method: 'GET',
          headers,
     });

     if (!response.ok) {
          throw new ConnectionError(response.statusText, response.status);
     }

     return await _parseResponse(response);
};

export type FetcherObject = Record<string, any>;
export type FetcherText = string;

export type FetcherOptions = {
     headers?: FetcherHeaders;
     cookies?: FetcherCookies;
};
export type FetcherPostOptions = FetcherOptions & {
     formUrlEncoded?: boolean;
};
export type FetcherHeaders = Record<string, string>;
export type FetcherCookies = Record<string, string>;
export type FetcherRequestBody = Record<string, any>;
export type FetcherResponse = {
     body: FetcherObject | FetcherText;
     headers: FetcherHeaders;
     cookies: FetcherCookies;
};

export interface Fetcher {
     post(
          url: string,
          body: FetcherRequestBody,
          options?: FetcherPostOptions
     ): Promise<FetcherResponse>;

     get(
          url: string,
          params?: Record<string, string>,
          option?: FetcherOptions
     ): Promise<FetcherResponse>;
}

const fetcher: Fetcher = Object.freeze({
     post: async (
          url: string,
          body: FetcherRequestBody,
          options: FetcherPostOptions = {}
     ): Promise<FetcherResponse> =>
          _postRequest(url, body, options.formUrlEncoded ?? false, options.headers ?? {}),
     get: async (
          url: string,
          params: Record<string, string> = {},
          options: FetcherOptions = {}
     ): Promise<FetcherResponse> =>
          _getRequest(url, params, options.headers ?? {}, options.cookies ?? {}),
});

export default fetcher;
