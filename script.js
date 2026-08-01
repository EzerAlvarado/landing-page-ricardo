// Correo donde llegan los datos de los interesados
const CORREO_DESTINO = "ricardodiaztuasesorfinanciero@gmail.com";

const REGEX_NOMBRE = /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ' ]{3,60}$/;
const REGEX_TELEFONO = /^\d{10}$/;

function mostrarError(form, campo, mensaje) {
  const error = form.querySelector(`[data-error-for="${campo}"]`);
  const fieldset = form.querySelector(`[data-field="${campo}"]`);
  const input = form.elements[campo];

  if (mensaje) {
    if (fieldset) fieldset.classList.add("invalid");
    else if (input) input.classList.add("invalid");
    if (error) {
      error.textContent = mensaje;
      error.classList.add("visible");
    }
  } else {
    if (fieldset) fieldset.classList.remove("invalid");
    else if (input) input.classList.remove("invalid");
    if (error) {
      error.textContent = "";
      error.classList.remove("visible");
    }
  }
  return !mensaje;
}

function valorRadio(form, nombre) {
  return form.querySelector(`input[name="${nombre}"]:checked`)?.value || "";
}

function validarFormulario(form) {
  const nombre = form.elements.nombre.value.trim();
  const telefono = form.elements.telefono.value.replace(/[\s()-]/g, "");
  const edad = valorRadio(form, "edad");
  const ahorro = valorRadio(form, "ahorro");

  let nombreValido;
  if (!nombre) {
    nombreValido = mostrarError(form, "nombre", "Escribe tu nombre.");
  } else if (!REGEX_NOMBRE.test(nombre)) {
    nombreValido = mostrarError(form, "nombre", "Escribe un nombre válido (solo letras, mínimo 3).");
  } else {
    nombreValido = mostrarError(form, "nombre", "");
  }

  let telefonoValido;
  const phoneWrap = form.querySelector(".phone-wrap");
  if (!telefono) {
    telefonoValido = mostrarError(form, "telefono", "Escribe tu WhatsApp.");
    if (phoneWrap) phoneWrap.classList.add("invalid");
  } else if (!REGEX_TELEFONO.test(telefono)) {
    telefonoValido = mostrarError(form, "telefono", "El teléfono debe tener 10 dígitos.");
    if (phoneWrap) phoneWrap.classList.add("invalid");
  } else {
    telefonoValido = mostrarError(form, "telefono", "");
    if (phoneWrap) phoneWrap.classList.remove("invalid");
  }

  const edadValido = edad
    ? mostrarError(form, "edad", "")
    : mostrarError(form, "edad", "Selecciona tu rango de edad.");

  const ahorroValido = ahorro
    ? mostrarError(form, "ahorro", "")
    : mostrarError(form, "ahorro", "Selecciona una opción.");

  return nombreValido && telefonoValido && edadValido && ahorroValido;
}

const form = document.getElementById("lead-form");

["nombre", "telefono"].forEach((campo) => {
  form.elements[campo].addEventListener("input", () => mostrarError(form, campo, ""));
});

["edad", "ahorro"].forEach((campo) => {
  form.querySelectorAll(`input[name="${campo}"]`).forEach((radio) => {
    radio.addEventListener("change", () => mostrarError(form, campo, ""));
  });
});

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const boton = form.querySelector("button[type=submit]");
  if (!validarFormulario(form)) return;

  const nombre = form.elements.nombre.value.trim();
  const telefono = form.elements.telefono.value.replace(/[\s()-]/g, "");
  const edad = valorRadio(form, "edad");
  const ahorro = valorRadio(form, "ahorro");

  boton.disabled = true;
  boton.textContent = "Enviando…";

  fetch(`https://formsubmit.co/ajax/${CORREO_DESTINO}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      _subject: `Nuevo interesado: ${nombre}`,
      _template: "table",
      _captcha: "false",
      Nombre: nombre,
      WhatsApp: telefono,
      Edad: edad,
      "Capacidad de ahorro": ahorro,
    }),
  })
    .then((res) => {
      if (!res.ok) throw new Error("Error al enviar");
      form.hidden = true;
      document.querySelector(".form-footer-badges").hidden = true;
      document.getElementById("form-intro").hidden = true;
      document.getElementById("form-success").hidden = false;
    })
    .catch(() => {
      boton.textContent = "Hubo un problema, inténtalo de nuevo";
      setTimeout(() => {
        boton.disabled = false;
        boton.textContent = "Cotizar mi plan de retiro";
      }, 4000);
    });
});
