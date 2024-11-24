import { request } from '@umijs/max';
import type { Params, PostingData, ProductQueryResponse } from './data';

export async function queryProducts(
  params: Params,
): Promise<ProductQueryResponse> {
  return request('/api/products', {
    params,
  });
}

export async function querySearchProducts(
  params: any,
): Promise<ProductQueryResponse> {
  return request('/api/search/products', {
    params,
  });
}

export async function createProductPosting(body: PostingData, options?: { [key: string]: any }) {
  return request<{ data: any }>('/api/products', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
