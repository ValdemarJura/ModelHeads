// Отримуємо елементи DOM
const cartIcon = document.getElementById('cartIcon');
const cartSidebar = document.getElementById('cartSidebar');
const closeCart = document.getElementById('closeCart');
const cartItems = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');
const cartCount = document.querySelector('.cart-count');

// Ініціалізуємо кошик з localStorage або створюємо новий
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Оновлюємо відображення кошика при завантаженні сторінки
updateCartDisplay();

// Відкриття/закриття кошика
cartIcon.addEventListener('click', () => {
    cartSidebar.classList.add('active');
});

closeCart.addEventListener('click', () => {
    cartSidebar.classList.remove('active');
});

// Додавання товару в кошик
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('add-to-cart')) {
        const button = e.target;
        const product = {
            id: button.dataset.id,
            name: button.dataset.name,
            price: parseInt(button.dataset.price),
            quantity: 1
        };

        addToCart(product);
    }
});

// Функція додавання товару в кошик
function addToCart(product) {
    const existingProduct = cart.find(item => item.id === product.id);

    if (existingProduct) {
        existingProduct.quantity += 1;
    } else {
        cart.push(product);
    }

    // Зберігаємо кошик в localStorage
    localStorage.setItem('cart', JSON.stringify(cart));

    // Оновлюємо відображення кошика
    updateCartDisplay();

    // Показуємо повідомлення про успішне додавання
    showNotification('Товар додано до кошика');
}

// Функція оновлення відображення кошика
function updateCartDisplay() {
    // Оновлюємо лічильник товарів
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;

    // Оновлюємо вміст кошика
    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="cart-item-details">
                <h4>${item.name}</h4>
                <p>Ціна: ${item.price} грн</p>
                <p>Кількість: 
                    <button onclick="updateQuantity('${item.id}', -1)">-</button>
                    <span>${item.quantity}</span>
                    <button onclick="updateQuantity('${item.id}', 1)">+</button>
                </p>
            </div>
            <button onclick="removeFromCart('${item.id}')" class="remove-item">&times;</button>
        </div>
    `).join('');

    // Оновлюємо загальну суму
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.textContent = `${total} грн`;
}

// Функція оновлення кількості товару
function updateQuantity(productId, change) {
    const product = cart.find(item => item.id === productId);
    
    if (product) {
        product.quantity += change;
        
        if (product.quantity <= 0) {
            removeFromCart(productId);
        } else {
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartDisplay();
        }
    }
}

// Функція видалення товару з кошика
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartDisplay();
}

// Функція показу повідомлення
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Фіксація шапки при прокручуванні
let lastScroll = 0;
const header = document.querySelector('.header');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll <= 0) {
        header.classList.remove('scroll-up');
    }

    if (currentScroll > lastScroll && !header.classList.contains('scroll-down')) {
        header.classList.remove('scroll-up');
        header.classList.add('scroll-down');
    }

    if (currentScroll < lastScroll && header.classList.contains('scroll-down')) {
        header.classList.remove('scroll-down');
        header.classList.add('scroll-up');
    }

    lastScroll = currentScroll;
});
