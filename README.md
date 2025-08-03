# Nhonga API - Node.js Library

Biblioteca Node.js para integração com a API de pagamentos da Nhonga.net.

## Instalação

```bash
npm install nhonga-api
```

## Configuração

```javascript
import { NhongaAPI } from 'nhonga-api';

const nhonga = new NhongaAPI({
  apiKey: 'SUA_CHAVE_API',
  secretKey: 'SUA_CHAVE_SECRETA', // Opcional, necessária para webhooks
  baseUrl: 'https://nhonga.net/api/' // Opcional, padrão já configurado
});
```

## Uso

### Criar Pagamento

```javascript
try {
  const payment = await nhonga.createPayment({
    amount: 1500,
    context: 'Pagamento do curso de programação',
    callbackUrl: 'https://seusite.com/webhook',
    returnUrl: 'https://seusite.com/obrigado',
    currency: 'MZN',
    enviroment: 'prod'
  });

  console.log('URL de redirecionamento:', payment.redirectUrl);
  console.log('ID da transação:', payment.id);
} catch (error) {
  console.error('Erro ao criar pagamento:', error.message);
}
```

### Verificar Status do Pagamento

```javascript
try {
  const status = await nhonga.getPaymentStatus({
    id: 'txn_123456789'
  });

  console.log('Status:', status.status);
  console.log('Valor:', status.amount);
  console.log('Método:', status.method);
} catch (error) {
  console.error('Erro ao verificar status:', error.message);
}
```

### Pagamento Direto Mobile

```javascript
try {
  const mobilePayment = await nhonga.createMobilePayment({
    method: 'mpesa',
    amount: 2500,
    context: 'Recarga de saldo',
    useremail: 'cliente@exemplo.com',
    userwhatsApp: '841234567',
    phone: '841416077'
  });

  console.log('ID da transação:', mobilePayment.id);
} catch (error) {
  console.error('Erro no pagamento mobile:', error.message);
}
```

### Processamento de Webhooks

```javascript
import express from 'express';

const app = express();
app.use(express.json());

app.post('/webhook', (req, res) => {
  const secretKey = req.headers['secretkey'];
  const payload = req.body;

  try {
    nhonga.processWebhook(payload, secretKey, (webhookData) => {
      console.log('Pagamento confirmado:', webhookData.id);
      console.log('Valor pago:', webhookData.paid);
      console.log('Valor recebido:', webhookData.received);
      console.log('Taxa:', webhookData.fee);
      
      // Processar o pagamento confirmado
      // Atualizar banco de dados, enviar email, etc.
    });

    res.status(200).send('OK');
  } catch (error) {
    console.error('Webhook inválido:', error.message);
    res.status(400).send('Invalid webhook');
  }
});
```

## Tipos TypeScript

A biblioteca inclui tipos TypeScript completos:

```typescript
interface CreatePaymentRequest {
  amount: number;
  context: string;
  callbackUrl?: string;
  returnUrl?: string;
  currency?: 'MZN' | 'USD';
  enviroment?: 'prod' | 'dev';
}

interface PaymentStatusResponse {
  success: boolean;
  status: 'pending' | 'completed' | 'cancelled';
  amount: number;
  tax: number;
  method: string;
  currency: string;
}

interface MobilePaymentRequest {
  method: 'mpesa' | 'emola';
  amount: number;
  context: string;
  useremail: string;
  userwhatsApp: string;
  phone: string;
}
```

## Tratamento de Erros

A biblioteca usa a classe `NhongaError` para erros específicos da API:

```javascript
try {
  const payment = await nhonga.createPayment(paymentData);
} catch (error) {
  if (error instanceof NhongaError) {
    console.error('Erro da API Nhonga:', error.message);
    console.error('Código de status:', error.statusCode);
  } else {
    console.error('Erro inesperado:', error.message);
  }
}
```

## Ambiente de Desenvolvimento

Para testes, use `enviroment: 'dev'` nas requisições de pagamento:

```javascript
const payment = await nhonga.createPayment({
  amount: 1000,
  context: 'Teste de pagamento',
  enviroment: 'dev' // Não gera cobrança real
});
```

## Suporte

Para suporte técnico, entre em contato:
- Email: support@nhonga.net
- Documentação: https://nhonga.net/api-docs

## Licença

MIT

