import axios, { AxiosInstance, AxiosError } from 'axios';
import {
  NhongaConfig,
  CreatePaymentRequest,
  CreatePaymentResponse,
  PaymentStatusRequest,
  PaymentStatusResponse,
  MobilePaymentRequest,
  MobilePaymentResponse,
  WebhookPayload,
  NhongaError
} from './types';

export class NhongaAPI {
  private client: AxiosInstance;
  private secretKey?: string;

  constructor(config: NhongaConfig) {
    this.secretKey = config.secretKey;
    
    this.client = axios.create({
      baseURL: config.baseUrl || 'https://nhonga.net/api',
      headers: {
        'apiKey': config.apiKey,
        'Content-Type': 'application/json'
      },
      timeout: 30000
    });

    // Interceptor para tratamento de erros
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response) {
          throw new NhongaError(
            `API Error: ${error.response.statusText}`,
            error.response.status
          );
        } else if (error.request) {
          throw new NhongaError('Network Error: No response received');
        } else {
          throw new NhongaError(`Request Error: ${error.message}`);
        }
      }
    );
  }

  /**
   * Cria uma nova transação de pagamento
   */
  async createPayment(request: CreatePaymentRequest): Promise<CreatePaymentResponse> {
    try {
      const response = await this.client.post<CreatePaymentResponse>('/payment/create', request);
      return response.data;
    } catch (error) {
      if (error instanceof NhongaError) {
        throw error;
      }
      throw new NhongaError('Failed to create payment');
    }
  }

  /**
   * Verifica o status de uma transação
   */
  async getPaymentStatus(request: PaymentStatusRequest): Promise<PaymentStatusResponse> {
    try {
      const response = await this.client.post<PaymentStatusResponse>('/payment/status', request);
      return response.data;
    } catch (error) {
      if (error instanceof NhongaError) {
        throw error;
      }
      throw new NhongaError('Failed to get payment status');
    }
  }

  /**
   * Realiza pagamento direto via mobile (M-Pesa/e-Mola)
   */
  async createMobilePayment(request: MobilePaymentRequest): Promise<MobilePaymentResponse> {
    try {
      const response = await this.client.post<MobilePaymentResponse>('/payment/mobile', request);
      return response.data;
    } catch (error) {
      if (error instanceof NhongaError) {
        throw error;
      }
      throw new NhongaError('Failed to create mobile payment');
    }
  }

  /**
   * Valida webhook payload usando a chave secreta
   */
  validateWebhook(payload: WebhookPayload, receivedSecretKey: string): boolean {
    if (!this.secretKey) {
      throw new NhongaError('Secret key not configured for webhook validation');
    }
    return this.secretKey === receivedSecretKey;
  }

  /**
   * Processa webhook de forma segura
   */
  processWebhook(
    payload: WebhookPayload, 
    receivedSecretKey: string,
    callback: (payload: WebhookPayload) => void | Promise<void>
  ): void {
    if (this.validateWebhook(payload, receivedSecretKey)) {
      callback(payload);
    } else {
      throw new NhongaError('Invalid webhook secret key');
    }
  }
}

