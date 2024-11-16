import { request } from '@umijs/max';
import type { GeographicItemType } from './data';
import jwt from 'jsonwebtoken';

/** 获取当前的用户 GET /api/currentUser */
export async function currentUser(options?: { [key: string]: any }) {
  const token = localStorage.getItem('token')?.split(" ")[1];

  const decoded = token !== undefined ? jwt.decode(token) as any : { id: 'undefined' };

  return request<{
    data: API.CurrentUser;
  }>(`/api/users/${decoded.id}`, {
    method: 'GET',
    ...(options || {}),
  });
}

export async function queryProvince(): Promise<{ data: GeographicItemType[] }> {
  return request('/api/geographic/province');
}

export async function queryCity(province: string): Promise<{ data: GeographicItemType[] }> {
  return request(`/api/geographic/city/${province}`);
}

export async function query() {
  return request('/api/users');
}
