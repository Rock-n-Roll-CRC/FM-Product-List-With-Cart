import productsData from "../data/products.json";
import { v4 as uuidv4 } from "uuid";

// Global Constants
const ICONS_URL = new URL("../assets/icons.svg", import.meta.url);

// DOM Elements
const productListElement: HTMLUListElement | null = document.querySelector(
  ".product-list__list",
);

// Product Implementation
class Product {
  private readonly id = uuidv4();
  private quantity = 0;

  constructor(
    private readonly name: string,
    private readonly category: string,
    private readonly price: number,
    private readonly image: {
      thumbnail: string;
      mobile: string;
      tablet: string;
      desktop: string;
    },
  ) {}

  get data() {
    return {
      id: this.id,
      quantity: this.quantity,
      name: this.name,
      category: this.category,
      price: this.price,
      image: this.image,
    };
  }

  incrementQuantity() {
    this.quantity++;
  }

  decrementQuantity() {
    if (this.quantity > 0) this.quantity--;
  }
}

class ProductUIHandler {
  static renderProduct(product: Product) {
    const markup = `
    <li class="product product-list__product" data-id=${product.data.id}>
      <div class="product__image-box">
        <img
          srcset="
            ${product.data.image.tablet}  427w,
            ${product.data.image.desktop} 502w,
            ${product.data.image.mobile}  654w
          "
          sizes="(max-width: 47.937rem) 654px, (max-width: 63.937rem) 427px, 502px"
          src="${product.data.image.mobile}"
          alt="${product.data.name}"
          class="product__image"
        />

        <button class="button button--type-add-to-cart product__button">
          <svg class="button__icon button__icon--type-add-to-cart">
            <use href="${ICONS_URL.toString()}#add-to-cart" />
          </svg>
          Add to Cart
        </button>
        <div
          class="button button--type-product-quantity button--hidden product__button"
        >
          <button
            class="button button--type-increment-quantity product__button product__button--type-increment-quantity"
          >
            <svg
              class="button__icon button__icon--type-increment-quantity"
            >
              <use href="${ICONS_URL.toString()}#increment-quantity" />
            </svg>
          </button>
          <button
            class="button button--type-decrement-quantity product__button product__button--type-decrement-quantity"
          >
            <svg
              class="button__icon button__icon--type-decrement-quantity"
            >
              <use href="${ICONS_URL.toString()}#decrement-quantity" />
            </svg>
          </button>
          ${product.data.quantity.toString()}
        </div>
      </div>

      <div class="product__text-content">
        <p class="product__category">${product.data.category}</p>
        <p class="product__name">${product.data.name}</p>
        <p class="product__price">$${product.data.price.toFixed(2)}</p>
      </div>
    </li>
    `;

    productListElement?.insertAdjacentHTML("beforeend", markup);
  }

  static updateQuantity(product: Product) {
    const productElement: HTMLLIElement | null = document.querySelector(
      `.product[data-id="${product.data.id}"]`,
    );
    const productQuantityNode = productElement?.querySelector(
      ".button--type-product-quantity",
    )?.lastChild;

    if (productQuantityNode)
      productQuantityNode.textContent = product.data.quantity.toString();
  }
}

// Initialising products
const products: Product[] = productsData.map(
  (productData) =>
    new Product(
      productData.name,
      productData.category,
      productData.price,
      productData.image,
    ),
);
products.forEach((product) => {
  ProductUIHandler.renderProduct(product);
});

// Utility Functions
const getProductById = (id: string) => {
  return products.find((product) => product.data.id === id);
};

// Listening For Events
productListElement?.addEventListener("click", (e) => {
  const targetElement = e.target as HTMLElement;

  // Hiding/Showing Buttons
  if (targetElement.closest(".button--type-add-to-cart")) {
    const productElement: HTMLLIElement | null =
      targetElement.closest(".product");

    if (productElement) {
      const addToCartButton: HTMLButtonElement | null =
        productElement.querySelector(".button--type-add-to-cart");
      const productQuantityButton: HTMLButtonElement | null =
        productElement.querySelector(".button--type-product-quantity");

      addToCartButton?.classList.add("button--hidden");
      productQuantityButton?.classList.remove("button--hidden");
    }
  }

  // Handling Product Quantity
  if (
    targetElement.closest(".button--type-increment-quantity") ||
    targetElement.closest(".button--type-decrement-quantity")
  ) {
    const productElement: HTMLLIElement | null =
      targetElement.closest(".product");
    const productElementId = productElement?.dataset.id;

    if (productElementId) {
      const product = getProductById(productElementId);

      if (product) {
        if (targetElement.closest(".button--type-increment-quantity")) {
          product.incrementQuantity();
          ProductUIHandler.updateQuantity(product);
        }

        if (targetElement.closest(".button--type-decrement-quantity")) {
          product.decrementQuantity();
          ProductUIHandler.updateQuantity(product);
        }
      }
    }
  }
});
