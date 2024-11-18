import { request } from '@umijs/max';
import type { Params, ProductQueryResponse, UserParams } from './data';

export async function queryProducts(
    params: Params,
): Promise<ProductQueryResponse> {
    return request(`/api/products/${params.productId}`, {
        params,
    });
}

export async function queryUser(params: UserParams, options?: { [key: string]: any }) {
    const { id } = params;

    return request<{
        data: {
            status: string,
            data: API.CurrentUser,
        },
    }>(`/api/users/${id}`, {
        method: 'GET',
        ...(options || {}),
    });
}
