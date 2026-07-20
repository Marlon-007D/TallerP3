<script>
  import { onMount } from 'svelte';

  const API_URL = 'http://localhost:8081/api/productos';

  let usuario = 'admin';
  let clave = 'Admin_2026!';

  let productos = [];
  let mensaje = '';

  let page = 0;
  let size = 10;
  let totalPages = 0;
  let totalElements = 0;

  let editando = false;
  let formulario = { id: null, nombre: '', descripcion: '', precio: 0, stock: 0, activo: true };

  function crearAuthorization() {
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

  async function cargarProductos() {
    try {
      const response = await fetch(
        `${API_URL}/paginado?page=${page}&size=${size}`,
        { headers: { Authorization: crearAuthorization() } }
      );
      const data = await procesarRespuesta(response);
      productos = data.content;
      totalPages = data.totalPages;
      totalElements = data.totalElements;
      mensaje = `Página ${data.number + 1} de ${data.totalPages} — ${data.totalElements} productos en total`;
    } catch (error) {
      manejarError(error);
    }
  }

  async function guardar() {
    try {
      if (editando && formulario.id) {
        const response = await fetch(`${API_URL}/${formulario.id}`, {
          method: 'PUT',
          headers: {
            Authorization: crearAuthorization(),
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formulario)
        });
        await procesarRespuesta(response);
        mensaje = 'Producto actualizado correctamente.';
      } else {
        const response = await fetch(API_URL, {
          method: 'POST',
          headers: {
            Authorization: crearAuthorization(),
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formulario)
        });
        await procesarRespuesta(response);
        mensaje = 'Producto registrado correctamente.';
      }
      limpiarFormulario();
      await cargarProductos();
    } catch (error) {
      manejarError(error);
    }
  }

  function seleccionar(producto) {
    formulario = { ...producto };
    editando = true;
  }

  async function eliminar(producto) {
    try {
      const response = await fetch(`${API_URL}/${producto.id}`, {
        method: 'DELETE',
        headers: { Authorization: crearAuthorization() }
      });
      await procesarRespuesta(response);
      mensaje = 'Producto eliminado correctamente.';
      await cargarProductos();
    } catch (error) {
      manejarError(error);
    }
  }

  function limpiarFormulario() {
    editando = false;
    formulario = { id: null, nombre: '', descripcion: '', precio: 0, stock: 0, activo: true };
  }

  function paginaAnterior() {
    if (page > 0) { page--; cargarProductos(); }
  }

  function paginaSiguiente() {
    if (page + 1 < totalPages) { page++; cargarProductos(); }
  }

  function manejarError(error) {
    if (error.status === 401) mensaje = 'Credenciales incorrectas.';
    else if (error.status === 403) mensaje = 'Se requiere rol ADMIN para esta acción.';
    else if (error.status === 409) mensaje = 'Ya existe un producto con ese nombre.';
    else mensaje = error.message || 'Error inesperado.';
  }

  onMount(() => {
    cargarProductos();
  });
</script>

<main class="contenedor">
  <h1>CRUD de productos - Svelte</h1>

  <section class="tarjeta">
    <h2>Credenciales</h2>
    <label>Usuario</label>
    <input bind:value={usuario} />
    <label>Contraseña</label>
    <input type="password" bind:value={clave} />
  </section>

  <section class="tarjeta">
    <h2>{editando ? 'Editar producto' : 'Registrar producto'}</h2>
    <form on:submit|preventDefault={guardar}>
      <label>Nombre</label>
      <input bind:value={formulario.nombre} required />
      <label>Descripción</label>
      <input bind:value={formulario.descripcion} required />
      <label>Precio</label>
      <input type="number" bind:value={formulario.precio} required />
      <label>Stock</label>
      <input type="number" bind:value={formulario.stock} required />
      <label>
        <input type="checkbox" bind:checked={formulario.activo} />
        Activo
      </label>
      <button type="submit">{editando ? 'Actualizar' : 'Guardar'}</button>
      <button type="button" on:click={limpiarFormulario}>Limpiar</button>
    </form>
  </section>

  <section class="tarjeta">
    <h2>Listado de productos</h2>
    <p class="mensaje">{mensaje}</p>

    <table>
      <thead>
        <tr>
          <th>ID</th><th>Nombre</th><th>Descripción</th><th>Precio</th><th>Stock</th><th>Activo</th><th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {#each productos as item (item.id)}
          <tr>
            <td>{item.id}</td>
            <td>{item.nombre}</td>
            <td>{item.descripcion}</td>
            <td>{item.precio}</td>
            <td>{item.stock}</td>
            <td>{item.activo ? 'Sí' : 'No'}</td>
            <td>
              <button on:click={() => seleccionar(item)}>Editar</button>
              <button on:click={() => eliminar(item)}>Eliminar</button>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>

    <div class="paginador">
      <button on:click={paginaAnterior} disabled={page === 0}>Anterior</button>
      <span>Página {page + 1} de {totalPages}</span>
      <button on:click={paginaSiguiente} disabled={page + 1 >= totalPages}>Siguiente</button>
    </div>
  </section>
</main>

<style>
  :global(*) { box-sizing: border-box; margin: 0; padding: 0; }
  :global(body) { font-family: sans-serif; background: #f5f5f5; }
  .contenedor { max-width: 900px; margin: 0 auto; padding: 2rem; }
  h1 { margin-bottom: 1.5rem; color: #1a1a2e; }
  .tarjeta { background: white; border-radius: 8px; padding: 1.5rem; margin-bottom: 1.5rem; box-shadow: 0 2px 6px rgba(0,0,0,0.08); }
  h2 { margin-bottom: 1rem; color: #16213e; }
  label { display: block; margin-top: 0.75rem; margin-bottom: 0.25rem; font-weight: 600; font-size: 0.9rem; }
  input[type="text"],
  input[type="number"],
  input[type="password"] { width: 100%; padding: 0.5rem 0.75rem; border: 1px solid #ccc; border-radius: 4px; font-size: 0.95rem; }
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