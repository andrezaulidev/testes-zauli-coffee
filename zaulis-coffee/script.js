const CART_STORAGE_KEY = 'carrinho';
const WHATSAPP_NUMBER = '5511911245236';
const TOAST_DURATION_MS = 3000;

let produtos = [];
let carrinho = loadCart();
let currentModalProductId = null;
let toastTimeoutId = null;

const menuToggle = document.getElementById('menuToggle');
const navMenu = document.getElementById('navMenu');
const productsGrid = document.getElementById('productsGrid');
const cartButton = document.getElementById('cartButton');
const cartModal = document.getElementById('cartModal');
const closeCart = document.getElementById('closeCart');
const cartItems = document.getElementById('cartItems');
const cartCount = document.getElementById('cartCount');
const cartTotal = document.getElementById('cartTotal');
const checkoutButton = document.getElementById('checkoutButton');
const clearCartButton = document.getElementById('clearCartButton');
const toast = document.getElementById('toast');
const toastMessage = document.getElementById('toastMessage');
const productModal = document.getElementById('productModal');
const closeModal = document.getElementById('closeModal');
const productModalImg = document.getElementById('productModalImg');
const productModalTitle = document.getElementById('productModalTitle');
const productModalDesc = document.getElementById('productModalDesc');
const productModalPrice = document.getElementById('productModalPrice');
const productModalQty = document.getElementById('productModalQty');
const productModalAdd = document.getElementById('productModalAdd');
const checkoutModal = document.getElementById('checkoutModal');
const closeCheckout = document.getElementById('closeCheckout');
const checkoutForm = document.getElementById('checkoutForm');
const themeToggle = document.getElementById('themeToggle');

const produtosMock = [
    {
        id: 1,
        nome: 'Café Torrado (em grãos) - 500g',
        descricao: 'Café torrado em grãos, perfeito para moer na hora e preservar o sabor fresco',
        preco: 45.0,
        imagem: 'zaulis-coffee/fotos/cafe.png'
    },
    {
        id: 2,
        nome: 'Café Torrado (em grãos) - 1kg',
        descricao: 'Café torrado em grãos, perfeito para moer na hora e preservar o sabor fresco',
        preco: 90.0,
        imagem: 'zaulis-coffee/fotos/cafe.png'
    },
    {
        id: 3,
        nome: 'Café Torrado (Moído) - 500g',
        descricao: 'Café torrado e moído, perfeito para sua xícara diária',
        preco: 45.0,
        imagem: 'zaulis-coffee/fotos/cafe.png'
    },
    {
        id: 4,
        nome: 'Café Torrado (Moído) - 1kg',
        descricao: 'Café torrado e moído, perfeito para sua xícara diária',
        preco: 90.0,
        imagem: 'zaulis-coffee/fotos/cafe.png'
    },
    {
        id: 5,
        nome: 'Cápsulas para Máquinas de cápsulas - 8 unidades',
        descricao: 'Cápsulas compatíveis com máquinas de café expresso, para uma preparação rápida e prática',
        preco: 40.0,
        imagem: 'zaulis-coffee/fotos/capsulas.png'
    },
    {
        id: 6,
        nome: 'Kit 5 pacotes de Café Torrado Moído - 1kg cada',
        descricao: 'Kit com 5kg de café torrado em grãos, para se ',
        preco: 190.0,
        precoOriginal: 225.0,
        imagem: 'zaulis-coffee/fotos/cafes.png'
    }
];

function escapeHtml(value) {
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function formatCurrency(value) {
    return `R$ ${Number(value).toFixed(2)}`;
}

function resolveImagePath(imagem) {
    if (!imagem || typeof imagem !== 'string') return '';
    if (/^(https?:)?\/\//.test(imagem)) {
        return imagem;
    }
    return imagem.replace(/^\/+/, '').replace(/^\.\//, '');
}

function getCartTotal() {
    return carrinho.reduce((sum, item) => sum + item.preco * item.quantidade, 0);
}

function getCartItemCount() {
    return carrinho.reduce((sum, item) => sum + item.quantidade, 0);
}

function loadCart() {
    try {
        const stored = localStorage.getItem(CART_STORAGE_KEY);
        const parsed = stored ? JSON.parse(stored) : [];
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
}

function saveCart() {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(carrinho));
}

function renderPriceHtml(produto) {
    if (produto.precoOriginal) {
        return `
            <span class="price-original">${formatCurrency(produto.precoOriginal)}</span>
            <span class="product-price price-sale">${formatCurrency(produto.preco)}</span>
        `;
    }
    return `<span class="product-price">${formatCurrency(produto.preco)}</span>`;
}

function renderProducts() {
    if (!productsGrid) return;

    productsGrid.innerHTML = produtos
        .map(
            (produto) => `
        <div class="product-card" data-id="${produto.id}">
            <div class="product-image">
                <img src="${escapeHtml(resolveImagePath(produto.imagem))}" alt="${escapeHtml(produto.nome)}" loading="lazy" decoding="async">
            </div>
            <div class="product-info">
                <h3 class="product-title">${escapeHtml(produto.nome)}</h3>
                <p class="product-description">${escapeHtml(produto.descricao)}</p>
                <div class="product-footer">
                    ${renderPriceHtml(produto)}
                    <button class="add-to-cart" data-id="${produto.id}" aria-label="Adicionar ${escapeHtml(produto.nome)} ao carrinho">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                            <path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    `
        )
        .join('');
}

function showToast(message) {
    if (!toast || !toastMessage) return;

    toastMessage.textContent = message;
    toast.classList.add('show');

    if (toastTimeoutId) clearTimeout(toastTimeoutId);
    toastTimeoutId = setTimeout(() => {
        toast.classList.remove('show');
        toastTimeoutId = null;
    }, TOAST_DURATION_MS);
}

function addToCart(id, nome, preco, imagem, quantidade = 1) {
    const qty = Math.max(1, Number(quantidade) || 1);
    const normalizedImage = resolveImagePath(imagem);
    const item = carrinho.find((i) => i.id === id);

    if (item) {
        item.quantidade += qty;
    } else {
        carrinho.push({ id, nome, preco, imagem: normalizedImage, quantidade: qty });
    }

    saveCart();
    updateCart();
    animateCartIcon();
    showToast(`${nome} adicionado ao carrinho!`);
}

function updateCart() {
    if (!cartCount || !cartTotal || !cartItems) return;

    cartCount.textContent = getCartItemCount();
    cartTotal.textContent = formatCurrency(getCartTotal());

    if (carrinho.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">Seu carrinho está vazio</p>';
        return;
    }

    cartItems.innerHTML = carrinho
        .map(
            (item) => `
        <div class="cart-item" data-id="${item.id}">
            <div class="cart-item-image">
                <img src="${escapeHtml(resolveImagePath(item.imagem))}" alt="${escapeHtml(item.nome)}" loading="lazy" decoding="async">
            </div>
            <div class="cart-item-details">
                <div class="cart-item-title">${escapeHtml(item.nome)}</div>
                <div class="cart-item-price">${formatCurrency(item.preco)}</div>
                <div class="cart-item-controls">
                    <button class="quantity-btn" data-id="${item.id}" data-action="decrease" aria-label="Diminuir quantidade">−</button>
                    <span class="cart-item-quantity">${item.quantidade}</span>
                    <button class="quantity-btn" data-id="${item.id}" data-action="increase" aria-label="Aumentar quantidade">+</button>
                    <button class="remove-item" data-id="${item.id}" data-action="remove" aria-label="Remover ${escapeHtml(item.nome)} do carrinho">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                            <path d="M3 6h18M8 6v12a2 2 0 002 2h4a2 2 0 002-2V6M10 11v6M14 11v6M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    `
        )
        .join('');
}

function updateQuantity(id, change) {
    const item = carrinho.find((i) => i.id === id);
    if (!item) return;

    item.quantidade += change;
    if (item.quantidade <= 0) {
        removeFromCart(id, false);
        return;
    }

    saveCart();
    updateCart();
}

function removeFromCart(id, notify = true) {
    carrinho = carrinho.filter((i) => i.id !== id);
    saveCart();
    updateCart();
    if (notify) showToast('Item removido do carrinho');
}

function resetCart() {
    carrinho = [];
    saveCart();
    updateCart();
}

function animateCartIcon() {
    if (!cartCount) return;
    cartCount.classList.add('pulse');
    setTimeout(() => cartCount.classList.remove('pulse'), 600);
}

function setModalOpen(isOpen) {
    document.body.classList.toggle('modal-open', isOpen);
}

function setupFocusTrap(modal) {
    const focusableElements = modal.querySelectorAll(
        'button, [href], input, textarea, select, [tabindex]:not([tabindex="-1"])'
    );
    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleKeyDown = (e) => {
        if (e.key !== 'Tab') return;
        if (e.shiftKey && document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
        }
    };

    modal.addEventListener('keydown', handleKeyDown);
    modal._focusTrapHandler = handleKeyDown;
}

function openCartModal() {
    if (!cartModal) return;
    cartModal.classList.add('active');
    setModalOpen(true);
}

function closeCartModal() {
    if (!cartModal) return;
    cartModal.classList.remove('active');
    if (!isAnyModalOpen()) setModalOpen(false);
}

function isAnyModalOpen() {
    const productOpen = productModal?.getAttribute('aria-hidden') === 'false';
    const checkoutOpen = checkoutModal?.getAttribute('aria-hidden') === 'false';
    const cartOpen = cartModal?.classList.contains('active');
    return Boolean(productOpen || checkoutOpen || cartOpen);
}

function openProductModal(id) {
    const produto = produtos.find((p) => p.id === id);
    if (!produto || !productModal) return;

    productModalImg.src = resolveImagePath(produto.imagem);
    productModalImg.alt = produto.nome;
    productModalTitle.textContent = produto.nome;
    productModalDesc.textContent = produto.descricao;
    productModalPrice.innerHTML = renderPriceHtml(produto);

    if (productModalQty) productModalQty.value = 1;
    currentModalProductId = id;

    productModal.setAttribute('aria-hidden', 'false');
    productModal.tabIndex = -1;
    setupFocusTrap(productModal);
    productModal.focus();
    setModalOpen(true);
}

function closeProductModal() {
    if (!productModal) return;
    productModal.setAttribute('aria-hidden', 'true');
    if (!isAnyModalOpen()) setModalOpen(false);
}

function openCheckoutModal() {
    checkoutModal.tabIndex = -1;
    setupFocusTrap(checkoutModal);
    checkoutModal.focus();
    if (!checkoutModal) return;
    checkoutModal.style.display = 'flex';
    checkoutModal.setAttribute('aria-hidden', 'false');
    setModalOpen(true);
}

function closeCheckoutModal() {
    if (!checkoutModal) return;
    checkoutModal.style.display = 'none';
    checkoutModal.setAttribute('aria-hidden', 'true');
    if (!isAnyModalOpen()) setModalOpen(false);
}

function buildWhatsAppMessage({ name, phone, address, reference }) {
    const itemsText = carrinho
        .map((item) => `• ${item.nome} - ${item.quantidade}x ${formatCurrency(item.preco)}`)
        .join('\n');

    const referenceLine = reference ? `*Complemento/Referência:* ${reference}\n` : '';

    return (
        `*NOVO PEDIDO - Zauli's Coffee*\n\n` +
        `*Cliente:* ${name}\n` +
        `*Telefone:* ${phone}\n` +
        `*Endereço:* ${address}\n` +
        referenceLine +
        `\n*Itens do Pedido:*\n${itemsText}\n\n` +
        `*Total: ${formatCurrency(getCartTotal())}*\n\n` +
        `Obrigado pela preferência!`
    );
}

function initTestimonials() {
    let currentSlide = 0;
    const testimonials = document.querySelectorAll('.testimonial');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.slider-btn.prev');
    const nextBtn = document.querySelector('.slider-btn.next');

    if (testimonials.length === 0) return;

    function showSlide(n) {
        testimonials.forEach((t) => t.classList.remove('active'));
        dots.forEach((d) => d.classList.remove('active'));
        const idx = ((n % testimonials.length) + testimonials.length) % testimonials.length;
        testimonials[idx].classList.add('active');
        if (dots[idx]) dots[idx].classList.add('active');
    }

    prevBtn?.addEventListener('click', () => {
        currentSlide = (currentSlide - 1 + testimonials.length) % testimonials.length;
        showSlide(currentSlide);
    });

    nextBtn?.addEventListener('click', () => {
        currentSlide = (currentSlide + 1) % testimonials.length;
        showSlide(currentSlide);
    });

    if (dots.length === testimonials.length) {
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                currentSlide = index;
                showSlide(currentSlide);
            });
        });
    }
}

function initTheme() {
    const savedTheme = localStorage.getItem('theme');

    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
    } else if (savedTheme === 'light') {
        document.body.classList.remove('dark-theme');
    } else if (window.matchMedia?.('(prefers-color-scheme: dark)').matches) {
        document.body.classList.add('dark-theme');
    } else {
        document.body.classList.remove('dark-theme');
    }

    updateThemeIcon();
}

function updateThemeIcon() {
    if (!themeToggle) return;
    const isDark = document.body.classList.contains('dark-theme');

    if (isDark) {
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        themeToggle.setAttribute('aria-label', 'Ativar modo claro');
    } else {
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        themeToggle.setAttribute('aria-label', 'Ativar modo escuro');
    }
}

function toggleTheme() {
    const isDark = document.body.classList.contains('dark-theme');

    if (isDark) {
        document.body.classList.remove('dark-theme');
        localStorage.setItem('theme', 'light');
        showToast('Modo claro ativado!');
    } else {
        document.body.classList.add('dark-theme');
        localStorage.setItem('theme', 'dark');
        showToast('Modo escuro ativado!');
    }

    updateThemeIcon();
}

async function loadProducts() {
    try {
        const response = await fetch('./zaulis-coffee/db.json', { cache: 'no-store' });
        if (!response.ok) throw new Error('Falha ao carregar produtos');

        const data = await response.json();
        if (Array.isArray(data.products) && data.products.length > 0) {
            return data.products;
        }
    } catch (error) {
        console.warn('Usando produtos locais:', error);
    }

    return produtosMock;
}

function bindEvents() {
    cartButton?.addEventListener('click', (e) => {
        e.preventDefault();
        openCartModal();
    });

    closeCart?.addEventListener('click', closeCartModal);

    checkoutButton?.addEventListener('click', (e) => {
        e.preventDefault();
        if (carrinho.length === 0) {
            showToast('Seu carrinho está vazio!');
            return;
        }
        openCheckoutModal();
    });

    clearCartButton?.addEventListener('click', (e) => {
        e.preventDefault();
        if (carrinho.length === 0) {
            showToast('Seu carrinho já está vazio!');
            return;
        }
        if (confirm('Tem certeza que deseja limpar o carrinho?')) {
            resetCart();
            showToast('Carrinho limpo com sucesso!');
        }
    });

    menuToggle?.addEventListener('click', () => {
        const isOpen = navMenu?.classList.toggle('active');
        menuToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    document.querySelectorAll('.nav-menu a').forEach((link) => {
        link.addEventListener('click', () => {
            navMenu?.classList.remove('active');
            menuToggle?.setAttribute('aria-expanded', 'false');
        });
    });

    productsGrid?.addEventListener('click', (e) => {
        const addBtn = e.target.closest('.add-to-cart');
        if (addBtn) {
            e.preventDefault();
            e.stopPropagation();
            const id = Number(addBtn.dataset.id);
            const produto = produtos.find((p) => p.id === id);
            if (produto) addToCart(id, produto.nome, produto.preco, produto.imagem);
            return;
        }

        const card = e.target.closest('.product-card');
        if (!card) return;
        const id = Number(card.dataset.id);
        if (!Number.isNaN(id)) openProductModal(id);
    });

    cartItems?.addEventListener('click', (e) => {
        const btn = e.target.closest('button');
        if (!btn?.dataset) return;

        const id = Number(btn.dataset.id);
        const action = btn.dataset.action;
        if (Number.isNaN(id) || !action) return;

        if (action === 'increase') updateQuantity(id, 1);
        else if (action === 'decrease') updateQuantity(id, -1);
        else if (action === 'remove') removeFromCart(id);
    });

    closeModal?.addEventListener('click', closeProductModal);
    productModal?.addEventListener('click', (e) => {
        if (e.target === productModal) closeProductModal();
    });

    productModalAdd?.addEventListener('click', () => {
        if (!currentModalProductId) return;

        const id = Number(currentModalProductId);
        const produto = produtos.find((p) => p.id === id);
        if (!produto) return;

        const qty = Math.max(1, Math.min(100, Number(productModalQty?.value) || 1));
        addToCart(id, produto.nome, produto.preco, produto.imagem, qty);
        closeProductModal();
    });

    closeCheckout?.addEventListener('click', closeCheckoutModal);
    checkoutModal?.addEventListener('click', (e) => {
        if (e.target === checkoutModal) closeCheckoutModal();
    });

    checkoutForm?.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('checkoutName')?.value.trim() || '';
        const email = document.getElementById('checkoutEmail')?.value.trim() || '';
        const phone = document.getElementById('checkoutPhone')?.value.trim() || '';
        const address = document.getElementById('checkoutAddress')?.value.trim() || '';
        const reference = document.getElementById('checkoutReference')?.value.trim() || '';

        if (carrinho.length === 0) {
            showToast('Seu carrinho está vazio');
            return;
        }

        if (!name || !email || !phone || !address) {
            showToast('Por favor, preencha todos os campos obrigatórios');
            return;
        }

        // Validar telefone (10-11 dígitos)
        const cleanPhone = phone.replace(/\D/g, '');
        const phoneRegex = /^\d{10,11}$/;
        if (!phoneRegex.test(cleanPhone)) {
            showToast('Telefone deve ter 10 ou 11 dígitos');
            return;
        }

        // Validar email básico
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showToast('Email inválido');
            return;
        }

        const message = buildWhatsAppMessage({ name, phone, address, reference });

        closeCheckoutModal();
        closeCartModal();

        window.open(
            `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`,
            '_blank',
            'noopener,noreferrer'
        );

        resetCart();
        checkoutForm.reset();
        showToast('Pedido enviado com sucesso!');
    });

    themeToggle?.addEventListener('click', toggleTheme);

    document.addEventListener('keydown', (e) => {
        if (e.key !== 'Escape') return;
        closeProductModal();
        closeCheckoutModal();
        closeCartModal();
        navMenu?.classList.remove('active');
        menuToggle?.setAttribute('aria-expanded', 'false');
    });

    window.matchMedia?.('(prefers-color-scheme: dark)')?.addEventListener('change', (e) => {
        if (localStorage.getItem('theme')) return;

        document.body.classList.toggle('dark-theme', e.matches);
        updateThemeIcon();
    });
}

async function init() {
    initTheme();
    produtos = await loadProducts();
    renderProducts();
    updateCart();
    initTestimonials();
    bindEvents();
}

document.addEventListener('DOMContentLoaded', init);
