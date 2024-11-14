import { getElement } from "../util/util.js";
import { formatPrice } from "../util/util.js";

/* ------------------------------ Main Function ----------------------------- */
const renderCart = () => {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const cartContainer = getElement("#shopping-cart");
  let allCartContent = "";
  let totalBill = 0;
  let itemQuantity = 0;

  cartContainer.innerHTML = "";

  cart.forEach((item, index) => {
    itemQuantity += item.quantity;
    totalBill += item.price * item.quantity;

    let cartContent = `
        <div class="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 md:p-6">
            <div class="space-y-4 md:flex md:items-center md:justify-between md:gap-6 md:space-y-0">
                <a href="#" class="shrink-0 md:order-1">
                    <img class="h-20 w-20"
                        src="${item.img}"
                        alt="product img" />
                </a>

                <label for="counter-input" class="sr-only">Choose quantity:</label>
                <div class="flex items-center justify-between md:order-3 md:justify-end">
                    <div class="flex items-center">
                        <button 
                            type="button" 
                            onclick="decrementQuantity('${item.id}')"
                            id="decrement-button-${item.id}"
                            data-input-counter-decrement="counter-input-${
                              item.id
                            }"
                            class="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-gray-300 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700">
                            <i class="text-gray-900 dark:text-white fa-solid fa-minus"></i>
                        </button>
                        <input 
                            type="text" 
                            id="counter-input-${item.id}" 
                            data-input-counter
                            class="w-10 shrink-0 border-0 bg-transparent text-center text-sm font-medium text-gray-900 focus:outline-none focus:ring-0 dark:text-white"
                            value="${item.quantity}" 
                            onchange="handleQuantityChange(this)"
                            required />
                        <button 
                            type="button"
                            onclick="incrementQuantity('${item.id}')"
                            id="increment-button-${item.id}"
                            data-input-counter-increment="counter-input-${
                              item.id
                            }"
                            class="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-gray-300 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700">
                            <i class="text-gray-900 dark:text-white fa-solid fa-plus"></i>
                        </button>
                    </div>
                    <div class="text-end md:order-4 md:w-32">
                        <p class="text-base font-bold text-gray-900 dark:text-white">${formatPrice(
                          item.price * item.quantity
                        )}</p>
                    </div>
                </div>

                <div class="w-full min-w-0 flex-1 space-y-4 md:order-2 md:max-w-md">
                    <a href="#" class="text-base font-medium text-gray-900 hover:underline dark:text-white">
                        ${item.name}
                    </a>

                    <div class="flex items-center gap-4">
                        <button type="button"
                            class="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                            <i class="me-1.5 fa-regular fa-heart"></i>
                            Add to Favorites
                        </button>

                        <button type="button"
                            onclick="removeFromCart('${item.id}')"
                            class="inline-flex items-center text-sm font-medium text-red-500 hover:text-red-800 dark:text-red-500">
                            <i class="me-1.5 fa-solid fa-xmark"></i>
                            Remove
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;

    allCartContent += cartContent;
  });

  //   Update Shopping Cart Content
  getElement("#shopping-cart").innerHTML = allCartContent;
  getElement("#cart-quantity").innerHTML = itemQuantity;
};
renderCart();

// Functions to handle quantity updates
window.updateQuantity = (productId, newQuantity) => {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  const productIndex = cart.findIndex((item) => item.id === productId);

  if (productIndex !== -1) {
    const quantity = Math.max(1, parseInt(newQuantity) || 1);
    cart[productIndex].quantity = quantity;
    localStorage.setItem("cart", JSON.stringify(cart));
    renderCart();
  } else {
    console.log("Product not found:", productId);
  }
};

// Handle direct input change
window.handleQuantityChange = (input) => {
  const productId = input.dataset.productId;
  const newQuantity = parseInt(input.value) || 1;
  updateQuantity(productId, newQuantity);
};

// Increment quantity
window.incrementQuantity = (productId) => {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const product = cart.find((item) => item.id === productId);
  if (product) {
    updateQuantity(productId, product.quantity + 1);
  }
  calculateTotalPrice();
};

// Decrement quantity
window.decrementQuantity = (productId) => {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const product = cart.find((item) => item.id === productId);
  if (product && product.quantity > 1) {
    updateQuantity(productId, product.quantity - 1);
  }
  calculateTotalPrice();
};

// Remove from cart
window.removeFromCart = (productId) => {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart = cart.filter((item) => item.id !== productId);
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
  calculateTotalPrice();
};

// Function to calculate Total Cart Price
const calculateTotalPrice = () => {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  let initialPrice = cart.reduce((acc, item) => {
    return acc + item.price * item.quantity;
  }, 0);

  const vatTax = initialPrice * 0.1;

  const totalPrice = initialPrice + vatTax + 20;

  getElement("#vat-tax").innerHTML = `${formatPrice(vatTax)}`;
  getElement("#origin-cost").innerHTML = `${formatPrice(initialPrice)}`;
  getElement("#final-cost").innerHTML = `${formatPrice(totalPrice)}`;
};

calculateTotalPrice();

// Function To Process Payment
window.processPayment = () => {
  const button = document.getElementById("checkout-button");
  const textSpan = document.getElementById("button-text");
  const loadingSpan = document.getElementById("button-loading");
  const successSpan = document.getElementById("button-success");

  // Disable button and show loading state
  button.disabled = true;
  textSpan.classList.add("invisible", "opacity-0");
  loadingSpan.classList.remove("invisible", "opacity-0");
  button.classList.add("bg-primary-600", "cursor-wait");

  // Simulate processing for 1.5 seconds
  setTimeout(() => {
    // Hide loading state
    loadingSpan.classList.add("invisible", "opacity-0");

    // Show success state
    successSpan.classList.remove("invisible", "opacity-0");
    button.classList.remove("bg-primary-600", "cursor-wait");
    button.classList.add("bg-green-600");

    // Process the payment and clear cart
    localStorage.removeItem("cart");
    renderCart();
    calculateTotalPrice();

    // Reset button after 1.5 seconds
    setTimeout(() => {
      successSpan.classList.add("invisible", "opacity-0");
      textSpan.classList.remove("invisible", "opacity-0");
      button.classList.remove("bg-green-600");
      button.disabled = false;
    }, 3000);
  }, 3000);
};

/* --------------------------- Darkmode Operation --------------------------- */

const themeToggleDarkIcon = getElement("#theme-toggle-dark-icon");
const themeToggleLightIcon = getElement("#theme-toggle-light-icon");

if (document.documentElement.classList.contains("dark")) {
  themeToggleLightIcon.classList.remove("hidden");
  themeToggleDarkIcon.classList.add("hidden");
} else {
  themeToggleDarkIcon.classList.remove("hidden");
  themeToggleLightIcon.classList.add("hidden");
}

window.modeOperation = () => {
  themeToggleDarkIcon.classList.toggle("hidden");
  themeToggleLightIcon.classList.toggle("hidden");

  document.documentElement.classList.toggle("dark");
};
