# [ENLACE AL REPOSITORIO GITHUB AQUÍ]

# 1. Portada Institucional
**Universidad / Institución:** [Nombre de su Institución]
**Materia / Curso:** [Nombre de la Materia]
**Estudiante:** [Apellido y Nombre]
**Fecha:** [Fecha Actual]

# 2. Título del informe
Integración de Spring Boot con Vue: Paginación y Eliminación Lógica de Información.

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
- Figura 3. Frontend Vue ejecutándose.
- Figura 4. Tabla con productos paginados en Vue.
- Figura 5. Cambio de página en el frontend Vue.
- Figura 6. Formulario de edición en Vue.
- Figura 7. Producto actualizado desde el frontend Vue.
- Figura 8. Eliminación lógica desde el frontend Vue.
- Figura 9. Consulta SQL del producto inactivo.

# 5. Introducción
Este informe presenta la integración de un backend hecho en Spring Boot y PostgreSQL, con una interfaz desarrollada en Vue. El enfoque técnico primordial se centra en la aplicación de una arquitectura de paginación lógica y el concepto de eliminación lógica u ocultamiento de registros activos en la base de datos.

# 6. Objetivo general
Aplicar la modificación de información almacenada mediante la integración de un backend Spring Boot con el framework frontend Vue, evidenciando el flujo completo de datos desde la interfaz web hasta PostgreSQL y aplicando paginación y eliminación lógica.

# 7. Descripción del backend Spring Boot utilizado
El backend está construido con Java y Spring Boot. Utiliza Spring Security con autenticación básica. La persistencia en PostgreSQL se realiza mediante Spring Data JPA (Hibernate) apoyado por HikariCP. La API está documentada en Swagger y provee el CRUD estándar y paginado para la entidad `Producto`.

# 8. Descripción del framework frontend utilizado (Vue)
Vue es un framework progresivo de JavaScript muy versátil para interfaces de usuario. En la solución adoptada se aprovecharon sus características de reactividad (con `data()`, equivalente a referencias reactivas o `ref`/`reactive`), la interpolación simple y directivas clave como `v-for` para listar las tablas iterando el arreglo JSON de productos y `v-model` para el enlace de doble vía en los inputs del formulario.

# 9. Implementación de paginación lógica
Se configuró el endpoint `GET /api/productos/paginado` en Spring Boot, delegando a `findByActivoTrue` y un objeto `Pageable`. En Vue, se establecieron en el objeto `data()` los valores reactivos correspondientes a `page` y `size`. Cuando se aprieta "Siguiente" o "Anterior", Vue incrementa o disminuye el valor de `page` e invoca de inmediato a la función encargada de conectarse a la API.

# 10. Implementación de eliminación lógica
El backend maneja la orden de eliminación (`DELETE /api/productos/{id}`) actualizando la instancia a inactiva y efectuando `repository.save()`. En Vue, se invoca a la función que emite la petición Fetch DELETE. El registro no se borra físicamente en PostgreSQL; en Vue, tras la recarga silenciosa de la grilla, el producto eliminado de forma lógica desaparece de la vista.

# 11. Evidencia de consumo del endpoint paginado
*[Pegue su captura aquí]*
**Figura 1. Backend Spring Boot ejecutándose.**
Descripción: Se evidencia que la API está activa en el puerto 8081.

*[Pegue su captura aquí]*
**Figura 2. Swagger mostrando el endpoint paginado.**
Descripción: Se observa el endpoint GET /api/productos/paginado con page y size.

*[Pegue su captura aquí]*
**Figura 3. Frontend Vue ejecutándose.**
Descripción: Se muestra Vue corriendo y desplegándose en http://localhost:5173.

*[Pegue su captura aquí]*
**Figura 4. Tabla con productos paginados.**
Descripción: Se observa la tabla poblada a través de un `v-for`, usando los datos de `content`.

*[Pegue su captura aquí]*
**Figura 5. Cambio de página en el frontend.**
Descripción: Se evidencia el cambio en el contador de página luego de apretar los botones de paginación en Vue.

# 12. Evidencia de modificación de producto
*[Pegue su captura aquí]*
**Figura 6. Formulario de edición.**
Descripción: Formulario en Vue cargado con datos al apretar Editar, utilizando la directiva `v-model`.

*[Pegue su captura aquí]*
**Figura 7. Producto actualizado desde el frontend.**
Descripción: Resultado exitoso (PUT) que altera la información mostrada.

# 13. Evidencia de eliminación lógica
*[Pegue su captura aquí]*
**Figura 8. Eliminación lógica desde el frontend.**
Descripción: Se muestra que, desde Vue, la eliminación se procesa sin error y remueve la fila actual de la vista.

*[Pegue su captura aquí]*
**Figura 9. Consulta SQL del producto inactivo.**
Descripción: En PGAdmin o consola SQL, (SELECT * FROM productos) demuestra que la columna `activo` se estableció en false en PostgreSQL.

# 14. Explicación del flujo frontend-backend-base de datos
**Flujo de Paginación:** El hook `mounted()` de Vue llama a la función de listado -> Vue manda GET con page/size -> Spring Boot autentica y resuelve el Pageable en el Repository -> PostgreSQL ejecuta LIMIT/OFFSET -> JSON se retorna -> Vue asigna el arreglo a su variable reactiva y la vista se actualiza automáticamente.
**Flujo de Modificación:** Usuario cliquea en editar -> Vue copia la data al formulario (`v-model` reacciona de inmediato) -> Usuario presiona Guardar -> Petición HTTP PUT -> Spring Boot actualiza mediante Hibernate -> Vue repite el `mounted` lógico.
**Flujo de Eliminación:** Usuario solicita borrado -> Función Vue Fetch emite DELETE -> Spring Boot enmascara el registro (activo=false) en PostgreSQL -> Vue pide la página actualizada y ya no figura.

# 15. Respuestas a las tres preguntas abiertas

**Pregunta 1: Explique cómo funciona la paginación desde el frontend hasta PostgreSQL. En su respuesta incluya qué representan page, size, content, totalElements y totalPages.**
En Vue guardamos el número de página actual y cuántos elementos deseamos (`size`). Al invocar a la API de Spring Boot anexando esos parámetros, la capa `Service` usa un `PageRequest` para consultar a PostgreSQL, que gracias a esta configuración puede optimizar sus cálculos y aplicar cláusulas de rango (`LIMIT/OFFSET`). La API envía una respuesta JSON conteniendo: `content` (los objetos pertenecientes solo a esta vista particular), `totalElements` (cuántos ítems activos hay en la BD globalmente), y `totalPages` (totalElementos / tamaño). Vue toma este JSON, puebla su variable con `content` para el bucle `v-for` y habilita/deshabilita los botones al verificar los valores de `totalElements` y `totalPages`.

**Pregunta 2: Explique qué ocurre cuando se modifica un producto desde el formulario. Describa el recorrido de los datos desde el componente del frontend hasta la tabla productos.**
Cuando el cliente solicita editar un elemento, este objeto se vuelca dentro del modelo de datos de Vue (enlazado al formulario con `v-model`). Las ediciones del usuario afectan esa variable de inmediato. Al enviarse, Vue dispara un request PUT. Spring Security ataja la llamada para autorizar. El Controlador redirige el JSON a la capa de Servicio, que invoca al `findById()` del repositorio en base al ID adjunto, reescribe los valores mapeados y manda a hacer `save()`. Hibernate consolida este cambio en PostgreSQL emitiendo la sentencia `UPDATE`. Finalmente, se instruye a Vue para refrescar el componente.

**Pregunta 3: Explique la diferencia entre eliminación física y lógica, y tipos de paginación. Justifique por qué el producto permanece en la BD con activo = false.**
La **eliminación física** consta de ejecutar explícitamente `DELETE` en el motor relacional, borrando todo archivo. La **eliminación lógica** no destruye información; solo altera un indicador de estado booleano u oculto en el esquema (ej. `activo`).
La **paginación física** ocurre cuando el backend pide la totalidad de la tabla para fraccionarla él mismo en RAM; es inviable para big data. La **paginación lógica** le deja este fraccionamiento directo al motor relacional (usando `LIMIT`), recibiendo paquetes pequeños pre-filtrados, lo que mejora drásticamente el rendimiento general.
Para esta tarea, se usa el ocultamiento (eliminación lógica) a fin de prevenir la ruptura de las restricciones de Foreign Key y para proporcionar historiales si a futuro se requiere auditar la data del negocio.

# 16. Conclusiones
El uso de un backend robusto como Spring Boot en conjunto con las particularidades reactivas de Vue (`v-model`, `v-for`) genera un flujo de trabajo asíncrono y de rápido impacto visual. La asimilación de la paginación de un extremo al otro garantiza un producto a nivel empresarial escalable.

# 17. Bibliografía o fuentes consultadas
- Vue.js Documentation.
- Fetch API & Javascript MDN.
- Apuntes sobre Spring Boot & Data JPA.
