let ubicacionActual = "";

document.getElementById("selectEntrega").addEventListener("change", function () {
  const tipo = this.value;
  const direccion = document.getElementById("camposDireccion");
  const descripcion = document.getElementById("campoDescripcion");
  const btnUbicacion = document.getElementById("btnUbicacion");

  if (tipo === "domicilio") {
    direccion.style.display = "block";
    descripcion.style.display = "block";
    btnUbicacion.style.display = "inline-block";
  } else if (tipo === "local") {
    direccion.style.display = "none";
    descripcion.style.display = "none";
    btnUbicacion.style.display = "none";
  }
});

document.getElementById("btnUbicacion").addEventListener("click", () => {
  navigator.geolocation.getCurrentPosition(
    position => {
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;
      ubicacionActual = `https://www.google.com/maps?q=${lat},${lng}`;
      alert("Ubicación capturada correctamente.");
      document.getElementById("camposDireccion").style.display = "none";
    },
    () => alert("No se pudo obtener la ubicación.")
  );
});

document.getElementById("botonEnviarPedido").addEventListener("click", () => {
  enviarPedido();
});
