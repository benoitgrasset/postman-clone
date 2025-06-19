export type RequestData = {
  url: string;
  method: string;
  headers?: HeadersInit;
  body?: string;
  params?: Record<string, string | number | boolean>;
};

export type QueryParam = {
  key: string;
  value: string;
  id: string; // Unique ID for React key
};
