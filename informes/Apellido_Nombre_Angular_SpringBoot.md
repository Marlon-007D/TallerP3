# [ENLACE AL REPOSITORIO GITHUB AQUÍ]

# 1. Portada Institucional
**Universidad / Institución:** [Nombre de su Institución]
**Materia / Curso:** [Nombre de la Materia]
**Estudiante:** [Apellido y Nombre]
**Fecha:** [Fecha Actual]

# 2. Título del informe
Integración de Spring Boot con Angular: Paginación y Eliminación Lógica de Información.

# 3. Índice de contenidos
1. Portada institucional
2. Título del informe
3. Índice de contenidos
4. Índice de figuras
5. Introducción
6. Objetivo general
7. Descripción del backend Spring Boot utilizado
8. Descripción del framework frontend utilizado
9. Implementación de paginación lógica
10. Implementación de eliminación lógica
11. Evidencia de consumo del endpoint paginado
12. Evidencia de modificación de producto
13. Evidencia de eliminación lógica
14. Explicación del flujo frontend-backend-base de datos
15. Respuestas a las tres preguntas abiertas
16. Conclusiones
17. Bibliografía o fuentes consultadas

# 4. Índice de figuras
- Figura 1. Backend Spring Boot ejecutándose.
- Figura 2. Swagger mostrando el endpoint paginado.
- Figura 3. Frontend Angular ejecutándose.
- Figura 4. Tabla con productos paginados en Angular.
- Figura 5. Cambio de página en el frontend Angular.
- Figura 6. Formulario de edición en Angular.
- Figura 7. Producto actualizado desde el frontend Angular.
- Figura 8. Eliminación lógica desde el frontend Angular.
- Figura 9. Consulta SQL del producto inactivo.

# 5. Introducción
El presente informe detalla la integración entre un backend desarrollado en Spring Boot y un frontend construido con Angular. Se abordan específicamente las técnicas de paginación lógica para el manejo eficiente de grandes volúmenes de datos y la eliminación lógica, que permite desactivar registros sin borrarlos físicamente de la base de datos PostgreSQL.

# 6. Objetivo general
Aplicar la modificación de información almacenada mediante la integración de un backend Spring Boot con el framework frontend Angular, evidenciando el flujo completo de datos desde la interfaz web hasta PostgreSQL, e incorporando paginación lógica y eliminación lógica.

# 7. Descripción del backend Spring Boot utilizado
El backend está construido con Java y Spring Boot. Utiliza Spring Security con HTTP Basic (roles ADMIN y USER) para proteger los endpoints. La persistencia se realiza en PostgreSQL mediante Spring Data JPA e Hibernate, optimizando las conexiones con HikariCP. La API está documentada usando Swagger y expone un CRUD para la entidad `Producto` con los campos id, nombre, descripcion, precio, stock y activo.

# 8. Descripción del framework frontend utilizado (Angular)
Angular es un framework robusto basado en TypeScript para la creación de Single Page Applications (SPA). En este proyecto se utilizó el componente principal (`app.component.ts`), servicios HTTP mediante el uso de `fetch` o `HttpClient` para el consumo de la API, el ciclo de vida `ngOnInit()` o métodos equivalentes para la carga inicial de datos, y directivas como `[(ngModel)]` para data binding bidireccional en el formulario y `*ngFor` (@for) para iterar sobre la lista de productos paginados.

# 9. Implementación de paginación lógica
En el backend, se agregó el endpoint `GET /api/productos/paginado?page=0&size=10`. Se implementó en el `ProductoController` y `ProductoService` empleando `Pageable` y `Page<Producto>`, retornando datos como `content`, `totalElements`, y `totalPages`. El repositorio usa `findByActivoTrue(Pageable pageable)` para traer solo los registros activos por página. En Angular, se enviaron los parámetros `page` y `size` desde el cliente y se usó la respuesta JSON para renderizar la tabla y calcular las páginas.

# 10. Implementación de eliminación lógica
En el backend, se modificó el método asociado a `DELETE /api/productos/{id}`. En lugar de borrar la fila (`repository.delete()`), el servicio realiza un `producto.setActivo(false)` y guarda los cambios con `repository.save()`. En Angular, al presionar "Eliminar", se emite una petición DELETE a la API, la cual actualiza el estado a inactivo, y luego la lista se recarga sin mostrar el producto eliminado.

# 11. Evidencia de consumo del endpoint paginado
*[Pegue su captura aquí]*
**Figura 1. Backend Spring Boot ejecutándose.**
Descripción: Se evidencia que la API está activa en el puerto 8081.

*[Pegue su captura aquí]*
**Figura 2. Swagger mostrando el endpoint paginado.**
Descripción: Se observa el endpoint GET /api/productos/paginado con page y size.

*[Pegue su captura aquí]*
**Figura 3. Frontend Angular ejecutándose.**
Descripción: Se muestra Angular funcionando en el navegador en http://localhost:4200.

*[Pegue su captura aquí]*
**Figura 4. Tabla con productos paginados.**
Descripción: Se evidencia que el frontend muestra una cantidad limitada de registros recibidos en el arreglo `content`.

*[Pegue su captura aquí]*
**Figura 5. Cambio de página en el frontend.**
Descripción: Se observa la navegación entre páginas usando los botones Anterior o Siguiente de Angular.

# 12. Evidencia de modificación de producto
*[Pegue su captura aquí]*
**Figura 6. Formulario de edición.**
Descripción: Se muestra el producto seleccionado en Angular, con sus datos cargados bidireccionalmente usando `[(ngModel)]`.

*[Pegue su captura aquí]*
**Figura 7. Producto actualizado desde el frontend.**
Descripción: Se evidencia que el producto fue modificado correctamente tras enviar una petición PUT.

# 13. Evidencia de eliminación lógica
*[Pegue su captura aquí]*
**Figura 8. Eliminación lógica desde el frontend.**
Descripción: Se muestra la acción de eliminación lógica realizada desde la interfaz Angular, removiendo el producto de la vista.

*[Pegue su captura aquí]*
**Figura 9. Consulta SQL del producto inactivo.**
Descripción: Se comprueba mediante pgAdmin o consola (SELECT * FROM productos) que el registro permanece en PostgreSQL con activo = false.

# 14. Explicación del flujo frontend-backend-base de datos
**Flujo de Paginación:** El usuario abre Angular -> se solicita page y size -> Spring Security valida credenciales -> ProductoController recibe petición -> ProductoService pide la página -> ProductoRepository ejecuta query en PostgreSQL -> base devuelve datos -> backend responde JSON -> Angular dibuja la tabla.
**Flujo de Modificación:** Usuario selecciona producto -> Angular carga datos -> usuario edita y guarda -> Angular envía PUT -> Spring Boot valida -> JPA actualiza PostgreSQL -> Angular recarga la vista.
**Flujo de Eliminación Lógica:** Usuario presiona Eliminar -> Angular envía DELETE -> Spring Security verifica ADMIN -> backend cambia activo a false -> PostgreSQL conserva el registro -> Angular recarga la tabla sin ese registro.

# 15. Respuestas a las tres preguntas abiertas

**Pregunta 1: Explique cómo funciona la paginación desde el frontend hasta PostgreSQL. En su respuesta incluya qué representan page, size, content, totalElements y totalPages.**
En Angular, se almacena el estado de la página actual (`page`) y el tamaño de los bloques (`size`). Estos se envían como *query parameters* al backend de Spring Boot. Allí, un objeto `Pageable` traduce esto a la consulta SQL equivalente con comandos `LIMIT` y `OFFSET` en PostgreSQL. PostgreSQL devuelve ese fragmento de registros. La respuesta JSON contiene: `content` (el arreglo de productos devueltos para la página actual), `totalElements` (la cantidad total de registros activos que existen en la tabla), `totalPages` (el total de páginas disponibles calculadas dividiendo totalElements por size), `page` (el número de página actual) y `size` (cuántos elementos hay por página). Angular procesa esta respuesta, dibuja la tabla usando los elementos de `content` y renderiza el paginador usando `totalPages`.

**Pregunta 2: Explique qué ocurre cuando se modifica un producto desde el formulario. Describa el recorrido de los datos desde el componente del frontend hasta la tabla productos.**
Cuando el usuario selecciona "Editar", Angular carga la información del objeto en las variables vinculadas con `[(ngModel)]` u observables. Al guardar, el componente envía una petición HTTP PUT hacia el backend con los datos JSON. La petición llega a Spring Boot, es interceptada por Spring Security y pasa al `ProductoController`. El controlador delega al `ProductoService`, el cual busca el registro original por su ID en PostgreSQL, sobreescribe los campos modificados y llama al repositorio para hacer un `save()`. JPA/Hibernate ejecuta un `UPDATE` en la tabla `productos`. La API responde 200 OK y Angular solicita nuevamente la página actual para reflejar los cambios.

**Pregunta 3: Explique la diferencia entre eliminación física y lógica, y tipos de paginación. Justifique por qué el producto permanece en la BD con activo = false.**
La **eliminación física** ejecuta un comando `DELETE FROM tabla`, borrando permanentemente la información. La **eliminación lógica** utiliza un `UPDATE` para cambiar un campo booleano de estado (ej. `activo = false`), manteniendo la integridad referencial.
La **paginación física** lee todos los registros a memoria y luego extrae una porción; es ineficiente. La **paginación lógica** se hace directo en la BD (con `LIMIT` y `OFFSET`), trayendo solo los registros necesarios.
En esta actividad, el producto permanece en la base de datos (eliminación lógica) para mantener un registro histórico (auditoría) y evitar romper referencias cruzadas, como posibles ventas asociadas a dicho producto.

# 16. Conclusiones
La implementación de paginación lógica mediante Spring Data y Angular demuestra ser una estrategia altamente eficiente para aplicaciones empresariales, reduciendo significativamente la carga sobre la base de datos. La eliminación lógica garantiza la integridad de la información y el cumplimiento de requerimientos de auditoría.

# 17. Bibliografía o fuentes consultadas
- Documentación oficial de Spring Boot y Spring Data JPA.
- Documentación oficial de Angular.
- Apuntes y recursos provistos en clase.
