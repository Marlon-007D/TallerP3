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

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import {
  listarPaginado,
  crearProducto,
  actualizarProducto,
  eliminarProducto
} from './services/productoService';

const usuario = ref('admin');
const clave = ref('Admin_2026!');
const productos = ref<any[]>([]);
const mensaje = ref('');
const page = ref(0);
const size = 10;
const totalPages = ref(0);
const totalElements = ref(0);
const editando = ref(false);

const formulario = ref({
  id: null as number | null,
  nombre: '',
  descripcion: '',
  precio: 0,
  stock: 0,
  activo: true
});

onMounted(() => {
  cargarProductos();
});

async function cargarProductos() {
  try {
    const data = await listarPaginado(usuario.value, clave.value, page.value, size);
    productos.value = data.content;
    totalPages.value = data.totalPages;
    totalElements.value = data.totalElements;
    mensaje.value = `Página ${data.number + 1} de ${data.totalPages} — ${data.totalElements} productos en total`;
  } catch (error: any) {
    manejarError(error);
  }
}

async function guardar() {
  try {
    if (editando.value && formulario.value.id) {
      await actualizarProducto(formulario.value.id, formulario.value, usuario.value, clave.value);
      mensaje.value = 'Producto actualizado correctamente.';
    } else {
      await crearProducto(formulario.value, usuario.value, clave.value);
      mensaje.value = 'Producto registrado correctamente.';
    }
    limpiarFormulario();
    await cargarProductos();
  } catch (error: any) {
    manejarError(error);
  }
}

function seleccionar(producto: any) {
  formulario.value = { ...producto };
  editando.value = true;
}

async function eliminar(producto: any) {
  try {
    await eliminarProducto(producto.id, usuario.value, clave.value);
    mensaje.value = 'Producto eliminado correctamente.';
    await cargarProductos();
  } catch (error: any) {
    manejarError(error);
  }
}

function limpiarFormulario() {
  editando.value = false;
  formulario.value = { id: null, nombre: '', descripcion: '', precio: 0, stock: 0, activo: true };
}

function paginaAnterior() {
  if (page.value > 0) {
    page.value--;
    cargarProductos();
  }
}

function paginaSiguiente() {
  if (page.value + 1 < totalPages.value) {
    page.value++;
    cargarProductos();
  }
}

function manejarError(error: any) {
  if (error.status === 401) mensaje.value = 'Credenciales incorrectas.';
  else if (error.status === 403) mensaje.value = 'Se requiere rol ADMIN para esta acción.';
  else if (error.status === 409) mensaje.value = 'Ya existe un producto con ese nombre.';
  else mensaje.value = error.message || 'Error inesperado.';
}
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