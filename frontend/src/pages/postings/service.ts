import { request } from '@umijs/max';
import type { Params, ProductQueryResponse, UserParams } from './data';

export async function queryProducts(
    params?: Params,
): Promise<ProductQueryResponse> {
    return request(`/api/products`, {
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

export async function queryUserProducts(
    userId: string,
    params?: any,
): Promise<{
    data: any[];
}> {
    return request(`/api/products/user/${userId}`, {
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

export async function approveToJoinDeal(productId: string, userId: string): Promise<{ status: string }> {
    return request(`/api/products/${productId}/approve/${userId}`, {
        method: 'POST',
    });
}

export async function declineToJoinDeal(productId: string, userId: string): Promise<{ status: string }> {
    return request(`/api/products/${productId}/decline/${userId}`, {
        method: 'POST',
    });
}

export async function deletePosting(productId: string): Promise<{ status: string }> {
    return request(`/api/products/${productId}`, {
        method: 'DELETE',
    });
}

export type PostingData = any;

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

export async function createProductChat(body: any, options?: any): Promise<any> {
    return request(`/api/groupchats`, {
        method: 'POST',
        data: body,
        ...(options || {}),
    });
}