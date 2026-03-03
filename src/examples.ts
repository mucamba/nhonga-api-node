import { NhongaAPI, NhongaError } from './index';

// Configuração da API
const nhonga = new NhongaAPI({
  apiKey: 'SUA_CHAVE_API',
  secretKey: 'SUA_CHAVE_SECRETA'
});

// Exemplo 1: Criar pagamento
async function exemploCreatePayment() {
  try {
    const payment = await nhonga.createPayment({
      amount: 1500,
      context: 'Pagamento do curso de programação',
      callbackUrl: 'https://seusite.com/webhook',
      returnUrl: 'https://seusite.com/obrigado',
      currency: 'MZN',
      environment: 'dev' // Use 'prod' para produção
    });

    if (payment.success) {
      console.log('✅ Pagamento criado com sucesso!');
      console.log('🔗 URL de redirecionamento:', payment.redirectUrl);
      console.log('🆔 ID da transação:', payment.id);
    } else {
      console.log('❌ Erro ao criar pagamento:', payment.error);
    }
  } catch (error) {
    if (error instanceof NhongaError) {
      console.error('🚨 Erro da API Nhonga:', error.message);
    } else {
      console.error('🚨 Erro inesperado:', error);
    }
  }
}

// Exemplo 2: Verificar status
async function exemploVerificarStatus() {
  try {
    const status = await nhonga.getPaymentStatus({
      id: 'txn_123456789'
    });

    console.log('📊 Status do pagamento:', status.status);
    console.log('💰 Valor:', status.amount, status.currency);
    console.log('💳 Método:', status.method);
    console.log('💸 Taxa:', status.tax);
  } catch (error) {
    console.error('🚨 Erro ao verificar status:', error);
  }
}

// Exemplo 3: Pagamento mobile
async function exemploPagamentoMobile() {
  try {
    const mobilePayment = await nhonga.createMobilePayment({
      method: 'mpesa',
      amount: 2500,
      context: 'Recarga de saldo',
      useremail: 'cliente@exemplo.com',
      userwhatsApp: '841234567',
      phone: '841416077'
    });

    if (mobilePayment.success) {
      console.log('✅ Pagamento mobile iniciado!');
      console.log('🆔 ID da transação:', mobilePayment.id);
      console.log('💱 Moeda:', mobilePayment.currency);
    } else {
      console.log('❌ Erro no pagamento mobile:', mobilePayment.error);
    }
  } catch (error) {
    console.error('🚨 Erro no pagamento mobile:', error);
  }
}

// Exemplo 4: Processamento de webhook (Express.js)
export function exemploWebhookExpress() {
  const express = require('express');
  const app = express();
  
  app.use(express.json());

  app.post('/webhook', (req: any, res: any) => {
    const secretKey = req.headers['secretkey'];
    const payload = req.body;

    try {
      nhonga.processWebhook(payload, secretKey, (webhookData) => {
        console.log('🎉 Pagamento confirmado!');
        console.log('🆔 ID:', webhookData.id);
        console.log('💰 Valor pago:', webhookData.paid);
        console.log('💵 Valor recebido:', webhookData.received);
        console.log('💸 Taxa:', webhookData.fee);
        console.log('💳 Método:', webhookData.method);
        console.log('📝 Contexto:', webhookData.context);
        
        // Aqui você processaria o pagamento confirmado
        // Exemplo: atualizar banco de dados, enviar email, etc.
      });

      res.status(200).send('OK');
    } catch (error) {
      console.error('🚨 Webhook inválido:', error);
      res.status(400).send('Invalid webhook');
    }
  });

  app.listen(3000, () => {
    console.log('🚀 Servidor webhook rodando na porta 3000');
  });
}

// Executar exemplos
if (require.main === module) {
  console.log('🧪 Executando exemplos da API Nhonga...\n');
  
  exemploCreatePayment()
    .then(() => exemploVerificarStatus())
    .then(() => exemploPagamentoMobile())
    .catch(console.error);
}

