export type CustomOptions = RequestInit & {
  baseUrl?: string;
  isAuthApi?: boolean;
};

class HttpError extends Error {
  status: number;
  payload: any;

  constructor({ status, payload }: { status: number; payload: any }) {
    super(`HTTP Error: ${status}`);
    this.status = status;
    this.payload = payload;
  }
}

type TPayload<TData> = {
  statusCode: number;
  message: string;
  data: TData;
};

const request = async <TData>(
  method: "GET" | "POST" | "PUT" | "DELETE",
  url: string,
  options: CustomOptions | undefined
) => {
  const body = options?.body ? JSON.stringify(options.body) : undefined;

  const baseHeaders: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (options?.isAuthApi) {
    // const session = await getSession();
    // console.log("my session", session);
    // baseHeaders["Authorization"] = `Bearer ${session?.user.token ?? ""}`;
  }

  const baseUrl =
    options?.baseUrl === undefined
      ? process.env.NEXT_PUBLIC_API_ENDPOINT
      : options.baseUrl;

  if (!url[0].startsWith("/")) {
    url = `/${url}`;
  }

  const fullUrl = `${baseUrl}${url}`;
  console.log("FULLURL", fullUrl);

  console.log("OPTIONS ", {
    ...options,
    headers: {
      ...baseHeaders,
      ...options?.headers,
    },
    credentials: "include",
    body,
    method,
  });
  const res = await fetch(fullUrl, {
    ...options,
    headers: {
      ...baseHeaders,
      ...options?.headers,
    },
    credentials: "include",
    body,
    method,
  });

  const payload: TPayload<TData> = await res.json();

  const data = {
    status: res.status,
    message: payload.message,
    payload: payload.data,
  };

  // console.log(payload);
  if (!res.ok) {
    return Promise.reject(new HttpError(data));
  }

  return data;
};

const http = {
  get<TData>(url: string, options?: Omit<CustomOptions, "body"> | undefined) {
    return request<TData>("GET", url, options);
  },
  getList<TData, TSearchParams = undefined>(
    url: string,
    searchParams?: TSearchParams,
    options?: Omit<CustomOptions, "body"> | undefined
  ) {
    if (searchParams) url += `?${convertObjectToSearchParams(searchParams)}`;
    // console.log(url, "????");
    return request<TData[]>("GET", url, {
      ...options,
      isAuthApi: true,
    });
  },
  post<TData>(url: string, body: any, options?: CustomOptions | undefined) {
    return request<TData>("POST", url, { ...options, body });
  },
  put<TData>(url: string, body: any, options?: CustomOptions | undefined) {
    return request<TData>("PUT", url, { ...options, body });
  },
  delete<TData>(url: string, options?: CustomOptions | undefined) {
    return request<TData>("DELETE", url, { ...options });
  },
};

const httpAuth = {
  get<TData>(url: string, options?: Omit<CustomOptions, "body"> | undefined) {
    return request<TData>("GET", url, {
      ...options,
      isAuthApi: true,
    });
  },
  getList<TData, TSearchParams = undefined>(
    url: string,
    searchParams?: TSearchParams,
    options?: Omit<CustomOptions, "body"> | undefined
  ) {
    if (searchParams) url += `?${convertObjectToSearchParams(searchParams)}`;

    return request<TData[]>("GET", url, {
      ...options,
      isAuthApi: true,
    });
  },
  post<TData>(url: string, body: any, options?: CustomOptions | undefined) {
    return request<TData>("POST", url, { ...options, body, isAuthApi: true });
  },
  put<TData>(url: string, body: any, options?: CustomOptions | undefined) {
    return request<TData>("PUT", url, { ...options, body, isAuthApi: true });
  },
  delete<TData>(url: string, options?: CustomOptions | undefined) {
    return request<TData>("DELETE", url, { ...options, isAuthApi: true });
  },
};

const convertObjectToSearchParams = (params: any) => {
  const searchParams = new URLSearchParams();
  for (const key in params) {
    if (params.hasOwnProperty(key)) {
      searchParams.append(key, params[key]);
    }
  }
  return searchParams.toString();
};
export { http, httpAuth };
