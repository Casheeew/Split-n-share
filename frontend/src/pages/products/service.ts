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

export async function requestToJoinDeal(productId: string): Promise<{ status: string }> {
    return request(`/api/products/${productId}/join`, {
        method: 'POST',
    });
}

export async function createChatForTwo(body: any, options?: any): Promise<any> {
    return request(`/api/groupchats/two`, {
        method: 'POST',
        data: body,
        ...(options || {}),
    });
}