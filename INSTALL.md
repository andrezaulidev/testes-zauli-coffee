# 🔧 Guia de Instalação e Setup

## Requisitos do Sistema

- **Node.js**: v14+ (Download em https://nodejs.org)
- **npm**: Vem com Node.js
- **Git**: Opcional, para clonar o repositório

## Instalação Rápida

### 1. Entrar no diretório do projeto
```bash
cd "c:\Users\cs25c\OneDrive\Desktop\testes zauli coffee"
cd zaulis-coffee
```

### 2. Instalar dependências
```bash
npm install
```

Isso instalará:
- `express` - Framework web
- `cors` - Compartilhamento de recursos entre origens
- `morgan` - Logger de requisições
- `body-parser` - Parser de JSON
- `sqlite3` - Banco de dados
- `express-rate-limit` - Proteção contra abuse
- `compression` - Compressão Gzip

### 3. Iniciar o servidor
```bash
npm start
```

Você deverá ver:
```
Zauli's demo server running on http://localhost:3000
```

### 4. Abrir no navegador
Navegue para: `http://localhost:3000`

## Desenvolvimento

Para modo desenvolvimento com reload automático, instale nodemon:

```bash
npm install -D nodemon
```

Então adicione ao `package.json`:
```json
"scripts": {
  "start": "node server.js",
  "dev": "nodemon server.js"
}
```

Depois use:
```bash
npm run dev
```

## Troubleshooting

### Erro: "port 3000 is already in use"
Solução: Usar outra porta
```bash
PORT=5000 npm start
```

### Erro: "Cannot find module 'express'"
Solução: Reinstalar dependências
```bash
npm install
```

### Erro: "db.json not found"
Solução: Verificar que o arquivo existe em `zaulis-coffee/db.json`

### Carrinho não persiste
Solução: Limpar localStorage
```javascript
// No console do navegador (F12)
localStorage.removeItem('carrinho');
```

## Estrutura de Pastas

```
testes zauli coffee/
├── index.html                 # Página principal
├── README.md                  # Documentação
├── .gitignore                 # Arquivos ignorados
├── .editorconfig              # Configuração de editor
└── zaulis-coffee/
    ├── package.json          # Dependências npm
    ├── server.js             # Servidor Node.js
    ├── db.json               # Base de dados JSON
    ├── script.js             # JavaScript front-end
    ├── style.css             # Estilos CSS
    ├── reset-cart.html       # Página de reset
    └── fotos/                # Imagens dos produtos
        ├── logo.png
        ├── logo2.png
        ├── cafe.png
        ├── capsulas.png
        └── cafes.png
```

## Configuração Inicial

1. **Adicione seus produtos em `zaulis-coffee/db.json`:**
```json
{
  "products": [
    {
      "id": 1,
      "nome": "Seu Café",
      "descricao": "Descrição",
      "preco": 45.00,
      "imagem": "fotos/cafe.png"
    }
  ]
}
```

2. **Configure o número de WhatsApp em `zaulis-coffee/script.js`:**
```javascript
const WHATSAPP_NUMBER = 'seu_numero_aqui'; // ex: '5511991234567'
```

3. **Atualize as informações de contato em `index.html` footer**

## APIs Disponíveis

### GET `/api/products`
Retorna lista de produtos

### POST `/api/checkout`
Cria um novo pedido no banco de dados

### GET `/api/orders/:id`
Retorna detalhes de um pedido específico

## Performance

O projeto inclui:
- ✅ Compressão Gzip
- ✅ Cache headers para estáticos
- ✅ Lazy loading de imagens
- ✅ CSS e JS otimizados

## Segurança

O projeto implementa:
- ✅ Rate limiting (previne abuse)
- ✅ Validação de entrada
- ✅ CORS configurado
- ✅ Proteção contra price tampering

## Próximos Passos

1. Personalizar cores em `style.css`
2. Adicionar seus produtos ao `db.json`
3. Configurar número de WhatsApp
4. Testar fluxo de compra
5. Fazer deploy (Heroku, Vercel, etc)

## Suporte

- 📧 Email: zauliscoffee@gmail.com
- 💬 WhatsApp: +55 (11) 91124-5236

---

**Desenvolvido com ☕ para seu sucesso!**
