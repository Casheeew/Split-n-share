import { request } from '@umijs/max';
import type { ListItemDataType, ReviewData, UserParams } from './data.d';
import jwt from 'jsonwebtoken';

/** 获取当前的用户 GET /api/currentUser */
export async function queryCurrentUser(options?: { [key: string]: any }) {
  const token = localStorage.getItem('token')?.split(" ")[1];

  const decoded = token !== undefined ? jwt.decode(token) as any : { id: 'undefined' };

  return request<{
    data: {
      status: string,
      data: API.CurrentUser,
    },
  }>(`/api/users/${decoded.id}`, {
    method: 'GET',
    ...(options || {}),
  });
}

export async function queryUser(params: UserParams, options?: { [key: string]: any }) {
  const { id } = params;

  return request<{
    data: {
      status: string,
      data: API.CurrentUser[],
    },
  }>(`/api/users/${id}`, {
    method: 'GET',
    ...(options || {}),
  });
}

export async function queryReviews(params: {
  author?: string;
  target?: string;
}): Promise<{ data: { data: ListItemDataType[] } }> {
  return request('/api/reviews', {
    params,
  });
}

export async function updateReviews(
  body: any,
  params: { id: string; },
  options?: { [key: string]: any }
): Promise<{ data: { data: ListItemDataType[] } }> {
  return request('/api/reviews', {
    method: 'PATCH',
    params,
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

export async function createReview(body: ReviewData, options?: { [key: string]: any }) {
  return request<{ data: any }>('/api/reviews', { // todo! add user id
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
