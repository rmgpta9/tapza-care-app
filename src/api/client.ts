import { ApiError } from './errors';
import { handleRequest } from './mock/server';

// Every API call goes through this one function.
// To use a real backend later, replace handleRequest(...) with fetch(...).
export async function request<T>(method: 'GET' | 'POST', url: string, body?: unknown): Promise<T> {
  const response = await handleRequest(method, url, body);

  if (response.status >= 400) {
    const message = (response.body as { message?: string })?.message ?? 'Something went wrong';
    throw new ApiError(response.status, message);
  }

  return response.body as T;
}
