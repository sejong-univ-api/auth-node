import ConnectionError from '../error/connection-error';

/* ---------------------------------------------------------------------------
   내부 유틸리티 함수
   --------------------------------------------------------------------------- */

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

export type FetcherObject = Record<string, any>;
export type FetcherText = string;
export type FetcherResponse = FetcherObject | FetcherText;
export type FetcherPostOptions = {
  formUrlEncoded?: boolean;
  headers?: FetcherHeaders;
};
export type FetcherHeaders = Record<string, string>;
export type FetcherRequestBody = Record<string, any>;

export interface Fetcher {
  post(
    url: string,
    body: FetcherRequestBody,
    options?: FetcherPostOptions
  ): Promise<FetcherResponse>;
}

const fetcher: Fetcher = Object.freeze({
  post: (
    url: string,
    body: FetcherRequestBody,
    options: FetcherPostOptions = {}
  ): Promise<FetcherResponse> =>
    _postRequest(url, body, options.formUrlEncoded ?? false, options.headers ?? {}),
});

export default fetcher;
