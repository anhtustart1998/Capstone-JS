import { ecomProductServices } from "../services/EcomProductService.js";
import { getElement } from "../util/util.js";
import EcommerceProduct from "../models/ProductModel.js";

/* ---------------------------- Main JS Functions --------------------------- */
// All Product Data is global
let allProducts = [];

// Render all products into UI
const renderAllProduct = (allProduct) => {
  let content = "";

  const selectedType = getElement("#type-select").value;
  const selectedPriceSort = getElement("#price-sort").value;
  const searchQuery = getElement("#search-input").value.toLowerCase();

  // Fetching Product Brand/Type
  const uniqueTypes = [...new Set(allProduct.map((p) => p.type))];
  const brandFilterContent = uniqueTypes
    .map((type) => `<option value="${type}">${type}</option>`)
    .join("");

  getElement("#type-select").innerHTML = `
    <option value="all" selected>Choose a Brand</option>
    ${brandFilterContent}
  `;
  getElement("#type-select").value = selectedType;

  let filteredProducts = allProduct.filter((product) => {
    const matchesType = selectedType === "all" || product.type === selectedType;
    const matchesSearch =
      typeof product.name === "string" &&
      product.name.toLowerCase().includes(searchQuery);
    return matchesType && matchesSearch;
  });

  if (selectedPriceSort === "sort-asc") {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (selectedPriceSort === "sort-desc") {
    filteredProducts.sort((a, b) => b.price - a.price);
  }

  filteredProducts.forEach((eachProduct) => {
    let contentDiv = `
    <div class="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
  <a href="#" class="block overflow-hidden group">
    <img class="p-8 rounded-t-lg transition-transform duration-300 group-hover:scale-105" 
         src="${eachProduct.img}"
         alt="product image" />
  </a>
  <div class="px-5 pb-5 space-y-3">
    <div class="flex items-start justify-between">
      <span class="inline-flex items-center bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-blue-900/30 dark:text-blue-400 border border-blue-400">
        <i class="fa-regular fa-circle-check mr-1"></i>
        ${eachProduct.type}
      </span>
      <span class="text-xs text-gray-500 dark:text-gray-400">In Stock</span>
    </div>
    
    <a href="#" class="block group">
      <h5 class="text-xl font-semibold tracking-tight text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors duration-200">
        ${eachProduct.name}
      </h5>
    </a>

    <ul class="grid grid-cols-2 gap-3 border-t border-gray-100 dark:border-gray-700 pt-3">
      <li class="flex items-center gap-2 mt-2">
        <i class="fa-solid fa-camera shrink-0 text-gray-500 dark:text-gray-400 text-xs"></i>
        <p class="text-xs font-medium text-gray-500 dark:text-gray-400 truncate">
          ${eachProduct.backCamera}
        </p>
      </li>
      <li class="flex items-center gap-2 mt-2">
        <i class="fa-solid fa-mobile-screen shrink-0 text-gray-500 dark:text-gray-400 text-sm"></i>
        <p class="text-xs font-medium text-gray-500 dark:text-gray-400 truncate">
          ${eachProduct.screen}
        </p>
      </li>
    </ul>

    <div class="flex items-center justify-between pt-2">
      <div class="space-y-1">
        <p class="text-sm text-gray-500 dark:text-gray-400">Price</p>
        <span class="text-3xl font-bold text-gray-900 dark:text-white">
          $${eachProduct.price}
        </span>
      </div>
      <button onclick="addToCart('${eachProduct.id}')"
        class="add-to-cart-btn inline-flex items-center gap-2 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 transition-colors duration-200">
        <i class="fa-solid fa-cart-shopping"></i>
        Buy Now
      </button>
    </div>
  </div>
</div>
    `;

    content += contentDiv;
  });

  // Update the HTML content
  getElement("#all-product").innerHTML = content;
};

/* ----------------------------- CRUD OPERATION ----------------------------- */

// Fetch all products from DB
const fetchAllProducts = () => {
  ecomProductServices
    .getProduct()
    .then((response) => {
      allProducts = response.data;
      renderAllProduct(allProducts);
    })
    .catch((error) => {
      console.error(error);
    });
};
// Call Function Whenever The App Runs
fetchAllProducts();
// Call Function Whenever The Dropdown & Input is used
getElement("#type-select").addEventListener("change", fetchAllProducts);
getElement("#price-sort").addEventListener("change", fetchAllProducts);
getElement("#search-input").addEventListener("input", fetchAllProducts);

// Add products to Cart Function
window.addToCart = (productId) => {
  const product = allProducts.find((item) => item.id === productId);

  if (!product) {
    console.error(`Product with id ${productId} not found`);
    return;
  }

  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  const existingProduct = cart.find((item) => item.id === product.id);
  if (existingProduct) {
    existingProduct.quantity += 1;
  } else {
    product.quantity = 1;
    cart.push(product);
  }
  localStorage.setItem("cart", JSON.stringify(cart));
  countCartItem();
};

// Function To Show All Cart Quantity That's has been selected by Users.
window.countCartItem = () => {
  const cartItem = JSON.parse(localStorage.getItem("cart")) || [];
  let cartQuantity = 0;

  cartItem.forEach((item) => {
    cartQuantity += item.quantity;
  });
  getElement("#cart-quantity").innerHTML = cartQuantity;
};
countCartItem();

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
