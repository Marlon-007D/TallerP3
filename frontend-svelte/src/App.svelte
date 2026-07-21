<script>
  import { onMount } from 'svelte';
  import {
    listarPaginado,
    crearProducto,
    actualizarProducto,
    eliminarProducto
  } from './services/productoService.js';

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

  async function cargarProductos() {
    try {
      const data = await listarPaginado(usuario, clave, page, size);
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
        await actualizarProducto(formulario.id, formulario, usuario, clave);
        mensaje = 'Producto actualizado correctamente.';
      } else {
        await crearProducto(formulario, usuario, clave);
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
      await eliminarProducto(producto.id, usuario, clave);
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

  <div class="grid-layout">
    <div class="col-formulario">
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
    </div>

    <div class="col-tabla">
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
    </div>
  </div>
</main>

<style>
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;700&display=swap');

  :global(*) { box-sizing: border-box; margin: 0; padding: 0; }
  :global(body) { 
    font-family: 'Outfit', sans-serif; 
    background: linear-gradient(135deg, #f8f9fa 0%, #e2e8f0 100%);
    color: #1f2937;
    min-height: 100vh;
  }
  
  .contenedor { 
    max-width: 1400px; 
    margin: 0 auto; 
    padding: 3rem 1.5rem; 
  }
  
  .grid-layout {
    display: grid;
    grid-template-columns: 350px 1fr;
    gap: 2rem;
    align-items: start;
  }
  
  /* Make it responsive so it stacks on smaller screens */
  @media (max-width: 900px) {
    .grid-layout {
      grid-template-columns: 1fr;
    }
  }
  
  h1 { 
    margin-bottom: 2rem; 
    font-size: 2.5rem;
    font-weight: 700;
    background: linear-gradient(to right, #ff3e00, #ff8a00);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    text-align: center;
  }
  
  .tarjeta { 
    background: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border: 1px solid rgba(255, 255, 255, 1);
    border-radius: 16px; 
    padding: 2rem; 
    margin-bottom: 2rem; 
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.05); 
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }
  
  .tarjeta:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 45px rgba(0, 0, 0, 0.1); 
  }

  h2 { 
    margin-bottom: 1.5rem; 
    color: #111827; 
    font-weight: 600;
    font-size: 1.4rem;
    border-bottom: 2px solid #f3f4f6;
    padding-bottom: 0.5rem;
  }
  
  label { 
    display: block; 
    margin-top: 1rem; 
    margin-bottom: 0.4rem; 
    font-weight: 600; 
    font-size: 0.95rem; 
    color: #4b5563;
  }
  
  input[type="text"],
  input[type="number"],
  input[type="password"] { 
    width: 100%; 
    padding: 0.7rem 1rem; 
    background: #f9fafb;
    border: 1px solid #d1d5db; 
    color: #1f2937;
    border-radius: 8px; 
    font-size: 1rem; 
    transition: border-color 0.3s ease, box-shadow 0.3s ease;
    font-family: inherit;
  }
  
  input[type="text"]:focus,
  input[type="number"]:focus,
  input[type="password"]:focus {
    outline: none;
    border-color: #ff3e00;
    box-shadow: 0 0 0 3px rgba(255, 62, 0, 0.15);
    background: white;
  }

  input[type="checkbox"] { 
    accent-color: #ff3e00;
    width: 1.2rem;
    height: 1.2rem;
    margin-right: 0.5rem;
    vertical-align: middle;
    cursor: pointer;
  }
  
  button { 
    margin-top: 1.5rem; 
    margin-right: 0.8rem; 
    padding: 0.6rem 1.5rem; 
    border: none; 
    border-radius: 8px; 
    cursor: pointer; 
    font-size: 0.95rem; 
    font-weight: 600;
    font-family: inherit;
    background: linear-gradient(135deg, #ff3e00, #ff6a00); 
    color: white; 
    transition: all 0.3s ease;
    box-shadow: 0 4px 12px rgba(255, 62, 0, 0.2);
  }
  
  button:disabled { 
    opacity: 0.5; 
    cursor: not-allowed; 
    box-shadow: none;
  }
  
  button:hover:not(:disabled) { 
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(255, 62, 0, 0.3);
  }
  
  table { 
    width: 100%; 
    border-collapse: separate; 
    border-spacing: 0;
    margin-top: 1.5rem; 
    font-size: 0.95rem; 
    border-radius: 8px;
    overflow: hidden;
    border: 1px solid #e5e7eb;
  }
  
  th, td { 
    padding: 1rem; 
    text-align: left; 
    border-bottom: 1px solid #e5e7eb;
  }
  
  th { 
    background: #f9fafb; 
    color: #4b5563; 
    font-weight: 700;
    text-transform: uppercase;
    font-size: 0.8rem;
    letter-spacing: 1px;
  }
  
  tr {
    transition: background-color 0.2s ease;
    background: white;
  }

  tr:hover { 
    background: #fff8f5; 
  }
  
  td button {
    margin: 0 0.5rem 0 0;
    padding: 0.4rem 0.8rem;
    font-size: 0.8rem;
    background: white;
    color: #ff3e00;
    box-shadow: none;
    border: 1px solid #ff3e00;
  }
  
  td button:hover {
    background: #ff3e00;
    color: white;
  }

  .mensaje { 
    color: #ff3e00; 
    margin-bottom: 1rem; 
    font-size: 1rem; 
    font-weight: 600;
  }
  
  .paginador { 
    display: flex; 
    align-items: center; 
    justify-content: center;
    gap: 1.5rem; 
    margin-top: 2rem; 
  }
  
  .paginador span { 
    font-size: 1rem; 
    color: #4b5563; 
    font-weight: 600;
  }
  
  .paginador button {
    margin: 0;
  }
</style>