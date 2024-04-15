const menu = document.getElementById("menu");
const cartBtn = document.getElementById("cart-btn");
const cartModal = document.getElementById("cart-modal");
const cartItemsContainer = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const checkoutBtn = document.getElementById("checkout-btn");
const closeModalBtn = document.getElementById("close-modal-btn");
const cartCounter = document.getElementById("cart-count");
const addressInput = document.getElementById("address");
const addressWarn = document.getElementById("address-warn");

let cart = [];

// Abrir o modal do carrinho
cartBtn.addEventListener("click", () => {
  updateCartModal();
  cartModal.style.display = "flex";
});

// Fechar o modal quando clicar fora
cartModal.addEventListener("click", (e) => {
  if (e.target === cartModal) {
    cartModal.style.display = "none";
  }
});

// Fechar o modal quando clicar no botão de fechar
closeModalBtn.addEventListener("click", () => {
  cartModal.style.display = "none";
});

// Adicionar item ao carrinho
menu.addEventListener("click", (event) => {
  let parentButton = event.target.closest(".add-to-cart-btn");

  if (parentButton) {
    const name = parentButton.getAttribute("data-name");
    const price = parseFloat(parentButton.getAttribute("data-price"));

    // Adicionar no carrinho

    addToCart(name, price);
  }
});

// Função para adicionar item ao carrinho
function addToCart(name, price) {
  const existingItem = cart.find((item) => item.name === name);

  Toastify({
    text: `Adicionado ao carrinho: ${name}`,
    duration: 3000,
    close: true,
    gravity: "top", // `top` or `bottom`
    position: "left", // `left`, `center` or `right`
    stopOnFocus: true, // Prevents dismissing of toast on hover
    style: {
      background: "#54CC0A",
    },
  }).showToast();

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      name,
      price,
      quantity: 1,
    });
  }

  updateCartModal();
}

// Atualiza o carrinho
function updateCartModal() {
  cartItemsContainer.innerHTML = "";
  let total = 0;

  cart.forEach((item) => {
    const cartItemElement = document.createElement("div");
    cartItemElement.classList.add(
      "flex",
      "justify-between",
      "mb-4",
      "flex-col"
    );
    cartItemElement.innerHTML = `
    <div class="flex justify-between mb-4 items-center">
      <div>
        <p class="font-bold">${item.name}</p>
        <p>Qtd: ${item.quantity}</p>
        <p class="font-medium mt-2">R$ ${item.price.toFixed(2)}</p>
      </div>
      <div>
        <button class="remove-from-cart-btn" data-name="${
          item.name
        }">Remover</button>
      </div>
    </div>
    `;
    total = total + item.price * item.quantity;
    cartItemsContainer.appendChild(cartItemElement);
  });

  cartTotal.textContent = total.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
  cartCounter.innerHTML = cart.length;
}

// Função para remover o item do carrinho

cartItemsContainer.addEventListener("click", (event) => {
  if (event.target.classList.contains("remove-from-cart-btn")) {
    const name = event.target.getAttribute("data-name");
    removeItemCart(name);
  }
});

const removeItemCart = (name) => {
  const index = cart.findIndex((item) => item.name === name);
  if (index !== -1) {
    const item = cart[index];
    if (item.quantity > 1) {
      item.quantity -= 1;
      updateCartModal();
      return;
    }
    cart.splice(index, 1);
    updateCartModal();
  }
};

// Evento de monitoramento do input de endereço
addressInput.addEventListener("input", (event) => {
  let inputValue = event.target.value;
  if (inputValue !== "") {
    addressWarn.classList.add("hidden");
    addressInput.classList.remove("border-red-500");
  }
});

// Finalizar pedido
checkoutBtn.addEventListener("click", () => {
  // Verificar se o restaurante está aberto
  const isOpen = checkRestaurantOpen();
  if (!isOpen) {
    Toastify({
      text: "O restaurante está fechado no momento",
      duration: 3000,
      close: true,
      gravity: "top", // `top` or `bottom`
      position: "center", // `left`, `center` or `right`
      stopOnFocus: true, // Prevents dismissing of toast on hover
      style: {
        background: "#ef4444",
      },
    }).showToast();
    return;
  }

  // Enviar o pedido para o WhatsApp web
  const cartItens = cart
    .map((item) => {
      return `${item.name} Quantidade: ${item.quantity} Preço: R$ ${item.price} | `;
    })
    .join("");

  const message = encodeURIComponent(cartItens);
  const phone = "47996497702";
  window.open(
    `https://wa.me/${phone}?text=${message} Endereço: ${addressInput.value}`,
    "_blank"
  );
  cart = [];
  updateCartModal();

  if (cart.length === 0) return;
  if (addressInput.value === "") {
    addressWarn.classList.remove("hidden");
    addressInput.classList.add("border-red-500");
    return;
  }
});

// Verificar a hora e manipular o card horario
const checkRestaurantOpen = () => {
  const data = new Date();
  const hora = new Date().getHours();
  return hora > 18 && hora < 22;
};

const spanItem = document.getElementById("date-span");
const isOpen = checkRestaurantOpen();
if (isOpen) {
  spanItem.classList.add("bg-green-500");
  spanItem.classList.remove("bg-red-500");
} else {
  spanItem.classList.add("bg-red-500");
  spanItem.classList.remove("bg-green-500");
}
