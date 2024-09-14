import productsData from "../data/products.json";
import { v4 as uuidv4 } from "uuid";

const products: Product[] = [];

const productListElement: HTMLUListElement | null = document.querySelector(
  ".product-list__list",
);

const iconsURL = new URL("../assets/icons.svg", import.meta.url);

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
}

class ProductUIHandler {
  constructor(private readonly product: Product) {}

  renderProduct() {
    const productData = this.product.data;
    const markup = `
    <li class="product product-list__product" data-id=${productData.id}>
      <div class="product__image-box">
        <img
          srcset="
            ${productData.image.tablet} 427w,
            ${productData.image.desktop} 502w,
            ${productData.image.mobile} 654w
          "
          sizes="(max-width: 47.937rem) 654px, (max-width: 63.937rem) 427px, 502px"
          src="${productData.image.mobile}"
          alt="${productData.name}"
          class="product__image"
        />

        <button class="button button--type-add-to-cart product__button">
          <svg class="button__icon button__icon--type-add-to-cart">
            <use href="${iconsURL.toString()}#add-to-cart" />
          </svg>
          Add to Cart
        </button>
        <button
          class="button button--type-product-quantity button--hidden product__button"
        >
          <svg class="button__icon button__icon--type-increment-quantity">
            <use href="${iconsURL.toString()}#increment-quantity" />
          </svg>
          <svg class="button__icon button__icon--type-decrement-quantity">
            <use href="${iconsURL.toString()}#decrement-quantity" />
          </svg>
          ${productData.quantity.toString()}
        </button>
      </div>

      <div class="product__text-content">
        <p class="product__category">${productData.category}</p>
        <p class="product__name">${productData.name}</p>
        <p class="product__price">$${productData.price.toFixed(2)}</p>
      </div>
    </li>
    `;

    productListElement?.insertAdjacentHTML("beforeend", markup);
  }
}

for (const productData of productsData) {
  const product = new Product(
    productData.name,
    productData.category,
    productData.price,
    productData.image,
  );
  const productUIHandler = new ProductUIHandler(product);

  products.push(product);
  // productUIHandler.renderProduct();
}

productListElement?.addEventListener("click", (e) => {
  if ((e.target as Element).matches(".button--type-add-to-cart")) {
    const productQuantityButton: HTMLButtonElement | null | undefined = (
      e.target as Element
    ).parentElement?.querySelector(".button--type-product-quantity");

    if (productQuantityButton) {
      (e.target as Element).classList.add("button--hidden");
      productQuantityButton.classList.remove("button--hidden");
    }
  }
});
