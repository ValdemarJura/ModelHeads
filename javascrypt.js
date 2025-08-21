// Функціонал слайдера для hero секції
function initHeroSlider() {
    const slides = document.querySelectorAll('.hero-slide');
    let currentSlide = 0;
    
    function showSlide(index) {
        slides.forEach(slide => slide.classList.remove('active'));
        slides[index].classList.add('active');
    }
    
    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }
    
    // Запускаємо автоматичну зміну слайдів кожні 5 секунд
    setInterval(nextSlide, 5000);
}

// Ініціалізуємо слайдер при завантаженні сторінки
document.addEventListener('DOMContentLoaded', initHeroSlider);

// Отримуємо елементи DOM
const cartIcon = document.getElementById('cartIcon');
const cartSidebar = document.getElementById('cartSidebar');
const closeCart = document.getElementById('closeCart');
const cartItems = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');
const cartCount = document.querySelector('.cart-count');

// Масив всіх товарів (в реальному проекті це мало б завантажуватися з бази даних)
const allProducts = [
    // Танки
    {
        id: "1",
        name: "Танк T-72",
        price: 1499,
        category: "tanks",
        scale: "1-72",
        image: "images/tank1.jpg"
    },
    {
        id: "4",
        name: "Танк Leopard 2",
        price: 1799,
        category: "tanks",
        scale: "1-32",
        image: "images/tank2.jpg"
    },
    {
        id: "7",
        name: "Танк Abrams M1A2",
        price: 2199,
        category: "tanks",
        scale: "1-32",
        image: "images/tank3.jpg"
    },
    {
        id: "8",
        name: "Танк Т-34-85",
        price: 1299,
        category: "tanks",
        scale: "1-72",
        image: "images/tank4.jpg"
    },

    // Літаки
    {
        id: "2",
        name: "Літак МіГ-29",
        price: 1899,
        category: "aircraft",
        scale: "1-48",
        image: "images/plane1.jpg"
    },
    {
        id: "5",
        name: "Літак F-16",
        price: 2099,
        category: "aircraft",
        scale: "1-48",
        image: "images/plane2.jpg"
    },
    {
        id: "9",
        name: "Літак Су-27",
        price: 2299,
        category: "aircraft",
        scale: "1-32",
        image: "images/plane3.jpg"
    },
    {
        id: "10",
        name: "Літак F-22 Raptor",
        price: 2499,
        category: "aircraft",
        scale: "1-32",
        image: "images/plane4.jpg"
    },

    // Гелікоптери
    {
        id: "3",
        name: "Гелікоптер Мі-24",
        price: 1699,
        category: "helicopters",
        scale: "1-72",
        image: "images/heli1.jpg"
    },
    {
        id: "6",
        name: "Гелікоптер Apache",
        price: 1999,
        category: "helicopters",
        scale: "1-32",
        image: "images/heli2.jpg"
    },
    {
        id: "11",
        name: "Гелікоптер Black Hawk",
        price: 1899,
        category: "helicopters",
        scale: "1-48",
        image: "images/heli3.jpg"
    },
    {
        id: "12",
        name: "Гелікоптер Ка-52",
        price: 2099,
        category: "helicopters",
        scale: "1-32",
        image: "images/heli4.jpg"
    },

    // Кораблі
    {
        id: "13",
        name: "Есмінець Type 45",
        price: 2699,
        category: "ships",
        scale: "1-32",
        image: "images/ship1.jpg"
    },
    {
        id: "14",
        name: "Авіаносець USS Nimitz",
        price: 2999,
        category: "ships",
        scale: "1-32",
        image: "images/ship2.jpg"
    },
    {
        id: "15",
        name: "Підводний човен Type 209",
        price: 2399,
        category: "ships",
        scale: "1-48",
        image: "images/ship3.jpg"
    }
];

// Функції для фільтрації та сортування
let currentFilters = {
    category: [],
    scale: [],
    price: []
};

let currentSort = '';

// Функція ініціалізації фільтрів та сортування
function initializeFiltersAndSort() {
    const filterInputs = document.querySelectorAll('.filter-option input');
    const sortSelect = document.querySelector('.sort-select');
    
    if (filterInputs) {
        filterInputs.forEach(input => {
            input.addEventListener('change', function() {
                const filterType = this.name;
                const value = this.value;
                
                if (this.checked) {
                    if (!currentFilters[filterType].includes(value)) {
                        currentFilters[filterType].push(value);
                    }
                } else {
                    currentFilters[filterType] = currentFilters[filterType].filter(item => item !== value);
                }
                
                updateProductDisplay();
            });
        });
    }
    
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            currentSort = this.value;
            updateProductDisplay();
        });
    }
}

// Функція фільтрації товарів
function filterProducts(products) {
    return products.filter(product => {
        // Перевірка категорії
        if (currentFilters.category.length > 0 && !currentFilters.category.includes(product.category)) {
            return false;
        }
        
        // Перевірка масштабу
        if (currentFilters.scale.length > 0 && !currentFilters.scale.includes(product.scale)) {
            return false;
        }
        
        // Перевірка ціни
        if (currentFilters.price.length > 0) {
            const price = product.price;
            return currentFilters.price.some(range => {
                if (range === '0-1000') return price <= 1000;
                if (range === '1000-2000') return price > 1000 && price <= 2000;
                if (range === '2000+') return price > 2000;
                return false;
            });
        }
        
        return true;
    });
}

// Функція сортування товарів
function sortProducts(products) {
    const sortedProducts = [...products];
    
    switch(currentSort) {
        case 'price-low':
            sortedProducts.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            sortedProducts.sort((a, b) => b.price - a.price);
            break;
        case 'popular':
            // Тут можна додати логіку сортування за популярністю
            break;
    }
    
    return sortedProducts;
}

// Функція оновлення відображення товарів
function updateProductDisplay() {
    const productsGrid = document.querySelector('.products-grid');
    if (!productsGrid) return;

    let filteredProducts = filterProducts(allProducts);
    filteredProducts = sortProducts(filteredProducts);
    
    productsGrid.innerHTML = filteredProducts.map(product => `
        <div class="product-card">
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p class="price">${product.price} грн</p>
            <button class="add-to-cart" data-id="${product.id}" data-name="${product.name}" data-price="${product.price}">
                Додати в кошик
            </button>
        </div>
    `).join('');
}

// Ініціалізуємо кошик з localStorage або створюємо новий
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Оновлюємо відображення кошика при завантаженні сторінки
updateCartDisplay();

// Ініціалізуємо фільтри та сортування при завантаженні сторінки
document.addEventListener('DOMContentLoaded', function() {
    initializeFiltersAndSort();
    updateProductDisplay();
});

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



        // Кольори в стилі хакі для анімації
        const khakiColors = [
            '#4B5320', // Темний хакі
            '#78866B', // Сіро-зелений хакі
            '#606C38', // Оливковий хакі
            '#515A3E', // Армійський хакі
            '#4A5D23', // Лісовий хакі
            '#6B735F'  // Пустельний хакі
        ];

        // Анімація для тексту
        const textAnimation = anime({
            targets: '.animated-title .letter',
            color: khakiColors,
            textShadow: [
                {value: '2px 2px 4px rgba(0, 0, 0, 0.3)'},
                {value: '2px 2px 8px rgba(0, 0, 0, 0.5)'},
                {value: '2px 2px 4px rgba(0, 0, 0, 0.3)'}
            ],
            scale: [
                {value: 1},
                {value: 1.1},
                {value: 1}
            ],
            rotate: [
                {value: -3},
                {value: 3},
                {value: 0}
            ],
            duration: 4000,
            delay: anime.stagger(100),
            loop: true,
            direction: 'alternate',
            easing: 'easeInOutSine'
        });

        // Додаткова анімація при наведенні
        const letters = document.querySelectorAll('.animated-title .letter');
        letters.forEach(letter => {
            letter.addEventListener('mouseover', () => {
                anime({
                    targets: letter,
                    scale: 1.4,
                    rotate: 15,
                    duration: 300,
                    color: khakiColors[Math.floor(Math.random() * khakiColors.length)]
                });
            });

            letter.addEventListener('mouseout', () => {
                anime({
                    targets: letter,
                    scale: 1,
                    rotate: 0,
                    duration: 300
                });
            });
        });