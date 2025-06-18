// funcoin del carros
function initCart() {
    
    let currentProduct = null;
    let cart = JSON.parse(localStorage.getItem('cart')) || [];


    document.querySelectorAll('#bottone5').forEach(button => {
        button.addEventListener('click', function () {
            const card = this.closest('.card');
            currentProduct = {
                name: card.querySelector('.card-title').textContent,
                price: card.querySelector('.text-muted').textContent,
                image: card.querySelector('.img-fluid').src,
                quantity: 1
            };


            document.getElementById('productImage').src = currentProduct.image;
            document.getElementById('productName').textContent = currentProduct.name;
            document.getElementById('productPrice').textContent = currentProduct.price;
            document.getElementById('quantity').value = 1;

           
            const confirmModal = new bootstrap.Modal(document.getElementById('confirmModal'));
            confirmModal.show();
        });
    });

 
    document.getElementById('increment').addEventListener('click', function () {
        const quantityInput = document.getElementById('quantity');
        quantityInput.value = parseInt(quantityInput.value) + 1;
    });

    document.getElementById('decrement').addEventListener('click', function () {
        const quantityInput = document.getElementById('quantity');
        if (parseInt(quantityInput.value) > 1) {
            quantityInput.value = parseInt(quantityInput.value) - 1;
        }
    });


    document.getElementById('addToCartBtn').addEventListener('click', function () {
        const quantity = parseInt(document.getElementById('quantity').value);
        currentProduct.quantity = quantity;

        
        const existingIndex = cart.findIndex(item => item.name === currentProduct.name);

        if (existingIndex >= 0) {
            
            cart[existingIndex].quantity += quantity;
        } else {
            
            cart.push(currentProduct);
        }


        localStorage.setItem('cart', JSON.stringify(cart));

       
        updateCartModal();

        
        const confirmModal = bootstrap.Modal.getInstance(document.getElementById('confirmModal'));
        confirmModal.hide();

       
        showToast(`${currentProduct.name} añadido al carrito (${quantity} ${quantity > 1 ? 'unidades' : 'unidad'})`);
    });

    // las noti
    function showToast(message) {
        const toastElement = document.getElementById('liveToast');
        const toastBody = toastElement.querySelector('.toast-body');
        toastBody.textContent = message;

        const toast = new bootstrap.Toast(toastElement);
        toast.show();
    }


function updateCartModal() {
    const cartItemsContainer = document.querySelector('.modal-body .list-group');
    const totalElement = document.getElementById('cartTotalText');
    const checkoutBtn = document.getElementById('checkoutBtn');
    if (!cartItemsContainer) return;

    cartItemsContainer.innerHTML = '';


    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `<div class="text-center text-muted py-3">Tu carrito está vacío.</div>`;
        if (totalElement) {
            totalElement.textContent = 'Total del carrito: $0';
        }
        if (checkoutBtn) {
            checkoutBtn.classList.add('disabled');
            checkoutBtn.setAttribute('aria-disabled', 'true');
        }
        return;
    }


    let total = 0;

    cart.forEach((item, index) => {
        const price = parseFloat(item.price.replace('$', '').replace('.', '').replace(',', '.'));
        const subtotal = price * item.quantity;
        total += subtotal;

        const itemElement = document.createElement('div');
        itemElement.className = 'list-group-item d-flex justify-content-between align-items-center';
        itemElement.innerHTML = `
        <div class="d-flex justify-content-between w-100">
          <div>
            <h6 class="mb-1">${item.name}</h6>
            <small class="text-muted">${item.price} x ${item.quantity}</small>
          </div>
          <div class="d-flex align-items-center">
            <span class="me-3">$${subtotal.toLocaleString()}</span>
            <div class="btn-group btn-group-sm" role="group">
              <button type="button" class="btn btn-outline-secondary edit-quantity" data-index="${index}" data-change="-1">-</button>
              <button type="button" class="btn btn-outline-secondary edit-quantity" data-index="${index}" data-change="1">+</button>
              <button type="button" class="btn btn-outline-danger delete-item" data-index="${index}">
                <i class="bi bi-trash"></i>
              </button>
            </div>
          </div>
        </div>
        `;
        cartItemsContainer.appendChild(itemElement);
    });


    if (totalElement) {
        totalElement.textContent = `Total del carrito: $${total.toLocaleString()}`;
    }


    if (checkoutBtn) {
        checkoutBtn.classList.remove('disabled');
        checkoutBtn.removeAttribute('aria-disabled');
    }

    document.querySelectorAll('.edit-quantity').forEach(button => {
        button.addEventListener('click', function () {
            const index = parseInt(this.dataset.index);
            const change = parseInt(this.dataset.change);

            cart[index].quantity += change;
            if (cart[index].quantity < 1) cart[index].quantity = 1;

            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartModal();
            showToast(`Cantidad de ${cart[index].name} actualizada a ${cart[index].quantity}`);
        });
    });


    document.querySelectorAll('.delete-item').forEach(button => {
        button.addEventListener('click', function () {
            const index = parseInt(this.dataset.index);
            const productName = cart[index].name;
            cart.splice(index, 1);
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartModal();
            showToast(`${productName} eliminado del carrito`);
        });
    });
}




    const cartModal = document.getElementById('miModal');
    if (cartModal) {
        cartModal.addEventListener('shown.bs.modal', function () {
            updateCartModal();
        });
    }


    const checkoutBtn = document.querySelector('.modal-footer .btn-primary');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function () {
            localStorage.removeItem('cart');
            showToast('Pedido realizado con éxito!');
        });
    }
}


document.addEventListener('DOMContentLoaded', initCart);





function actualizarIndicadoresCarrito() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  const navBadge = document.getElementById("navCartBadge");
  const floatBadge = document.getElementById("floatCartBadge");

  const botones = [document.getElementById("carritoNav"), document.getElementById("b-fotante")];

  if (cart.length > 0) {
    navBadge.style.display = "block";
    floatBadge.style.display = "block";

    botones.forEach(btn => {
      btn.classList.add("animate__animated", "animate__bounce");
      setTimeout(() => btn.classList.remove("animate__bounce"), 800);
    });

  } else {
    navBadge.style.display = "none";
    floatBadge.style.display = "none";
  }
}


actualizarIndicadoresCarrito();




//geo

let mapInitialized = false;
const modal = document.getElementById('mapModal');

modal.addEventListener('shown.bs.modal', function () {
    if (!mapInitialized) {
        const coords = [8.9467, -75.4457]; 
        const map = L.map('map').setView(coords, 17);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap contributors'
        }).addTo(map);

        L.marker(coords).addTo(map)
            .bindPopup('<strong>Comidas la 14</strong><br>Calle 14 #23-45<br>Sahagún, Córdoba')
            .openPopup();

        mapInitialized = true;
    }
});
