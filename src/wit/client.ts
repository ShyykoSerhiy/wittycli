import { DEFAULT_WIT_URL } from './defaults';
import fetch, { Headers } from 'node-fetch';
import { promises } from 'fs';

export interface WitClientOptions {
  token: string;
  apiVersion?: string;
  witUrl?: string;
}

const method = (method: string) => {
  return {
    method,
  };
};

const METHOD = {
  GET: method('GET'),
  POST: method('POST'),
  DELETE: method('DELETE'),
};

export interface MessageGetIntent {
  id: string;
  name: string;
  confidence: number;
}

export interface MessageGetEntity {
  id: string;
  name: string;
  role: string;
  start: number;
  end: number;
  body: string;
  confidence: number;
  value: string;
  type: string;
}

export interface MessageGetTrait {
  id: string;
  value: string;
  confidence: number;
}

export interface MessageGetQueryParams {
  /**
   * 	User's query, between 0 and 280 characters.
   */
  q: string;
  /**
   * A specific tag you want to use for the query. See GET /apps/:app/tags.
   */
  tag?: string;
  /**
   * Context is key in natural language. For instance, at the same absolute instant, "today" will be resolved to a different value depending on the timezone of the user.
   */
  // context?: Context; // FIXME: not clear how to pass it
  /**
   * The maximum number of n-best intents and traits you want to get back. The default is 1, and the maximum is 8.
   */
  n?: number;
}

export interface MessageGetResponse {
  text: string;
  intents: MessageGetIntent[];
  app_id: string;
}

export interface AppsPostBody {
  /**
   * Name of the new app.
   */
  name: string;
  /**
   * Language code, in the ISO 639-1 format.
   */
  lang: string;
  /**
   * Private if true.
   */
  private: boolean;
  /**
   * Default timezone of your app. Defaults to America/Los_Angeles.
   */
  timezone?: string;
}

export interface AppsPostResponse {
  /**
   * New token for this app.
   */
  access_token: string;
  /**
   * New id of this app.
   */
  app_id: string;
}

export interface ExportGetResponse {
  /**
   * URL where you can download a ZIP file containing all of your app data. This ZIP file can be used to create a new app with the same data.
   */
  uri: string;
}

export interface ImportPostQueryParams {
  /**
   * Name of the new app.
   */
  name: string;
  /**
   * Private if true.
   */
  private: boolean;
}

export interface ImportPostResponse {
  name: string;
  access_token: string;
  app_id: string;
}

export const createWitClient = ({ token, apiVersion, witUrl = DEFAULT_WIT_URL }: WitClientOptions) => {
  const defaultHeaders: Headers = new Headers({
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
    ...(apiVersion && { Accept: `application/vnd.wit.${apiVersion}+json` }),
  });

  const withBody = (body: object) => {
    if (Buffer.isBuffer(body)) {
      return {
        body,
      };
    }
    return {
      body: JSON.stringify(body),
    };
  };

  const url = (part: string) => {
    return `${witUrl}${part}`;
  };

  const addQueryParams = (url: string, queryPrams?: object) => {
    const sP =
      queryPrams &&
      Object.entries(queryPrams)
        .reduce((searchParams, [key, v]) => {
          if (v) {
            searchParams.set(key, String(v));
          }
          return searchParams;
        }, new URLSearchParams())
        .toString();
    return sP ? `${url}?${sP}` : url;
  };

  interface ReqParams {
    urlPart: string;
    body?: object;
    queryParams?: object;
    method: { method: string };
    headers?: Headers;
  }

  const req = async ({ urlPart, method, body, queryParams, headers = new Headers() }: ReqParams) => {
    const requestUrl = addQueryParams(url(urlPart), queryParams);
    const requestHeaders = new Headers(
      [...new Map([...defaultHeaders.entries(), ...headers.entries()]).entries()].reduce((obj, [key, value]) => {
        obj[key] = value;
        return obj;
      }, {} as { [key: string]: string }),
    );

    const response = await fetch(requestUrl, { headers: requestHeaders, ...method, ...(body && withBody(body)) });
    if (!response.ok) {
      throw new Error(await response.text());
    }
    return response.json();
  };

  return {
    message: {
      /**
       * Returns the extracted meaning from a sentence, based on the app data.
       * @param {ImportPostQueryParams} queryParams query params
       */
      get: async (queryParams: MessageGetQueryParams): Promise<MessageGetResponse> => {
        return req({ urlPart: '/message', method: METHOD.GET, queryParams });
      },
    },
    import: {
      /**
       * Create a new app with all the app data from the exported app.
       * @param {ImportPostQueryParams} queryParams query params
       * @param {string | Buffer} filePathOrBuffer file path or buffer of the ZIPed app.
       */
      post: async (
        queryParams: ImportPostQueryParams,
        filePathOrBuffer: string | Buffer,
      ): Promise<ImportPostResponse> => {
        const buffer = Buffer.isBuffer(filePathOrBuffer) ? filePathOrBuffer : await promises.readFile(filePathOrBuffer);

        return req({
          urlPart: '/import',
          method: METHOD.POST,
          queryParams,
          headers: new Headers({
            'Content-Type': 'application/zip',
            'Content-length': String(buffer.byteLength),
          }),
          body: buffer,
        });
      },
    },
    export: {
      /**
       * Get a URL where you can download a ZIP file containing all of your app data. This ZIP file can be used to create a new app with the same data.
       * @returns {Promise<ExportGetResponse>} Promise of an URL where you can download a ZIP file
       */
      get: (): Promise<ExportGetResponse> => {
        return req({ urlPart: '/export', method: METHOD.GET });
      },
    },
    apps: {
      /**
       * Creates a new app for an existing user.
       * @param {AppsPostBody} body body of the request.
       * @returns {Promise<AppsPostResponse>} Promise of the data for created app.
       */
      post: async (body: AppsPostBody): Promise<AppsPostResponse> => {
        return req({ urlPart: '/apps', method: METHOD.POST, body });
      },
    },
  };
};

export const createWithClientFromFlags = ({ auth, version }: { auth: string; version?: string }) => {
  return createWitClient({ token: auth, apiVersion: version });
};

export type WittyClient = ReturnType<typeof createWitClient>;
