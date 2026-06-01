# Zauli's Coffee - E-commerce

Uma loja online moderna para o café especial **Zauli's Coffee** construída com HTML5, CSS3, JavaScript vanilla e Node.js Express.

## 🎯 Recursos

✅ **Interface Responsiva** - Funciona em desktop, tablet e mobile  
✅ **Dark Mode** - Tema escuro automático com preferência do usuário  
✅ **Carrinho de Compras** - Persistência em localStorage  
✅ **Integração WhatsApp** - Pedidos enviados via WhatsApp  
✅ **Produtos Dinâmicos** - Carregados de `db.json`  
✅ **Modal de Produtos** - Visualização detalhada com quantidade  
✅ **Acessibilidade WCAG** - Focus trap, aria-labels, navegação por teclado  
✅ **Validação de Entrada** - Telefone, email, quantidade máxima  
✅ **Rate Limiting** - Proteção contra abuse  
✅ **Compressão Gzip** - Performance otimizada  

## 📦 Instalação

### Pré-requisitos
- Node.js (v14+)
- npm ou yarn

### Passos

1. **Clonar/Baixar o repositório**
```bash
cd zaulis-coffee
```

2. **Instalar dependências**
```bash
npm install
```

3. **Iniciar o servidor**
```bash
npm start
```

O servidor iniciará em `http://localhost:3000`

## 🚀 Uso

### Desenvolvimento
```bash
npm run dev
```

### Estrutura de Arquivos

```
.
├── index.html                 # Página principal
├── README.md                  # Este arquivo
├── zaulis-coffee/
│   ├── db.json               # Base de dados (produtos, pedidos)
│   ├── script.js             # Lógica JavaScript
│   ├── style.css             # Estilos CSS
│   ├── server.js             # Servidor Express
│   ├── reset-cart.html       # Página de reset de carrinho
│   ├── package.json          # Dependências do projeto
│   └── fotos/                # Imagens dos produtos
```

## 🛒 Funcionalidades

### Carrinho de Compras
- Adicionar/remover produtos
- Aumentar/diminuir quantidade
- Persistência em localStorage
- Cálculo automático de total

### Checkout
- Formulário com validação
- Campos: Nome, Email, Telefone, Endereço, Complemento
- Envio de pedido via WhatsApp
- Validação de telefone (10-11 dígitos)
- Validação de email

### Produtos
- Visualização em grid responsiva
- Modal detalhado
- Preços com desconto
- Imagens otimizadas (lazy loading)

### Tema
- Dark mode automático
- Toggle manual
- Persistência em localStorage
- Transições suaves

## 🔐 Segurança

✅ Rate limiting (100 req/15min, 10 checkout/min)  
✅ Validação de entrada no servidor  
✅ Proteção contra price tampering  
✅ CORS configurado  
✅ Body parser limitado a 10MB  

## ♿ Acessibilidade

✅ Focus trap em modals  
✅ aria-labels em botões  
✅ Alt text descritivo em imagens  
✅ Navegação por teclado  
✅ Contraste de cores WCAG AA  

## 📊 API

### GET /api/products
Retorna lista de produtos

```json
[
  {
    "id": 1,
    "nome": "Café Torrado (em grãos) - 500g",
    "descricao": "...",
    "preco": 45.00,
    "imagem": "fotos/cafe.png"
  }
]
```

### POST /api/checkout
Cria novo pedido

**Body:**
```json
{
  "cart": [
    {
      "id": 1,
      "nome": "Produto",
      "preco": 45.00,
      "quantidade": 2
    }
  ],
  "customer": {
    "name": "João Silva",
    "email": "joao@email.com",
    "phone": "11991234567",
    "address": "Rua das Flores, 123",
    "reference": "Apto 456"
  }
}
```

### GET /api/orders/:id
Recupera detalhes do pedido

## 🎨 Cores

| Variável | Cor | Uso |
|----------|-----|-----|
| `--primary-color` | #6F4E37 | Marrom café médio |
| `--secondary-color` | #8B6F47 | Marrom dourado |
| `--accent-color` | #A89968 | Bege café |
| `--dark-color` | #4A2511 | Marrom escuro |

## 📱 Responsividade

- **Desktop**: 1200px+
- **Tablet**: 768px - 992px
- **Mobile**: < 768px

## 🐛 Troubleshooting

### Produtos não aparecem
```bash
# Verificar se db.json existe
npm start
```

### Porta 3000 em uso
```bash
# Usar porta diferente
PORT=5000 npm start
```

### Carrinho não persiste
- Limpar localStorage: F12 > Application > localStorage > Limpar
- Recarregar página

## 📝 TODO

- [ ] Sistema de pagamento (Stripe/PayPal)
- [ ] Autenticação de usuário
- [ ] Histórico de pedidos
- [ ] Newsletter
- [ ] Rating de produtos
- [ ] Busca e filtros avançados

## 📄 Licença

MIT License - Veja LICENSE.md para detalhes

## 👨‍💼 Suporte

Para suporte, envie email para: zauliscoffee@gmail.com

---

**Desenvolvido com ☕ para amantes de café**
