const product_url =
  "https://6725e6d1c39fedae05b634be.mockapi.io/learning/api/products";

export const ecomProductServices = {
  // Get All Product Informations
  getProduct: () => {
    return axios({
      url: product_url,
      method: "GET",
    });
  },

  // Get Single Product Information
  getProductByID: (id) => {
    return axios({
      url: `${product_url}/${id}`,
      method: "GET",
    });
  },

  // Delete Each Product By id:
  deleteProduct: (id) => {
    return axios({
      url: `${product_url}/${id}`,
      method: "DELETE",
    });
  },

  // Add new Products
  addProduct: (product) => {
    return axios({
      url: product_url,
      method: "POST",
      data: product,
    });
  },

  // Update Product By ID
  updateProduct: (id, product) => {
    return axios({
      url: `${product_url}/${id}`,
      method: "PUT",
      data: product,
    });
  },
};
