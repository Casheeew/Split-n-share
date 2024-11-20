import { request } from '@umijs/max';

export interface UserData {
  status?: 'success' | 'error';
  name: string;
  token: string;
}

export interface UserRegisterParams {
  mail: string;
  password: string;
  confirm: string;
  mobile: string;
  captcha: string;
  prefix: string;
}

export async function fakeRegister(params: UserRegisterParams) {
  return request('/api/users/register', {
    method: 'POST',
    data: params,
  });
}
