document.addEventListener("DOMContentLoaded", () => {
  const botonMenu = document.getElementById("botonMenu");
  const navegacion = document.getElementById("navegacion");
  const aviso = document.getElementById("aviso");
  const formulario = document.getElementById("formularioReserva");
  const mensajeReserva = document.getElementById("mensajeReserva");
  const campoFecha = document.getElementById("fecha");

  document.getElementById("anio").textContent =
    new Date().getFullYear();

  function fechaLocal() {
    const ahora = new Date();
    const anio = ahora.getFullYear();
    const mes = String(ahora.getMonth() + 1).padStart(2, "0");
    const dia = String(ahora.getDate()).padStart(2, "0");
    return `${anio}-${mes}-${dia}`;
  }

  campoFecha.min = fechaLocal();

  let temporizadorAviso;

  function mostrarAviso(mensaje) {
    aviso.textContent = mensaje;
    aviso.classList.add("visible");

    clearTimeout(temporizadorAviso);

    temporizadorAviso = setTimeout(() => {
      aviso.classList.remove("visible");
    }, 3000);
  }

  botonMenu.addEventListener("click", () => {
    const abierto = navegacion.classList.toggle("abierto");

    botonMenu.setAttribute("aria-expanded", String(abierto));
    botonMenu.setAttribute(
      "aria-label",
      abierto ? "Cerrar menú" : "Abrir menú"
    );
    botonMenu.textContent = abierto ? "✕" : "☰";
  });

  document.querySelectorAll(".navegacion a").forEach(enlace => {
    enlace.addEventListener("click", () => {
      navegacion.classList.remove("abierto");
      botonMenu.setAttribute("aria-expanded", "false");
      botonMenu.setAttribute("aria-label", "Abrir menú");
      botonMenu.textContent = "☰";
    });
  });

  const filtros = document.querySelectorAll(".filtro");
  const productos = document.querySelectorAll(".producto");

  filtros.forEach(boton => {
    boton.addEventListener("click", () => {
      const categoria = boton.dataset.filtro;

      filtros.forEach(filtro => {
        filtro.classList.remove("activo");
      });

      boton.classList.add("activo");

      productos.forEach(producto => {
        const coincide =
          categoria === "todos" ||
          producto.dataset.categoria === categoria;

        producto.hidden = !coincide;
      });
    });
  });

  document.querySelectorAll(".agregar").forEach(boton => {
    boton.addEventListener("click", () => {
      const producto = boton.dataset.producto;
      const comentarios = document.getElementById("comentarios");

      comentarios.value = comentarios.value
        ? `${comentarios.value}, Interés en: ${producto}`.slice(0, 300)
        : `Interés en: ${producto}`;

      mostrarAviso(
        `${producto} seleccionado. Puedes continuar con tu reservación.`
      );

      document.getElementById("reservaciones").scrollIntoView({
        behavior: "smooth"
      });
    });
  });

  formulario.addEventListener("submit", evento => {
    evento.preventDefault();

    mensajeReserva.textContent = "";
    mensajeReserva.className = "mensaje";

    if (!formulario.checkValidity()) {
      formulario.reportValidity();
      return;
    }

    if (campoFecha.value < fechaLocal()) {
      mensajeReserva.textContent =
        "Selecciona una fecha de hoy o posterior.";
      mensajeReserva.classList.add("error");
      campoFecha.focus();
      return;
    }

    const datos = {
      nombre: document.getElementById("nombre").value.trim(),
      correo: document.getElementById("correo").value.trim(),
      telefono: document.getElementById("telefono").value.trim(),
      fecha: campoFecha.value,
      hora: document.getElementById("hora").value,
      personas: document.getElementById("personas").value,
      comentarios: document.getElementById("comentarios").value.trim(),
      fechaRegistro: new Date().toISOString()
    };

    if (
      !datos.nombre ||
      !datos.correo ||
      !/^[0-9]{10}$/.test(datos.telefono)
    ) {
      mensajeReserva.textContent =
        "Revisa tu nombre, correo y teléfono de 10 dígitos.";
      mensajeReserva.classList.add("error");
      return;
    }

    try {
      const guardadas = JSON.parse(
        localStorage.getItem("reservasSushiParadise") || "[]"
      );

      if (!Array.isArray(guardadas)) {
        throw new Error("Datos de reservación inválidos");
      }

      guardadas.push(datos);

      localStorage.setItem(
        "reservasSushiParadise",
        JSON.stringify(guardadas)
      );

      mensajeReserva.textContent =
        `¡Listo, ${datos.nombre}! Tu solicitud de demostración quedó guardada para el ${datos.fecha} a las ${datos.hora}.`;
      mensajeReserva.classList.add("exito");

      formulario.reset();
      campoFecha.min = fechaLocal();

      mostrarAviso("Solicitud de demostración guardada correctamente.");

    } catch (error) {
      mensajeReserva.textContent =
        "No se pudo guardar. Comprueba que el navegador permita almacenamiento local.";
      mensajeReserva.classList.add("error");
    }
  });
});