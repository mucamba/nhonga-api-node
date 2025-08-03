import { NhongaConfig, CreatePaymentRequest, CreatePaymentResponse, PaymentStatusRequest, PaymentStatusResponse, MobilePaymentRequest, MobilePaymentResponse, WebhookPayload } from './types';
export declare class NhongaAPI {
    private client;
    private secretKey?;
    constructor(config: NhongaConfig);
    /**
     * Cria uma nova transação de pagamento
     */
    createPayment(request: CreatePaymentRequest): Promise<CreatePaymentResponse>;
    /**
     * Verifica o status de uma transação
     */
    getPaymentStatus(request: PaymentStatusRequest): Promise<PaymentStatusResponse>;
    /**
     * Realiza pagamento direto via mobile (M-Pesa/e-Mola)
     */
    createMobilePayment(request: MobilePaymentRequest): Promise<MobilePaymentResponse>;
    /**
     * Valida webhook payload usando a chave secreta
     */
    validateWebhook(payload: WebhookPayload, receivedSecretKey: string): boolean;
    /**
     * Processa webhook de forma segura
     */
    processWebhook(payload: WebhookPayload, receivedSecretKey: string, callback: (payload: WebhookPayload) => void | Promise<void>): void;
}
//# sourceMappingURL=nhonga.d.ts.map