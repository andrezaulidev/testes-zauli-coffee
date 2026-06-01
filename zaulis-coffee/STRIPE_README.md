# 💳 Stripe Elements Integrado

## Início Rápido

### 1️⃣ Obter Chave Stripe

```bash
# Acesse: https://dashboard.stripe.com/apikeys
# Copie sua "Publishable key"
```

### 2️⃣ Configurar no Código

```javascript
// Em zaulis-coffee/script.js, linha 4:
const STRIPE_PUBLIC_KEY = 'pk_test_xxxxxxxxxxxxx'; // Cole sua chave aqui
```

### 3️⃣ Testar Pagamento

1. Iniciar: `npm start`
2. Ir para: `http://localhost:3000`
3. Adicionar produto ao carrinho
4. Finalizar compra
5. Clicar em "Cartão (Stripe)"
6. Usar cartão teste: `4242 4242 4242 4242`

## O que Funciona

✅ Abas de pagamento (WhatsApp/Cartão)  
✅ Coleta segura de dados de cartão  
✅ Validação em tempo real  
✅ Status de pagamento  
✅ Feedback de erros  

## Cartões de Teste

```
✅ Sucesso:  4242 4242 4242 4242
❌ Recusado: 4000 0000 0000 0002
```

CVC: qualquer 3 dígitos  
Data: qualquer data futura (ex: 12/26)

## Estrutura

```
script.js
├── initStripe()              # Inicializa Stripe
├── setupStripeElement()      # Configura card element
├── setupPaymentTabs()        # Troca de abas
└── handleStripeSubmit()      # Processa pagamento

server.js
└── POST /api/checkout        # Processa pedido
```

## Segurança

⚠️ **NUNCA** exponha sua chave secreta no cliente  
✅ Use apenas a chave **Publishable** (pública)  
✅ Processamento de pagamento é seguro via Stripe  

## Próximas Melhorias

- Webhook para confirmações automáticas
- Email de confirmação
- Painel de admin
- Relatórios de vendas

---

Veja `STRIPE_SETUP.md` para guia completo!
