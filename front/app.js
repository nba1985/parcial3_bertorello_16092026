const API_URL = "http://localhost:3000/api";

const formulario = document.querySelector("#form-reserva");
const comboCanchas = document.querySelector("#cancha");
const listaReservas = document.querySelector("#lista-reservas");
const tablaRecaudacion = document.querySelector("#tabla-recaudacion");
const mensaje = document.querySelector("#mensaje");

const formatearPrecio = (valor) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS"
  }).format(valor);

const formatearFecha = (fecha) => {
  const [anio, mes, dia] = fecha.substring(0, 10).split("-");
  return `${dia}/${mes}/${anio}`;
};

const mostrarMensaje = (texto, esError = false) => {
  mensaje.textContent = texto;
  mensaje.className = esError ? "pendiente" : "pagada";
};

const cargarCanchas = async () => {
  try {
    const respuesta = await fetch(`${API_URL}/canchas`);
    const canchas = await respuesta.json();

    comboCanchas.innerHTML = `
      <option value="">Seleccione una cancha</option>
    `;

    canchas.forEach((cancha) => {
      const opcion = document.createElement("option");
      opcion.value = cancha.IdCancha;
      opcion.textContent =
        `${cancha.Nombre} - ${formatearPrecio(cancha.PrecioPorHora)}`;

      comboCanchas.appendChild(opcion);
    });
  } catch (error) {
    mostrarMensaje("No se pudieron cargar las canchas.", true);
  }
};

const cargarReservas = async () => {
  try {
    const respuesta = await fetch(`${API_URL}/reservas`);
    const reservas = await respuesta.json();

    listaReservas.innerHTML = "";

    reservas.forEach((reserva) => {
      const tarjeta = document.createElement("article");
      tarjeta.classList.add("tarjeta");

      tarjeta.innerHTML = `
        <h3>${reserva.Cancha}</h3>

        <p>
          <strong>Cliente:</strong>
          ${reserva.Cliente}
        </p>

        <p>
          <strong>Fecha:</strong>
          ${formatearFecha(reserva.Fecha)}
        </p>

        <p>
          <strong>Hora:</strong>
          ${reserva.Hora}
        </p>

        <p>
          <strong>Precio:</strong>
          ${formatearPrecio(reserva.PrecioPorHora)}
        </p>

        <p class="${reserva.Pagada ? "pagada" : "pendiente"}">
          ${reserva.Pagada ? "Pagada" : "Pendiente"}
        </p>

        ${
          reserva.Pagada
            ? ""
            : `
              <button
                class="btn-pagar"
                data-id="${reserva.IdReserva}">
                Registrar pago
              </button>
            `
        }
      `;

      listaReservas.appendChild(tarjeta);
    });
  } catch (error) {
    mostrarMensaje("No se pudieron cargar las reservas.", true);
  }
};

const cargarRecaudacion = async () => {
  try {
    const respuesta = await fetch(
      `${API_URL}/reportes/recaudacion-por-cancha`
    );

    const datos = await respuesta.json();

    tablaRecaudacion.innerHTML = "";

    datos.forEach((fila) => {
      const tr = document.createElement("tr");

      tr.innerHTML = `
        <td>${fila.Nombre}</td>
        <td>${fila.CantidadReservas}</td>
        <td>${formatearPrecio(fila.TotalCobrado)}</td>
        <td>${formatearPrecio(fila.TotalPendiente)}</td>
      `;

      tablaRecaudacion.appendChild(tr);
    });
  } catch (error) {
    mostrarMensaje("No se pudo cargar la recaudación.", true);
  }
};

formulario.addEventListener("submit", async (event) => {
  event.preventDefault();

  const reserva = {
    IdCancha: Number(comboCanchas.value),
    Cliente: document.querySelector("#cliente").value,
    Fecha: document.querySelector("#fecha").value,
    Hora: document.querySelector("#hora").value
  };

  try {
    const respuesta = await fetch(`${API_URL}/reservas`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(reserva)
    });

    const datos = await respuesta.json();

    if (!respuesta.ok) {
      return mostrarMensaje(datos.mensaje, true);
    }

    mostrarMensaje(datos.mensaje);

    formulario.reset();

    await cargarReservas();
    await cargarRecaudacion();
  } catch (error) {
    mostrarMensaje("Error al registrar la reserva.", true);
  }
});

listaReservas.addEventListener("click", async (event) => {
  if (!event.target.classList.contains("btn-pagar")) {
    return;
  }

  const id = Number(event.target.dataset.id);

  try {
    const respuesta = await fetch(
      `${API_URL}/reservas/${id}/pago`,
      {
        method: "PUT"
      }
    );

    const datos = await respuesta.json();

    if (!respuesta.ok) {
      return mostrarMensaje(datos.mensaje, true);
    }

    mostrarMensaje(datos.mensaje);

    await cargarReservas();
    await cargarRecaudacion();
  } catch (error) {
    mostrarMensaje("Error al registrar el pago.", true);
  }
});

cargarCanchas();
cargarReservas();
cargarRecaudacion();