# [ENLACE AL REPOSITORIO GITHUB AQUÍ]

# 1. Portada Institucional
**Universidad / Institución:** [Nombre de su Institución]
**Materia / Curso:** [Nombre de la Materia]
**Estudiante:** [Apellido y Nombre]
**Fecha:** [Fecha Actual]

# 2. Título del informe
Integración de Spring Boot con Svelte: Paginación y Eliminación Lógica de Información.

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
- Figura 3. Frontend Svelte ejecutándose.
- Figura 4. Tabla con productos paginados en Svelte.
- Figura 5. Cambio de página en el frontend Svelte.
- Figura 6. Formulario de edición en Svelte.
- Figura 7. Producto actualizado desde el frontend Svelte.
- Figura 8. Eliminación lógica desde el frontend Svelte.
- Figura 9. Consulta SQL del producto inactivo.

# 5. Introducción
El presente trabajo de laboratorio detalla la integración de una API de microservicios desarrollada con Spring Boot conectada a una base de datos PostgreSQL, implementando el frontend con Svelte. Se analizan de forma prioritaria los desarrollos de la paginación lógica optimizada y el concepto de eliminación lógica usando banderas booleanas.

# 6. Objetivo general
Aplicar la modificación de información almacenada mediante la integración de un backend Spring Boot con el framework frontend Svelte, evidenciando el ciclo integral de datos desde la interfaz de usuario hasta la capa de persistencia en PostgreSQL, abarcando paginación y eliminación lógica.

# 7. Descripción del backend Spring Boot utilizado
El backend se programó en Java con Spring Boot. Expone endpoints de forma segura mediante Spring Security y HTTP Basic Auth (roles ADMIN y USER). El manejo de bases de datos recae en Spring Data JPA e Hibernate con PostgreSQL. Adicionalmente, cuenta con Swagger para la visualización del endpoint paginado de `Producto`.

# 8. Descripción del framework frontend utilizado (Svelte)
Svelte es un enfoque distinto para la construcción de interfaces; en lugar de hacer el trabajo pesado en el navegador (Virtual DOM), compila el código a JavaScript puro y altamente optimizado en el momento del build. Se utilizó el ciclo de vida `onMount` para la inicialización y petición asíncrona de datos, la notación reactiva pura de variables en Svelte y el bloque `{#each}` para la iteración condicional de arreglos, además de `bind:value` para el *two-way data binding*.

# 9. Implementación de paginación lógica
En el controlador Spring Boot se preparó un endpoint `@GetMapping("/paginado")` con parámetros y el uso de `Pageable`. En el código de Svelte, se manejan variables reactivas (`let page`, `let size`, `let totalPages`). Los botones del paginador ejecutan eventos del componente para aumentar o disminuir `page` y llamar nuevamente al método asíncrono con fetch.

# 10. Implementación de eliminación lógica
El método de eliminación HTTP DELETE fue intervenido en el servicio de Spring Boot, de forma que en vez de requerir a JPA un delete, actualiza la variable `activo` en false. En Svelte, un botón emite el método encargado, validado por Spring Security. El registro se esconde para cualquier `GET /paginado` pero su evidencia pervive en PostgreSQL.

# 11. Evidencia de consumo del endpoint paginado
*[Pegue su captura aquí]*
**Figura 1. Backend Spring Boot ejecutándose.**
Descripción: Se evidencia que la API está activa en el puerto 8081.

*[Pegue su captura aquí]*
**Figura 2. Swagger mostrando el endpoint paginado.**
Descripción: Se observa el endpoint GET /api/productos/paginado con page y size.

*[Pegue su captura aquí]*
**Figura 3. Frontend Svelte ejecutándose.**
Descripción: Se muestra Svelte desplegado (por ejemplo en http://localhost:5173).

*[Pegue su captura aquí]*
**Figura 4. Tabla con productos paginados.**
Descripción: Evidencia que Svelte renderiza mediante el bloque `{#each}` una lista limitada del objeto `content`.

*[Pegue su captura aquí]*
**Figura 5. Cambio de página en el frontend.**
Descripción: Se observa el avance del contador de página gestionado reactivamente por Svelte.

# 12. Evidencia de modificación de producto
*[Pegue su captura aquí]*
**Figura 6. Formulario de edición.**
Descripción: Se muestra en Svelte el producto seleccionado y reflejado en el formulario a través de `bind:value`.

*[Pegue su captura aquí]*
**Figura 7. Producto actualizado desde el frontend.**
Descripción: Modificación concluida exitosamente tras usar el método HTTP PUT.

# 13. Evidencia de eliminación lógica
*[Pegue su captura aquí]*
**Figura 8. Eliminación lógica desde el frontend.**
Descripción: Se atestigua cómo la acción hace desaparecer a nivel visual en Svelte la fila en cuestión.

*[Pegue su captura aquí]*
**Figura 9. Consulta SQL del producto inactivo.**
Descripción: Se comprueba en base de datos de PostgreSQL que el registro existe, pero `activo = false`.

# 14. Explicación del flujo frontend-backend-base de datos
**Flujo de Paginación:** El hook `onMount` en Svelte dispara un *fetch* de datos enviando `page` -> La API Spring Boot procesa el Request -> Spring Data convierte el Pageable en SQL y extrae de PostgreSQL -> Svelte recibe el JSON -> las variables cambian y reactivamente Svelte repinta el DOM usando `{#each}`.
**Flujo de Modificación:** Se carga un producto al objeto estado y `bind:value` lo sincroniza con la UI -> Usuario modifica los datos -> Svelte manda PUT (HTTP) -> Controller y Service en Spring aplican los cambios vía EntityManager a PostgreSQL -> Svelte recarga su estado.
**Flujo de Eliminación:** Solicitud con `DELETE` desde la UI Svelte -> validación de Spring Security para el usuario ADMIN -> Spring Data edita a `activo = false` -> PostgreSQL realiza el UPDATE invisible al usuario -> Svelte recarga la vista.

# 15. Respuestas a las tres preguntas abiertas

**Pregunta 1: Explique cómo funciona la paginación desde el frontend hasta PostgreSQL. En su respuesta incluya qué representan page, size, content, totalElements y totalPages.**
En Svelte controlamos dos variables (page y size). Éstas se pasan como parámetros de query URL hacia Spring Boot, quien mediante la clase `Pageable` los lee y los proyecta internamente como las cláusulas LIMIT (equivalente a size) y OFFSET (equivalente a `page * size`) de SQL. Al responder la API, arroja el modelo de página, donde el array `content` equivale a la lista restringida de productos, `totalElements` es la cuenta global de la tabla que coincida con registros `activo=true`, y `totalPages` la estimación del número total de bloques. Estas informaciones regresan a Svelte y dictan su renderización dinámica.

**Pregunta 2: Explique qué ocurre cuando se modifica un producto desde el formulario. Describa el recorrido de los datos desde el componente del frontend hasta la tabla productos.**
Cuando el usuario desea editar, Svelte usa su asignación de variables directas para popular los inputs (mediante `bind:value`). Al desencadenar el Submit, Svelte genera un string JSON y realiza una petición a la API vía PUT indicando la ID. Spring Boot recibe este payload en su `@RequestBody`, la capa de servicios localiza la entidad original en su tabla PostgreSQL mediante su ID, la sobreescribe (reutilizando métodos setters) y salva el objeto en sesión transaccional con un commit a nivel Hibernate, plasmando una consulta UPDATE final. La vista Svelte es actualizada a su término al reinvocar automáticamente a la API de listado.

**Pregunta 3: Explique la diferencia entre eliminación física y lógica, y tipos de paginación. Justifique por qué el producto permanece en la BD con activo = false.**
La **eliminación física** ejecuta una sentencia SQL `DELETE` la cual purga la data por completo. La **eliminación lógica** aprovecha una cláusula de exclusión a las vistas (normalmente mediante `UPDATE tabla SET activo=false`), salvando el historial del registro.
La **paginación física** arrastra los datos desde el backend cargando todos los miles de registros simultáneamente a la memoria de la máquina (pesado e impractico). La **paginación lógica** deja la tarea de separación, división y limitación directamente a PostgreSQL, que es especialista en manejo óptimo y veloz de información indexada, enviando ya empaquetados los datos precisos.
Mantener este producto con `activo=false` (Eliminación lógica) se justifica porque un producto pudo pertenecer históricamente a recibos, facturas o movimientos del stock. Eliminarlo arruinaría la solidez analítica y del modelo referencial del negocio.

# 16. Conclusiones
La implementación Svelte con la paginación estructurada por Spring Boot garantiza un rendimiento extremo al no delegar carga virtual DOM de un lado y paginación en memoria del otro; cada elemento desempeña una función optimizada. El mantener la base con eliminaciones lógicas asegura el principio de inviolabilidad del registro transaccional.

# 17. Bibliografía o fuentes consultadas
- Svelte Official Tutorial & API Docs.
- Baeldung: Paginación y Sorting con Spring Data JPA.
- Conceptos de diseño de bases de datos y Soft Deletes.
