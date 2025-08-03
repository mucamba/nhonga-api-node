"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NhongaAPI = void 0;
const axios_1 = __importDefault(require("axios"));
const types_1 = require("./types");
class NhongaAPI {
    constructor(config) {
        this.secretKey = config.secretKey;
        this.client = axios_1.default.create({
            baseURL: config.baseUrl || 'https://nhonga.net/api/',
            headers: {
                'apiKey': config.apiKey,
                'Content-Type': 'application/json'
            },
            timeout: 30000
        });
        // Interceptor para tratamento de erros
        this.client.interceptors.response.use((response) => response, (error) => {
            if (error.response) {
                throw new types_1.NhongaError(`API Error: ${error.response.statusText}`, error.response.status);
            }
            else if (error.request) {
                throw new types_1.NhongaError('Network Error: No response received');
            }
            else {
                throw new types_1.NhongaError(`Request Error: ${error.message}`);
            }
        });
    }
    /**
     * Cria uma nova transação de pagamento
     */
    async createPayment(request) {
        try {
            const response = await this.client.post('/payment/create', request);
            return response.data;
        }
        catch (error) {
            if (error instanceof types_1.NhongaError) {
                throw error;
            }
            throw new types_1.NhongaError('Failed to create payment');
        }
    }
    /**
     * Verifica o status de uma transação
     */
    async getPaymentStatus(request) {
        try {
            const response = await this.client.post('/payment/status', request);
            return response.data;
        }
        catch (error) {
            if (error instanceof types_1.NhongaError) {
                throw error;
            }
            throw new types_1.NhongaError('Failed to get payment status');
        }
    }
    /**
     * Realiza pagamento direto via mobile (M-Pesa/e-Mola)
     */
    async createMobilePayment(request) {
        try {
            const response = await this.client.post('/payment/mobile', request);
            return response.data;
        }
        catch (error) {
            if (error instanceof types_1.NhongaError) {
                throw error;
            }
            throw new types_1.NhongaError('Failed to create mobile payment');
        }
    }
    /**
     * Valida webhook payload usando a chave secreta
     */
    validateWebhook(payload, receivedSecretKey) {
        if (!this.secretKey) {
            throw new types_1.NhongaError('Secret key not configured for webhook validation');
        }
        return this.secretKey === receivedSecretKey;
    }
    /**
     * Processa webhook de forma segura
     */
    processWebhook(payload, receivedSecretKey, callback) {
        if (this.validateWebhook(payload, receivedSecretKey)) {
            callback(payload);
        }
        else {
            throw new types_1.NhongaError('Invalid webhook secret key');
        }
    }
}
exports.NhongaAPI = NhongaAPI;
//# sourceMappingURL=nhonga.js.map