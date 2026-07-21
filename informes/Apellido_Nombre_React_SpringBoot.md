# [ENLACE AL REPOSITORIO GITHUB AQUÍ]

# 1. Portada Institucional
**Universidad / Institución:** [Nombre de su Institución]
**Materia / Curso:** [Nombre de la Materia]
**Estudiante:** [Apellido y Nombre]
**Fecha:** [Fecha Actual]

# 2. Título del informe
Integración de Spring Boot con React: Paginación y Eliminación Lógica de Información.

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
- Figura 3. Frontend React ejecutándose.
- Figura 4. Tabla con productos paginados en React.
- Figura 5. Cambio de página en el frontend React.
- Figura 6. Formulario de edición en React.
- Figura 7. Producto actualizado desde el frontend React.
- Figura 8. Eliminación lógica desde el frontend React.
- Figura 9. Consulta SQL del producto inactivo.

# 5. Introducción
El presente informe detalla la integración entre un backend desarrollado en Spring Boot y un frontend construido con React (y Vite). Se abordan de manera puntual las implementaciones de paginación lógica para la correcta presentación de datos masivos y la eliminación lógica, que evita borrar registros físicos de PostgreSQL, favoreciendo la integridad de datos.

# 6. Objetivo general
Aplicar la modificación de información almacenada mediante la integración de un backend Spring Boot con el framework frontend React, evidenciando el flujo de datos completo, e incorporando mecanismos de paginación y eliminación lógica.

# 7. Descripción del backend Spring Boot utilizado
El backend está construido con Java y Spring Boot. Utiliza Spring Security con HTTP Basic (roles ADMIN y USER). La persistencia se realiza en PostgreSQL mediante Spring Data JPA e Hibernate, conectándose con HikariCP. La API está documentada usando Swagger y expone endpoints de CRUD para la entidad `Producto`.

# 8. Descripción del framework frontend utilizado (React)
React es una biblioteca de JavaScript para construir interfaces de usuario. En este proyecto se empleó `useState` para el manejo del estado local (almacenando los productos, la página actual y los datos del formulario) y `useEffect` para solicitar la lista de productos a la API de forma automática cuando el componente se monta o cuando cambia la página. Se usaron funciones de servicio HTTP (con Fetch API) para realizar las transacciones.

# 9. Implementación de paginación lógica
En el backend, se agregó el endpoint `GET /api/productos/paginado?page=0&size=10`. Se implementó en el Controller mediante `Pageable` y en el Repository con `findByActivoTrue(Pageable)`. En React, se declararon variables de estado (`page`, `size`, `totalPages`) para la petición HTTP GET. La respuesta alimenta la tabla y los botones Anterior y Siguiente cambian el valor de `page`, disparando el `useEffect`.

# 10. Implementación de eliminación lógica
En lugar de un borrado real de la tabla, Spring Boot asigna `activo = false` mediante `repository.save()`. En React, al pulsar "Eliminar", se ejecuta la función `eliminar()` invocando un `DELETE /api/productos/{id}`. Tras recibir un 204 No Content o un 200 OK, React llama a la función de refresco del estado, mostrando los productos sin el registro ocultado.

# 11. Evidencia de consumo del endpoint paginado
*[Pegue su captura aquí]*
**Figura 1. Backend Spring Boot ejecutándose.**
Descripción: Se evidencia que la API está activa en el puerto 8081.

*[Pegue su captura aquí]*
**Figura 2. Swagger mostrando el endpoint paginado.**
Descripción: Se observa el endpoint GET /api/productos/paginado con page y size.

*[Pegue su captura aquí]*
**Figura 3. Frontend React ejecutándose.**
Descripción: Se muestra React (Vite) funcionando en el navegador en http://localhost:5173.

*[Pegue su captura aquí]*
**Figura 4. Tabla con productos paginados.**
Descripción: Se evidencia que React renderiza el estado de productos limitado por página (`content`).

*[Pegue su captura aquí]*
**Figura 5. Cambio de página en el frontend.**
Descripción: Se observa la navegación entre páginas modificando la variable de estado `page`.

# 12. Evidencia de modificación de producto
*[Pegue su captura aquí]*
**Figura 6. Formulario de edición.**
Descripción: Se muestra el producto seleccionado, enlazado al estado de React (`useState`), listo para ser modificado.

*[Pegue su captura aquí]*
**Figura 7. Producto actualizado desde el frontend.**
Descripción: Se evidencia que el producto fue modificado correctamente (PUT).

# 13. Evidencia de eliminación lógica
*[Pegue su captura aquí]*
**Figura 8. Eliminación lógica desde el frontend.**
Descripción: Se muestra la acción de eliminación, el backend responde y React refresca la lista.

*[Pegue su captura aquí]*
**Figura 9. Consulta SQL del producto inactivo.**
Descripción: Se comprueba en PostgreSQL (SELECT * FROM productos) que el producto tiene activo = false.

# 14. Explicación del flujo frontend-backend-base de datos
**Flujo de Paginación:** El `useEffect` en React detecta el montaje -> Fetch API envía GET con page/size -> Spring Boot recibe -> ProductoRepository hace SELECT con LIMIT/OFFSET -> JSON de respuesta -> React actualiza estados y renderiza lista.
**Flujo de Modificación:** Se elige producto -> se guarda en el estado local de formulario -> usuario envía submit -> Fetch ejecuta PUT -> Spring Boot actualiza con Hibernate (UPDATE) -> React repite la consulta.
**Flujo de Eliminación:** Usuario acciona Eliminar -> React manda DELETE -> Spring Boot cambia atributo y hace UPDATE -> BD refleja el cambio sin borrar fila -> React recarga.

# 15. Respuestas a las tres preguntas abiertas

**Pregunta 1: Explique cómo funciona la paginación desde el frontend hasta PostgreSQL. En su respuesta incluya qué representan page, size, content, totalElements y totalPages.**
En React, definimos estados (`useState`) para la página y el límite de datos. Esos se agregan a la URL de Spring Boot, el cual usa un objeto `Pageable` para configurar el `LIMIT` y `OFFSET` en la consulta a PostgreSQL. PostgreSQL recupera únicamente esa sección. JSON responde con: `content` (los objetos actuales para mostrar), `totalElements` (suma total de filas activas en BD), `totalPages` (total de páginas posibles), `page` y `size`. React actualiza sus variables de estado basándose en estos datos para pintar la tabla y bloquear/desbloquear los botones de paginación.

**Pregunta 2: Explique qué ocurre cuando se modifica un producto desde el formulario. Describa el recorrido de los datos desde el componente del frontend hasta la tabla productos.**
React asigna los valores del producto al estado que alimenta el formulario de edición (doble vía mediante el evento onChange). Al emitir el formulario, React emite una llamada `fetch` con el método PUT usando las variables de estado pasadas por `JSON.stringify`. Spring Boot la ataja en su Controller y delega a su Service, quien busca la entidad con JPA, cambia las propiedades y hace un `.save()`. Hibernate genera el `UPDATE` SQL hacia PostgreSQL. Cuando termina, React ejecuta nuevamente la función de listado paginado.

**Pregunta 3: Explique la diferencia entre eliminación física y lógica, y tipos de paginación. Justifique por qué el producto permanece en la BD con activo = false.**
La **eliminación física** ejecuta una sentencia `DELETE` que suprime la fila y los datos en el disco. La **eliminación lógica** modifica una columna o *flag* (e.g. `activo = false`) que indica si el dato debe ser omitido en consultas.
La **paginación física** arrastra todos los resultados de la base de datos a un arreglo en memoria y luego corta; es poco eficiente. La **paginación lógica** transfiere al motor SQL (PostgreSQL) la tarea de restringir el subconjunto devuelto (mediante `LIMIT`/`OFFSET`), siendo óptima y escalable.
Justificación: El registro se mantiene en `productos` por razones de integridad referencial y de negocio; de borrarse, la base de datos podría romper foráneas, o el negocio perder el archivo de compras o existencias previas asociadas a ese elemento.

# 16. Conclusiones
La combinación de React y Spring Boot para la implementación de paginación mediante `Pageable` demuestra lo fluido que puede ser el flujo de datos si se manejan correctamente los estados (`useState` y `useEffect`). La eliminación lógica refuerza la protección de la data persistente.

# 17. Bibliografía o fuentes consultadas
- Documentación de ReactJS.
- MDN Web Docs sobre Fetch API.
- Documentación oficial de Spring Framework.
