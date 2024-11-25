import EcommerceProduct from "../models/ProductModel.js";
import { ecomProductServices } from "../services/EcomProductService.js";
import { getElement } from "../util/util.js";

function show_AddProduct() {
  document.getElementById("addSPModal").classList.remove("hidden");
  getElement("#IdSP").value = "";
  getElement("#NameSP").value = "";
  getElement("#PriceSP").value = "";
  getElement("#Screen").value = "";
  getElement("#BackCamera").value = "";
  getElement("#FrontCamera").value = "";
  getElement("#imgSP").value = "";
  getElement("#Type").value = "";
  getElement("#node").value = "";

  getElement("#btn_Them").classList.remove("hidden");
  getElement("#btn_CapNhat").classList.add("hidden");
}
window.show_AddProduct = show_AddProduct;

function show_EditProductModal() {
  document.getElementById("addSPModal").classList.remove("hidden");
  getElement("#btn_Them").classList.add("hidden");
  getElement("#btn_CapNhat").classList.remove("hidden");
}
window.show_EditProductModal = show_EditProductModal;

function closeFormAdd() {
  document.getElementById("addSPModal").classList.add("hidden");
}
window.closeFormAdd = closeFormAdd;

const renderProducts = (arrProducts) => {
  const content = arrProducts
    .map(
      ({
        id,
        name,
        price,
        screen,
        backCamera,
        frontCamera,
        img,
        type,
        desc,
      }) => `
    <tr>
      <td class="py-1 px-2 border text-center">${id}</td>
      <td class="py-1 px-2  border">${name}</td>
      <td class="py-1 px-2  border">
        <img width="200" src="${img}">
      </td>
      <td class="py-1 px-2  border">${price} VNĐ</td>
      <td class="py-1 px-2  border">${desc}</td>
      <td class="py-1 px-2  border text-center">
        <button onclick="editProduct(${id})" class="bg-yellow-500 text-white px-2 py-1 m-4 rounded">Sửa</button>
        <button onclick="delProduct(${id})" class="bg-red-500 text-white px-2 py-1 m-4 rounded">Xóa</button>
      </td>
    </tr>
`
    )
    .join("");
  document.querySelector("#product_table").innerHTML = content;
};

const getInfo = () => {
  let id = getElement("#IdSP").value;
  let name = getElement("#NameSP").value;
  let price = getElement("#PriceSP").value;
  let screen = getElement("#Screen").value;
  let backCamera = getElement("#BackCamera").value;
  let frontCamera = getElement("#FrontCamera").value;
  let img = getElement("#imgSP").value;
  let type = getElement("#Type").value;
  let desc = getElement("#node").value;
  return new EcommerceProduct(
    id,
    name,
    price,
    screen,
    backCamera,
    frontCamera,
    img,
    type,
    desc
  );
};

const fetchProducts = () => {
  ecomProductServices
    .getProduct()
    .then((response) => {
      renderProducts(response.data);
    })
    .catch((error) => {});
};
fetchProducts();

const delProduct = (id) => {
  ecomProductServices
    .deleteProduct(id)
    .then((response) => {
      fetchProducts();
    })
    .catch((error) => {});
};
window.delProduct = delProduct;

const editProduct = (id) => {
  ecomProductServices
    .getProductByID(id)
    .then((response) => {
      const product = response.data;
   
      getElement("#IdSP").value = product.id;
      getElement("#NameSP").value = product.name;
      getElement("#PriceSP").value = product.price;
      getElement("#Screen").value = product.screen;
      getElement("#BackCamera").value = product.backCamera;
      getElement("#FrontCamera").value = product.frontCamera;
      getElement("#imgSP").value = product.img;
      getElement("#Type").value = product.type;
      getElement("#node").value = product.desc;

      show_EditProductModal();

      getElement("#btn_Them").classList.add("hidden");
      getElement("#btn_CapNhat").classList.remove("hidden");

      getElement("#btn_CapNhat").onclick = () => {
        const updatedProduct = getInfo();
        if (!isValidPrice(updatedProduct.price)) {
          alert("Product price must be a positive integer!");
          return;
        }
        ecomProductServices
          .updateProduct(id, updatedProduct)
          .then(() => {
            fetchProducts();
            closeFormAdd();
          })
          .catch((error) => {
            console.error("Product update failed: ", error);
          });
      };
    })
    .catch((error) => {
      console.error("Unable to get product information: ", error);
    });
};
window.editProduct = editProduct;

const btn_addProduct = () => {
  const product = getInfo();
  if (!isValidPrice(product.price)) {
    alert("Product price must be a positive integer!");
    return;
  }

  ecomProductServices
    .addProduct(product)
    .then((response) => {
      fetchProducts();
      closeFormAdd();
    })
    .catch((error) => {});
};
window.btn_addProduct = btn_addProduct;

const isValidPrice = (price) => {
  const parsedPrice = parseInt(price, 10);

  if (!Number.isInteger(parsedPrice) || parsedPrice <= 0) {
    return false;
  }
  return true;
};
getElement("#PriceSP").addEventListener("input", (e) => {
  const value = e.target.value;
  const errorElement = getElement("#price-error");

  if (!isValidPrice(value)) {
    errorElement.classList.remove("hidden");
  } else {
    errorElement.classList.add("hidden");
  }
});
