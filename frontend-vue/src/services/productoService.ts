const API_URL = 'http://localhost:8081/api/productos';

function crearAuthorization(usuario: string, clave: string): string {
  return `Basic ${btoa(`${usuario}:${clave}`)}`;
}

async function procesarRespuesta(response: Response): Promise<any> {
  if (response.status === 204) return null;
  const texto = await response.text();
  const data = texto ? JSON.parse(texto) : null;
  if (!response.ok) {
    const error: any = new Error(data?.message || `Error HTTP ${response.status}`);
    error.status = response.status;
    throw error;
  }
  return data;
}

export async function listarPaginado(usuario: string, clave: string, page = 0, size = 10): Promise<any> {
  const response = await fetch(`${API_URL}/paginado?page=${page}&size=${size}`, {
    headers: { Authorization: crearAuthorization(usuario, clave) }
  });
  return procesarRespuesta(response);
}

export async function crearProducto(producto: any, usuario: string, clave: string): Promise<any> {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      Authorization: crearAuthorization(usuario, clave),
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(producto)
  });
  return procesarRespuesta(response);
}

export async function actualizarProducto(id: number, producto: any, usuario: string, clave: string): Promise<any> {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: {
      Authorization: crearAuthorization(usuario, clave),
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(producto)
  });
  return procesarRespuesta(response);
}

export async function eliminarProducto(id: number, usuario: string, clave: string): Promise<any> {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
    headers: { Authorization: crearAuthorization(usuario, clave) }
  });
  return procesarRespuesta(response);
}
