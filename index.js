document.addEventListener('DOMContentLoaded', () => {

  const submitButton = document.querySelector("#submitButton");
  const input = document.querySelector("#productIDs");
  const productsContainer = document.querySelector("#productsContainer");

  function handleSubmit(e) {
    e.preventDefault();
    const productIDs = input.value; 
    $.ajax({
      method: 'GET',
      url: `https://www.dollskill.com/codetest/api.php?ids=${productIDs}&op=get_size_attributes`
    }).then(products => {
        console.log(products);
        Object.keys(products).forEach(id => {
          
          
        });
      }, err => console.log(err));
  }
  submitButton.addEventListener('click', handleSubmit);

});
