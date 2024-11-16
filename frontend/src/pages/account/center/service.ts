import { request } from '@umijs/max';
import type { ListItemDataType, ReviewData } from './data.d';
import jwt from 'jsonwebtoken';

/** 获取当前的用户 GET /api/currentUser */
export async function queryCurrentUser(options?: { [key: string]: any }) {
  const token = localStorage.getItem('token')?.split(" ")[1];

  const decoded = token !== undefined ? jwt.decode(token) as any : { id: 'undefined' };

  return request<{
    data: API.CurrentUser;
  }>(`/api/users/${decoded.id}`, {
    method: 'GET',
    ...(options || {}),
  });
}

export async function queryFakeList(params: {
  count: number;
}): Promise<{ data: { list: ListItemDataType[] } }> {
  return request('/api/fake_list_Detail', {
    params,
  });
}

export async function createReview(body: ReviewData, options?: { [key: string]: any }) {
  return request<{ data: any }>('/api/users/reviews', { // todo! add user id
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
