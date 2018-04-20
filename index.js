document.addEventListener('DOMContentLoaded', () => {
  
  const submitButton = document.querySelector('#submitButton');
  const input = document.querySelector('#productIDs');
  const productsContainer = document.querySelector('#productsContainer');
  const sortSelectContainer = document.querySelector('#sortSelectContainer');
  const sortSelect = document.querySelector("#sortSelect");
  let sortAscending = true;
  const productStore = {};

  function renderProduct(productId) {
    const simpleProductContainer = document.createElement('div');
    const header = document.createElement('h2');
    header.append(productId);
    simpleProductContainer.append(header);
    const list = document.createElement('ul');
    list.classList.add('list-group');

    const product = productStore[productId];
    const sorted = product.sort((a, b) => {
      if (sortAscending) {
        return a.quantity - b.quantity;
      } else {
        return b.quantity - a.quantity;
      }
    });

    sorted.forEach(simpleProduct => {
      const quantity = simpleProduct.quantity;
      const size = simpleProduct.size;

      const listEl = document.createElement('li');
      listEl.classList.add('list-group-item');
      listEl.innerHTML = `<p>Qty: ${quantity} - Size: ${size}</p>`;
      if (simpleProduct.quantity === 0) {
        listEl.classList.add('out-of-stock');
        const outOfStock = document.createElement('p');
        outOfStock.append('OUT OF STOCK');
        listEl.append(outOfStock);
      }
      list.append(listEl);
    });
    simpleProductContainer.append(list);
    productsContainer.append(simpleProductContainer);
  }

  function renderAllProducts() {
    productsContainer.innerHTML = '';
    Object.keys(productStore).forEach(productId => {
      renderProduct(productId);
    });
  }

  function renderEmptyProducts() {
    productsContainer.innerHTML = '';
    const emptyProductsMsg = document.createElement("p");
    emptyProductsMsg.classList.add("empty-products-msg");
    emptyProductsMsg.append("There are no products matching that ID");
    productsContainer.append(emptyProductsMsg);
  }

  function handleSubmit(e) {
    e.preventDefault();
    let productIDs = input.value;
    const idArray = productIDs.split(",");
    const filtered = idArray.filter(el => el.length > 0);
    productIDs = filtered.join(",");
    Object.keys(productStore).forEach(productId => delete productStore[productId]);
    $.ajax({
      method: 'GET',
      url: `https://www.dollskill.com/codetest/api.php?ids=${productIDs}&op=get_size_attributes`
    }).then(
      products => {
        if (Object.keys(products).length === 0) {
          renderEmptyProducts();
          return;
        }
        Object.keys(products).forEach(productID => {
          let simpleProducts;
          if (products[productID] instanceof Array) {
            simpleProducts = products[productID];
          } else {
            simpleProducts = Object.values(products[productID]);
          }
          const simpleProductsArray = [];
          simpleProducts.forEach(simpleProduct => {
            const simpleProductObj = {};
            const size = simpleProduct.size_text;
            const quantity = simpleProduct.quantity;
            simpleProductObj['size'] = size;
            simpleProductObj['quantity'] = quantity;
            simpleProductsArray.push(simpleProductObj);
          });
          productStore[productID] = simpleProductsArray;
        });
        renderAllProducts();
      },
      err => renderEmptyProducts()
    );
    sortSelectContainer.classList.remove("hidden");
    renderAllProducts();
  }

  sortSelect.addEventListener('change', e => {
    sortAscending = !sortAscending;
    renderAllProducts();
  });

  input.addEventListener('input', e => {
    e.target.value = e.target.value.replace(/[^0-9,]/g, '');
  });

  input.addEventListener('keyup', e => {
    if (e.keyCode === 13) {
      handleSubmit(e);
    }
  });

  submitButton.addEventListener('click', handleSubmit);
});
