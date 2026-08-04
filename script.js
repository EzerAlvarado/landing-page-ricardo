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
  const rangoAhorro = valorRadio(form, "rango-ahorro");

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

  let rangoValido = true;
  if (ahorro === "Sí") {
    rangoValido = rangoAhorro
      ? mostrarError(form, "rango-ahorro", "")
      : mostrarError(form, "rango-ahorro", "Selecciona un rango de ahorro.");
  } else {
    mostrarError(form, "rango-ahorro", "");
  }

  return nombreValido && telefonoValido && edadValido && ahorroValido && rangoValido;
}

const form = document.getElementById("lead-form");
const rangoAhorroGroup = document.getElementById("rango-ahorro-group");

function toggleRangoAhorro() {
  const puedeAhorrar = valorRadio(form, "ahorro");
  const mostrarRango = puedeAhorrar === "Sí";

  if (rangoAhorroGroup) {
    rangoAhorroGroup.hidden = !mostrarRango;
  }

  if (!mostrarRango) {
    form.querySelectorAll('input[name="rango-ahorro"]').forEach((radio) => {
      radio.checked = false;
    });
    mostrarError(form, "rango-ahorro", "");
  }
}

["nombre", "telefono"].forEach((campo) => {
  form.elements[campo].addEventListener("input", () => mostrarError(form, campo, ""));
});

["edad", "ahorro"].forEach((campo) => {
  form.querySelectorAll(`input[name="${campo}"]`).forEach((radio) => {
    radio.addEventListener("change", () => {
      mostrarError(form, campo, "");
      if (campo === "ahorro") toggleRangoAhorro();
    });
  });
});

form.querySelectorAll('input[name="rango-ahorro"]').forEach((radio) => {
  radio.addEventListener("change", () => mostrarError(form, "rango-ahorro", ""));
});

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const boton = form.querySelector("button[type=submit]");
  if (!validarFormulario(form)) return;

  const nombre = form.elements.nombre.value.trim();
  const telefono = form.elements.telefono.value.replace(/[\s()-]/g, "");
  const edad = valorRadio(form, "edad");
  const ahorro = valorRadio(form, "ahorro");
  const rangoAhorro = valorRadio(form, "rango-ahorro");

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
      "¿Puedes ahorrar en estos momentos?": ahorro,
      "Rango de ahorro mensual": ahorro === "Sí" ? rangoAhorro : "No aplica",
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

// ============ Simulador ============
(function initSimulador() {
  const sliderMonto = document.getElementById("sim-monto");
  const sliderPlazo = document.getElementById("sim-plazo");
  if (!sliderMonto || !sliderPlazo) return;

  const dispMonto = document.getElementById("sim-d-monto");
  const dispPlazo = document.getElementById("sim-d-plazo");
  const barTrad = document.getElementById("sim-bar-trad");
  const barPlan = document.getElementById("sim-bar-plan");
  const numTrad = document.getElementById("sim-num-trad");
  const numPlan = document.getElementById("sim-num-plan");
  const penTrad = document.getElementById("sim-pen-trad");
  const penPlan = document.getElementById("sim-pen-plan");
  const diffAmt = document.getElementById("sim-diff-amt");
  const urgAmt = document.getElementById("sim-urg-amt");
  const MAX_H = 100;

  const RATE_TRAD = 0.03;
  const RATE_PLAN = 0.11;

  function fv(pmt, annualRate, years) {
    const r = annualRate / 12;
    const n = Math.max(1, years) * 12;
    if (r === 0) return pmt * n;
    return pmt * ((Math.pow(1 + r, n) - 1) / r);
  }

  function fmt(n) {
    if (n >= 1e6) {
      return "$" + (n / 1e6).toFixed(2).replace(/\.?0+$/, "") + " millones";
    }
    return "$" + Math.round(n).toLocaleString("es-MX");
  }

  function fmtPen(n) {
    return "Pensión est. $" + Math.round((n * 0.04) / 12).toLocaleString("es-MX") + "/mes";
  }

  function calc() {
    const monto = Number(sliderMonto.value);
    const plazo = Number(sliderPlazo.value);

    dispMonto.textContent = "$" + monto.toLocaleString("es-MX");
    dispPlazo.textContent = String(plazo);
    sliderMonto.setAttribute("aria-valuenow", String(monto));
    sliderPlazo.setAttribute("aria-valuenow", String(plazo));

    const trad = fv(monto, RATE_TRAD, plazo);
    const plan = fv(monto, RATE_PLAN, plazo);

    barPlan.style.height = MAX_H + "px";
    barTrad.style.height = Math.max(6, Math.round((MAX_H * trad) / plan)) + "px";

    numTrad.textContent = fmt(trad);
    numPlan.textContent = fmt(plan);
    penTrad.textContent = fmtPen(trad);
    penPlan.textContent = fmtPen(plan);

    diffAmt.textContent = fmt(plan - trad);

    const planWait = fv(monto, RATE_PLAN, Math.max(1, plazo - 5));
    urgAmt.textContent = fmt(plan - planWait);
  }

  sliderMonto.addEventListener("input", calc);
  sliderPlazo.addEventListener("input", calc);
  calc();
})();
