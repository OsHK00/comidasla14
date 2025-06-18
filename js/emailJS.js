function generarCodigoPedido() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let codigo = "";
  for (let i = 0; i < 6; i++) {
    codigo += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return codigo;
}

function enviarPedido() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const boton = document.getElementById("botonEnviarPedido");
  boton.disabled = true;

  if (cart.length === 0) {
    alert("El carrito está vacío.");
    boton.disabled = false;
    return;
  }

  const campos = ["inputNombre", "inputTelefono", "inputCedula"];
  let valido = true;

  campos.forEach(id => {
    const input = document.getElementById(id);
    if (input.value.trim() === "") {
      input.classList.add("is-invalid");
      valido = false;
    } else {
      input.classList.remove("is-invalid");
    }
  });

  const tipoEntrega = document.getElementById("selectEntrega").value;
  if (tipoEntrega === "Seleccione una opción") {
    alert("Debes seleccionar cómo recibirás el pedido.");
    boton.disabled = false;
    return;
  }

  let direccion = "";
  if (tipoEntrega === "domicilio") {
    const barrio = document.getElementById("inputBarrio").value.trim();
    const calle = document.getElementById("inputCalle").value.trim();
    const carrera = document.getElementById("inputCarrera").value.trim();

    if (!ubicacionActual && (!barrio || !calle || !carrera)) {
      alert("Completa la dirección o usa tu ubicación.");
      boton.disabled = false;
      return;
    }

    direccion = ubicacionActual ? `Ubicación GPS: ${ubicacionActual}` :
      `Barrio: ${barrio}, Calle: ${calle}, Carrera: ${carrera}`;
  } else {
    direccion = "Recogida en local";
  }

  if (!valido) {
    alert("Por favor completa todos los campos requeridos.");
    boton.disabled = false;
    return;
  }

  const nombre = document.getElementById("inputNombre").value.trim();
  const telefono = document.getElementById("inputTelefono").value.trim();
  const cedula = document.getElementById("inputCedula").value.trim();
  const descripcion = document.getElementById("inputDescripcion")?.value.trim() || "";
  const notificaciones = document.getElementById("exampleCheck1").checked ? "Sí" : "No";

  let carrito = "";
  let total = 0;
  cart.forEach(item => {
    const price = parseFloat(item.price.replace('$', '').replace('.', '').replace(',', '.'));
    const subtotal = price * item.quantity;
    total += subtotal;
    carrito += `• ${item.name} x${item.quantity} - $${subtotal.toLocaleString()}\n`;
  });

  carrito += `\n💰 Total del pedido: $${total.toLocaleString()}`;

  const codigo = generarCodigoPedido();

  const templateParams = {
    nombre,
    telefono,
    cedula,
    tipoEntrega,
    direccion,
    descripcion,
    notificaciones,
    carrito,
    time: new Date().toLocaleString(),
    codigo
  };

  emailjs.send("comidasla14", "template_si4c2bn", templateParams)
    .then(() => {
      const codigoSpan = document.getElementById("codigoPedido");
      const btnCopiar = document.getElementById("btnCopiarCodigo");
      codigoSpan.textContent = codigo;

      const modal = new bootstrap.Modal(document.getElementById("modalConfirmacion"));
      modal.show();

      btnCopiar.onclick = () => {
        navigator.clipboard.writeText(codigo);
        btnCopiar.textContent = "¡Copiado!";
        setTimeout(() => {
          btnCopiar.textContent = "Copiar código";
        }, 1500);
      };

      localStorage.removeItem("cart");

      document.getElementById("modalConfirmacion").addEventListener("hidden.bs.modal", () => {
        window.location.href = "../index.html";
      });
    })
    .catch(error => {
      console.error("Error al enviar el pedido:", error);
      alert("Error al enviar el pedido. Intenta de nuevo.");
    })
    .finally(() => {
      boton.disabled = false;
    });
}
