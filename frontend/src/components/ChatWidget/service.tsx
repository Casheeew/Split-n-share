import { request } from '@umijs/max';

export async function queryChats(
    params?: any,
    options?: any,
): Promise<any> {
    return request(`/api/groupchats`, {
        params,
        ...(options || {}),
    }, 
);
}
