export interface NhongaConfig {
    apiKey: string;
    secretKey?: string;
    baseUrl?: string;
}
export interface CreatePaymentRequest {
    amount: number;
    context: string;
    callbackUrl?: string;
    returnUrl?: string;
    currency?: 'MZN' | 'USD';
    enviroment?: 'prod' | 'dev';
}
export interface CreatePaymentResponse {
    success: boolean;
    error: string | null;
    redirectUrl?: string;
    id?: string;
}
export interface PaymentStatusRequest {
    id: string;
}
export interface PaymentStatusResponse {
    success: boolean;
    status: 'pending' | 'completed' | 'cancelled';
    amount: number;
    tax: number;
    method: string;
    currency: string;
}
export interface MobilePaymentRequest {
    method: 'mpesa' | 'emola';
    amount: number;
    context: string;
    useremail: string;
    userwhatsApp: string;
    phone: string;
}
export interface MobilePaymentResponse {
    success: boolean;
    error: string | null;
    id?: string;
    currency?: string;
}
export interface WebhookPayload {
    id: string;
    productId: string;
    method: string;
    paid: number;
    received: number;
    fee: number;
    context: string;
}
export declare class NhongaError extends Error {
    statusCode?: number | undefined;
    constructor(message: string, statusCode?: number | undefined);
}
//# sourceMappingURL=types.d.ts.map