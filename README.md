# Dolls Kill Frontend Coding Challenge

For this challenge I have created a web from that takes in either a single Dolls Kill product ID or a collection of comma seperated IDs and fetches the corresponding product data from the Dolls kill API and displays the sizes and quantities on screen. 

This application was written using Javascript, HTML, CSS, jQuery and Bootstrap. 

## Fetching The Data

The application uses jQuery AJAX to fetch the data from the Dolls Kill API. Once the data is fetched it is stored in a javascript object. 

```javascript
$.ajax({
      method: 'GET',
      url: `https://www.dollskill.com/codetest/api.php?ids=${productIDs}&op=get_size_attributes`
    }).then(
      products => {
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
      err => console.log(err)
    );
```

## Sorting The Data

The data is sorted based on the value of a select input where the user can select either ascending or descending order for displaying the information and uses the Javascript sort function to acheive this. 

```javascript 
const sorted = product.sort((a, b) => {
      if (sortAscending) {
        return a.quantity - b.quantity;
      } else {
        return b.quantity - a.quantity;
      }
    });
```

## Displaying The Data

The data is displayed by iterating through the applications state which contains the fetched product data and creating the proper markup based on the data in the object. 

```javascript 

function renderProduct(productId) {
    const simpleProductContainer = document.createElement('div');
    const header = document.createElement('h2');
    header.append(productId);
    simpleProductContainer.append(header);
    const list = document.createElement('ul');
    list.classList.add('list-group');

    #...

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
```

## Form Submission

The user can submit the form wither by clicking on the submit button or by pressing the enter key on the input field. This is acheived using event handlers. 

```javascript
input.addEventListener('keyup', e => {
    if (e.keyCode === 13) {
      handleSubmit(e);
    }
  });

submitButton.addEventListener('click', handleSubmit);
```

## Form Validation

The from input only allows numbers and commas to be typed in and uses a regular expression to acheive this.

```javascript
input.addEventListener('input', e => {
    e.target.value = e.target.value.replace(/[^0-9,]/g, '');
  });
```
