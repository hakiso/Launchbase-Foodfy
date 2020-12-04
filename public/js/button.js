// Adicionar novo ingrediente
function addIngredient() {
    const ingredients = document.querySelector("#ingredients");
    const fieldContainer = document.querySelectorAll(".ingredient");
  
    // Realiza um clone do último ingrediente adicionado
    const newField = fieldContainer[fieldContainer.length - 1].cloneNode(true);
  
    // Não adiciona um novo input se o último tem um valor vazio
    if (newField.children[0].value == "") return false;
  
    // Deixa o valor do input vazio
    newField.children[0].value = "";
    ingredients.appendChild(newField);
  }
  
  document
    .querySelector(".add-ingredient")
    .addEventListener("click", addIngredient);



// Adicionar novo passo
function addPassos() {
    const passos = document.querySelector("#passos");
    const fieldContainer = document.querySelectorAll(".passo");
      
    // Realiza um clone do último ingrediente adicionado
    const newField = fieldContainer[fieldContainer.length - 1].cloneNode(true);
    
    // Não adiciona um novo input se o último tem um valor vazio
    if (newField.children[0].value == "") return false;
    
    // Deixa o valor do input vazio
    newField.children[0].value = "";
    passos.appendChild(newField);
    }
    
    document
    .querySelector(".add-passo")
    .addEventListener("click", addPassos);
    
           