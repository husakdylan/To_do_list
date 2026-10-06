// ===================================================
// 1. SELECCIÓN DE ELEMENTOS DEL DOM (GLOBAL)
// ===================================================
const form = document.querySelector("#todo-form");
const input = document.querySelector("#todo-input");
const list = document.querySelector("#todo-list");

// ===================================================
// 2. CLASE TAREA (Modelo individual)
// ===================================================
class Tarea {
  constructor(texto, completada = false, id = Date.now()) {
    this.id = id;               // Timestamp único
    this.texto = texto;         // Texto de la tarea
    this.completada = completada; // Estado (booleano)
  }

  toggleCompletada() {
    this.completada = !this.completada;
  }
}

// ===================================================
// 3. CLASE TODOAPP (Controlador principal)
// ===================================================
class TodoApp {
  constructor() {
    this.tareas = this.cargarStorage();
    this.init();
  }

  init() {
    form.addEventListener("submit", this.agregarTarea.bind(this));
    list.addEventListener("click", this.manejarClickLista.bind(this));
    this.render();
  }

  agregarTarea(e) {
    e.preventDefault();
    const texto = input.value.trim();

    if (!texto) return;

    const nuevaTarea = new Tarea(texto);
    this.tareas.push(nuevaTarea);

    this.guardarYRenderizar();
    input.value = "";
  }

  manejarClickLista(e) {
    const li = e.target.closest("li");
    if (!li) return;

    const id = Number(li.dataset.id);

    // Detecta el botón de borrar o cualquier ícono en su interior
    const esBotonBorrar = e.target.closest(".delete-btn");

    if (esBotonBorrar) {
      this.tareas = this.tareas.filter((t) => t.id !== id);
    } else {
      const tareaEncontrada = this.tareas.find((t) => t.id === id);
      if (tareaEncontrada) {
        tareaEncontrada.toggleCompletada();
      }
    }

    this.guardarYRenderizar();
  }

  guardarYRenderizar() {
    localStorage.setItem("tareas_poo", JSON.stringify(this.tareas));
    this.render();
  }

  cargarStorage() {
    const datosGuardados = localStorage.getItem("tareas_poo");
    if (!datosGuardados) return [];

    const objetosPlanos = JSON.parse(datosGuardados);
    return objetosPlanos.map(
      (obj) => new Tarea(obj.texto, obj.completada, obj.id)
    );
  }

  // RENDERIZADO SEGURO SIN INNERHTML
  render() {
    // Vaciamos la lista de forma limpia y eficiente
    list.replaceChildren();

    this.tareas.forEach((tarea) => {
      // 1. Elemento principal <li>
      const li = document.createElement("li");
      li.dataset.id = tarea.id;
      if (tarea.completada) li.classList.add("completed");

      // 2. Contenedor de contenido (.task-content)
      const taskContent = document.createElement("div");
      taskContent.className = "task-content";

      // 3. Ícono de estado (Font Awesome)
      const iconoEstado = document.createElement("i");
      if (tarea.completada) {
        iconoEstado.className = "fa-solid fa-circle-check completed-icon";
      } else {
        iconoEstado.className = "fa-regular fa-circle pending-icon";
      }

      // 4. Texto de la tarea (textContent evita vulnerabilidades XSS)
      const spanTexto = document.createElement("span");
      spanTexto.textContent = tarea.texto;

      // Agrupamos ícono y texto
      taskContent.append(iconoEstado, spanTexto);

      // 5. Botón de eliminar
      const btnEliminar = document.createElement("button");
      btnEliminar.className = "delete-btn";
      btnEliminar.title = "Eliminar tarea";

      // Ícono de basura dentro del botón
      const iconoBasura = document.createElement("i");
      iconoBasura.className = "fa-solid fa-trash-can";
      btnEliminar.appendChild(iconoBasura);

      // 6. Ensamblamos el <li> completo
      li.append(taskContent, btnEliminar);

      // 7. Insertamos en el DOM
      list.appendChild(li);
    });
  }
}

// ===================================================
// 4. INICIALIZACIÓN
// ===================================================
const app = new TodoApp();