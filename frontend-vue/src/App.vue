<template>
  <main class="contenedor">
    <h1>CRUD de productos - Vue</h1>

    <section class="tarjeta">
      <h2>Credenciales</h2>
      <label>Usuario</label>
      <input v-model="usuario" />
      <label>Contraseña</label>
      <input type="password" v-model="clave" />
    </section>

    <section class="tarjeta">
      <h2>{{ editando ? 'Editar producto' : 'Registrar producto' }}</h2>
      <form @submit.prevent="guardar">
        <label>Nombre</label>
        <input v-model="formulario.nombre" required />
        <label>Descripción</label>
        <input v-model="formulario.descripcion" required />
        <label>Precio</label>
        <input type="number" v-model.number="formulario.precio" required />
        <label>Stock</label>
        <input type="number" v-model.number="formulario.stock" required />
        <label>
          <input type="checkbox" v-model="formulario.activo" />
          Activo
        </label>
        <button type="submit">{{ editando ? 'Actualizar' : 'Guardar' }}</button>
        <button type="button" @click="limpiarFormulario">Limpiar</button>
      </form>
    </section>

    <section class="tarjeta">
      <h2>Listado de productos</h2>
      <p class="mensaje">{{ mensaje }}</p>

      <table>
        <thead>
          <tr>
            <th>ID</th><th>Nombre</th><th>Descripción</th><th>Precio</th><th>Stock</th><th>Activo</th><th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in productos" :key="item.id">
            <td>{{ item.id }}</td>
            <td>{{ item.nombre }}</td>
            <td>{{ item.descripcion }}</td>
            <td>{{ item.precio }}</td>
            <td>{{ item.stock }}</td>
            <td>{{ item.activo ? 'Sí' : 'No' }}</td>
            <td>
              <button @click="seleccionar(item)">Editar</button>
              <button @click="eliminar(item)">Eliminar</button>
            </td>
          </tr>
        </tbody>
      </table>

      <div class="paginador">
        <button @click="paginaAnterior" :disabled="page === 0">Anterior</button>
        <span>Página {{ page + 1 }} de {{ totalPages }}</span>
        <button @click="paginaSiguiente" :disabled="page + 1 >= totalPages">Siguiente</button>
      </div>
    </section>
  </main>
</template>

<script>
const API_URL = 'http://localhost:8081/api/productos';

function crearAuthorization(usuario, clave) {
  return `Basic ${btoa(`${usuario}:${clave}`)}`;
}

async function procesarRespuesta(response) {
  if (response.status === 204) return null;
  const texto = await response.text();
  const data = texto ? JSON.parse(texto) : null;
  if (!response.ok) {
    const error = new Error(data?.message || `Error HTTP ${response.status}`);
    error.status = response.status;
    throw error;
  }
  return data;
}

export default {
  name: 'App',
  data() {
    return {
      usuario: 'admin',
      clave: 'Admin_2026!',
      productos: [],
      mensaje: '',
      page: 0,
      size: 10,
      totalPages: 0,
      totalElements: 0,
      editando: false,
      formulario: {
        id: null,
        nombre: '',
        descripcion: '',
        precio: 0,
        stock: 0,
        activo: true
      }
    };
  },
  mounted() {
    this.cargarProductos();
  },
  methods: {
    async cargarProductos() {
      try {
        const response = await fetch(
          `${API_URL}/paginado?page=${this.page}&size=${this.size}`,
          { headers: { Authorization: crearAuthorization(this.usuario, this.clave) } }
        );
        const data = await procesarRespuesta(response);
        this.productos = data.content;
        this.totalPages = data.totalPages;
        this.totalElements = data.totalElements;
        this.mensaje = `Página ${data.number + 1} de ${data.totalPages} — ${data.totalElements} productos en total`;
      } catch (error) {
        this.manejarError(error);
      }
    },

    async guardar() {
      try {
        if (this.editando && this.formulario.id) {
          const response = await fetch(`${API_URL}/${this.formulario.id}`, {
            method: 'PUT',
            headers: {
              Authorization: crearAuthorization(this.usuario, this.clave),
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(this.formulario)
          });
          await procesarRespuesta(response);
          this.mensaje = 'Producto actualizado correctamente.';
        } else {
          const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
              Authorization: crearAuthorization(this.usuario, this.clave),
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(this.formulario)
          });
          await procesarRespuesta(response);
          this.mensaje = 'Producto registrado correctamente.';
        }
        this.limpiarFormulario();
        await this.cargarProductos();
      } catch (error) {
        this.manejarError(error);
      }
    },

    seleccionar(producto) {
      this.formulario = { ...producto };
      this.editando = true;
    },

    async eliminar(producto) {
      try {
        const response = await fetch(`${API_URL}/${producto.id}`, {
          method: 'DELETE',
          headers: { Authorization: crearAuthorization(this.usuario, this.clave) }
        });
        await procesarRespuesta(response);
        this.mensaje = 'Producto eliminado correctamente.';
        await this.cargarProductos();
      } catch (error) {
        this.manejarError(error);
      }
    },

    limpiarFormulario() {
      this.editando = false;
      this.formulario = { id: null, nombre: '', descripcion: '', precio: 0, stock: 0, activo: true };
    },

    paginaAnterior() {
      if (this.page > 0) {
        this.page--;
        this.cargarProductos();
      }
    },

    paginaSiguiente() {
      if (this.page + 1 < this.totalPages) {
        this.page++;
        this.cargarProductos();
      }
    },

    manejarError(error) {
      if (error.status === 401) this.mensaje = 'Credenciales incorrectas.';
      else if (error.status === 403) this.mensaje = 'Se requiere rol ADMIN para esta acción.';
      else if (error.status === 409) this.mensaje = 'Ya existe un producto con ese nombre.';
      else this.mensaje = error.message || 'Error inesperado.';
    }
  }
};
</script>

<style>
* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: sans-serif; background: #f5f5f5; }
.contenedor { max-width: 900px; margin: 0 auto; padding: 2rem; }
h1 { margin-bottom: 1.5rem; color: #1a1a2e; }
.tarjeta { background: white; border-radius: 8px; padding: 1.5rem; margin-bottom: 1.5rem; box-shadow: 0 2px 6px rgba(0,0,0,0.08); }
h2 { margin-bottom: 1rem; color: #16213e; }
label { display: block; margin-top: 0.75rem; margin-bottom: 0.25rem; font-weight: 600; font-size: 0.9rem; }
input[type="text"],
input[type="number"],
input[type="password"] { width: 100%; padding: 0.5rem 0.75rem; border: 1px solid #ccc; border-radius: 4px; font-size: 0.95rem; }
input[type="checkbox"] { margin-right: 0.5rem; }
button { margin-top: 1rem; margin-right: 0.5rem; padding: 0.5rem 1.25rem; border: none; border-radius: 4px; cursor: pointer; font-size: 0.9rem; background: #0f3460; color: white; }
button:disabled { opacity: 0.4; cursor: not-allowed; }
button:hover:not(:disabled) { background: #16213e; }
table { width: 100%; border-collapse: collapse; margin-top: 1rem; font-size: 0.9rem; }
th, td { border: 1px solid #e0e0e0; padding: 0.5rem 0.75rem; text-align: left; }
th { background: #0f3460; color: white; }
tr:nth-child(even) { background: #f9f9f9; }
.mensaje { color: #555; margin-bottom: 0.5rem; font-size: 0.9rem; }
.paginador { display: flex; align-items: center; gap: 1rem; margin-top: 1rem; }
.paginador span { font-size: 0.9rem; color: #333; }
</style>