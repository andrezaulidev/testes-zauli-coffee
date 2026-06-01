# 💳 Integração Stripe - Guia de Configuração

## O que foi adicionado

✅ **Interface de pagamento** com abas (WhatsApp / Cartão)  
✅ **Stripe Elements** para coleta segura de dados de cartão  
✅ **Validação de entrada** completa  
✅ **Tratamento de erros** robusto  
✅ **Status de pagamento** em tempo real  

## Configuração Rápida

### 1. Obter Chaves do Stripe

1. Acesse [https://dashboard.stripe.com](https://dashboard.stripe.com)
2. Crie uma conta (ou faça login)
3. Vá para **Developers** → **API keys**
4. Copie sua **Publishable key** (começa com `pk_test_` ou `pk_live_`)

### 2. Adicionar Chave ao Projeto

Abra `zaulis-coffee/script.js` e procure por:

```javascript
const STRIPE_PUBLIC_KEY = 'pk_test_sua_chave_publica_aqui';
```

Substitua pela sua chave:

```javascript
const STRIPE_PUBLIC_KEY = 'pk_test_xxxxxxxxxxxxxx'; // sua chave aqui
```

### 3. Configurar Webhook (Opcional - Para Produção)

Para receber confirmações de pagamento do Stripe:

1. No dashboard Stripe, vá para **Developers** → **Webhooks**
2. Clique em **Add endpoint**
3. URL: `https://seu-dominio.com/api/webhook/stripe`
4. Selecione eventos: `payment_intent.succeeded`, `payment_intent.payment_failed`
5. Copie o **Signing secret** e adicione ao `.env`:

```env
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxx
```

## Como Funciona

### Fluxo de Pagamento

```
1. Usuário clica em "Pagar com Cartão"
2. Abre modal com formulário de dados
3. Stripe Elements coleta dados do cartão (seguro)
4. Ao submeter, cria PaymentMethod no Stripe
5. Envia para servidor
6. Servidor processa o pedido
7. Confirmação é mostrada ao usuário
```

### Segurança

✅ Dados do cartão NUNCA tocam seu servidor  
✅ Stripe Elements usa tokenização  
✅ PCI compliance automático  
✅ Validação no cliente E servidor  

## Estrutura de Dados

### Requisição POST `/api/checkout`

```json
{
  "cart": [
    {
      "id": 1,
      "nome": "Produto",
      "preco": 45.00,
      "quantidade": 2,
      "imagem": "fotos/cafe.png"
    }
  ],
  "customer": {
    "name": "João Silva",
    "email": "joao@example.com",
    "phone": "11991234567",
    "address": "Rua das Flores, 123",
    "reference": "Apto 456"
  },
  "paymentMethod": "pm_1234567890",
  "paymentType": "stripe"
}
```

### Resposta

```json
{
  "success": true,
  "orderId": "1716262800000",
  "message": "Pagamento recebido! Confirmando seu pedido..."
}
```

## Testando Localmente

### Cartões de Teste Stripe

Todos os cartões abaixo funcionam em modo teste:

| Número | CVC | Data | Resultado |
|--------|-----|------|-----------|
| `4242 4242 4242 4242` | `123` | `12/26` | ✅ Sucesso |
| `4000 0000 0000 0002` | `123` | `12/26` | ❌ Recusado |
| `4000 0025 0000 3155` | `123` | `12/26` | ⚠️ Requer 3D Secure |

### Como Testar

1. Iniciar servidor: `npm start`
2. Abrir `http://localhost:3000`
3. Adicionar produtos ao carrinho
4. Clicar em "Carrinho" → "Finalizar Compra"
5. Ir para aba "Cartão (Stripe)"
6. Preencher dados e usar número de teste acima

## Elementos Adicionados

### HTML
- Abas de método de pagamento
- Formulário Stripe
- Container para Stripe Elements
- Status de pagamento

### CSS
- Estilos para abas
- Estilos para Stripe Elements
- Animações de carregamento
- Feedback de erros

### JavaScript
- `initStripe()` - Inicializa Stripe
- `setupStripeElement()` - Configura card element
- `setupPaymentTabs()` - Troca entre abas
- `handleStripeSubmit()` - Processa pagamento
- `showPaymentStatus()` - Mostra status

## Variáveis de Ambiente (Futuro)

Para melhor segurança, use `.env`:

```env
STRIPE_PUBLIC_KEY=pk_test_xxxxx
STRIPE_SECRET_KEY=sk_test_xxxxx (apenas servidor)
STRIPE_WEBHOOK_SECRET=whsec_xxxxx
NODE_ENV=development
```

## Próximos Passos

### Básico
- [ ] Adicionar chave pública Stripe
- [ ] Testar com cartões de teste
- [ ] Verificar abas funcionando

### Intermediário
- [ ] Configurar webhook para confirmações
- [ ] Armazenar pedidos em banco de dados
- [ ] Implementar confirmação por email

### Avançado
- [ ] Implementar 3D Secure
- [ ] Refunds automáticos
- [ ] Relatório de vendas
- [ ] Integração com invoicing

## Troubleshooting

### ❌ "Stripe não está configurado"
**Solução**: Adicionar chave pública no script.js

### ❌ "Erro ao processar pagamento"
**Solução**: 
- Verificar se Stripe está inicializado
- Verificar console do navegador (F12)
- Verificar se servidor está rodando

### ❌ Card Element não aparece
**Solução**:
- Verificar se Stripe.js está carregado
- Verificar se container `#card-element` existe
- Abrir console e procurar erros

### ❌ Cartão recusado em teste
**Solução**: Use `4242 4242 4242 4242` - é garantido sucesso em teste

## Documentação

- [Stripe Documentation](https://stripe.com/docs)
- [Stripe Elements](https://stripe.com/docs/stripe-js/elements/payment-element)
- [Payment Methods API](https://stripe.com/docs/api/payment_methods)
- [Testing Stripe](https://stripe.com/docs/testing)

## Suporte

- 📧 Stripe Support: https://support.stripe.com
- 💬 Community: https://stackoverflow.com/questions/tagged/stripe
- 📚 Docs: https://stripe.com/docs

---

**Desenvolvido com ☕ e 💳 para pagamentos seguros!**
