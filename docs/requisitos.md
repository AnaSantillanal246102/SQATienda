Universidad Autónoma de Ciudad Juárez

Instituto de Ingeniería y Tecnología
Departamento de Ingeniería Eléctrica y Computación
Ingeniería de Software

Actividad: Desarrollo de una tienda en línea

Integrantes:

Beltrán Herrada Jared Gustavo — 234878
Trejo Urbina Jonathan Isaí — 251353
Santillán Núñez Ana Paula — 246102
Martínez Coyolt Jared — 237001

Materia: Aseguramiento de la Calidad de Software
Docente: Rafael Jiménez Castro
Lugar y fecha: Ciudad Juárez, Chihuahua, 20 de octubre de 2026

1. Análisis del problema

La empresa necesita desarrollar una tienda en línea que permita a sus clientes consultar un catálogo de productos y realizar el proceso de compra a través de un navegador web. La aplicación deberá ofrecer una experiencia sencilla, clara y funcional, desde la búsqueda de productos hasta el momento en que el usuario intenta realizar el pago.

El sistema deberá permitir que los clientes exploren productos organizados por categorías, consulten sus características y precios, seleccionen las cantidades deseadas y administren un carrito de compras. Además, deberá verificar que las cantidades solicitadas no superen las existencias disponibles.

Posteriormente, el cliente deberá proporcionar sus datos personales y la información necesaria para la entrega de los productos. Antes de llegar al pago, podrá revisar un resumen de su compra que incluya los productos seleccionados, las cantidades, los precios, los impuestos, el total a pagar y los datos de entrega.

Uno de los aspectos importantes del proyecto es que el módulo de pago será únicamente demostrativo. La aplicación permitirá llegar a la interfaz de pago, pero no realizará cobros ni se conectará con servicios financieros externos. En su lugar, informará al usuario que esta funcionalidad todavía no está disponible.

Por lo tanto, el principal problema que se busca resolver es la necesidad de contar con una tienda en línea pequeña, organizada y funcional que permita completar todas las etapas previas al pago, manejando correctamente tanto las operaciones normales como los errores que puedan ocurrir durante la compra.

2. Necesidades de la aplicación
2.1. Catálogo de productos
Mostrar un conjunto de productos disponibles en la tienda.
Organizar los productos mediante categorías.
Permitir consultar información como nombre, descripción, precio, imagen y existencia.
Facilitar la búsqueda de productos por nombre o palabra clave.
Permitir filtrar los productos por categoría.
Utilizar un mecanismo de almacenamiento para conservar la información del catálogo.
2.2. Selección y administración de productos
Permitir agregar productos al carrito de compras.
Permitir seleccionar la cantidad de unidades deseadas.
Permitir modificar las cantidades de los productos seleccionados.
Permitir eliminar productos del carrito.
Mostrar el contenido actual del carrito y la cantidad total de artículos.
Evitar que se agreguen cantidades superiores a las existencias disponibles.
Impedir que se agreguen cantidades iguales o menores que cero.
2.3. Cálculo del importe de la compra
Calcular el subtotal de cada producto según su precio y cantidad.
Calcular el subtotal general de la compra.
Aplicar los impuestos correspondientes.
Mostrar el importe de los impuestos por separado.
Calcular y mostrar el total final que deberá pagar el cliente.
Actualizar los importes cuando el usuario modifique el contenido del carrito.
Definir la tasa de impuestos como una regla de negocio configurable, de acuerdo con los criterios establecidos por la empresa.

Propuesta de regla de negocio: utilizar el Impuesto al Valor Agregado (IVA) con una tasa del 16 % como valor inicial configurable. La tasa definitiva deberá confirmarse de acuerdo con los criterios del proyecto y los productos contemplados.

Fórmulas propuestas:

Subtotal: suma de los precios de los productos multiplicados por sus cantidades.
IVA: subtotal gravable multiplicado por la tasa de IVA.
Total: subtotal más IVA.
2.4. Registro de los datos del cliente

La aplicación deberá solicitar la información necesaria para identificar al comprador y realizar la entrega:

Nombre completo.
Correo electrónico.
Número de teléfono.
Dirección de entrega.
Ciudad.
Estado.
Código postal.

Los campos obligatorios deberán estar claramente identificados. También será necesario validar que los datos estén completos y tengan un formato aceptable antes de permitir que el usuario continúe.

2.5. Revisión de la compra

Antes de llegar al pago, el sistema deberá presentar una confirmación previa que incluya:

Lista de productos seleccionados.
Cantidad de unidades de cada producto.
Precio unitario.
Importe por producto.
Subtotal de la compra.
Impuestos aplicados.
Total a pagar.
Datos del cliente y dirección de entrega.

El usuario deberá poder regresar a las etapas anteriores para corregir los productos, las cantidades o los datos proporcionados.

2.6. Interfaz de pago
Mostrar una pantalla que representa la etapa final del proceso de compra.
Informar el total que se intentaría pagar.
Permitir que el usuario llegue hasta el intento de pago.
Mostrar un mensaje claro indicando que el servicio de pago no está disponible.
Evitar cualquier conexión con bancos, tarjetas o plataformas de pago externas.
No solicitar ni almacenar datos bancarios reales.
2.7. Organización y mantenimiento
Dividir la aplicación en módulos o componentes independientes.
Separar la interfaz visual de las reglas de negocio y el manejo de datos.
Mantener la información de los productos mediante un mecanismo de almacenamiento adecuado, como una base de datos.
Utilizar un catálogo suficientemente amplio para probar las funcionalidades.
Facilitar la realización de pruebas y la modificación posterior del sistema.

Antes de comenzar a programar, deberán establecer qué esperan del sistema, qué comportamiento debería presentar en condiciones normales y qué situaciones problemáticas debería ser capaz de manejar.

3. Expectativas del sistema
3.1. Facilidad de uso

La navegación deberá ser intuitiva y permitir que los clientes identifiquen rápidamente las opciones para explorar productos, consultar información y continuar con la compra.

3.2. Información confiable

Los precios, las cantidades disponibles y los importes mostrados deberán ser coherentes con la información almacenada en el sistema.

3.3. Cálculos correctos

El subtotal, los impuestos y el total deberán calcularse correctamente y actualizarse cuando se modifique el carrito.

3.4. Validación de información

El sistema deberá comprobar que los datos proporcionados por el cliente sean suficientes y tengan un formato válido antes de avanzar a la siguiente etapa.

3.5. Control de existencias

El sistema deberá impedir que el cliente seleccione más unidades de las disponibles y manejar los cambios de inventario que pudieran ocurrir durante la compra.

3.6. Continuidad del proceso

El cliente deberá poder avanzar desde la exploración de productos hasta la pantalla de pago sin encontrarse con errores que impidan realizar las operaciones previstas.

3.7. Manejo de errores

Cuando una operación no pueda completarse, el sistema deberá explicar el motivo mediante mensajes claros y ofrecer una forma de corregir el problema cuando sea posible.

3.8. Seguridad básica

La aplicación deberá validar los datos de entrada y evitar la exposición innecesaria de la información del cliente. Asimismo, no deberá manejar información bancaria real, ya que el pago no forma parte de las funcionalidades implementadas.

3.9. Modularidad

El código deberá estar organizado para que funcionalidades como el catálogo, el carrito, las validaciones, los cálculos y el proceso de pago puedan desarrollarse y evaluarse de manera independiente.

3.10. Alcance delimitado

Se espera que el proceso funcione hasta el intento de pago. No se espera que la aplicación procese transacciones reales, genere facturas electrónicas o gestione entregas y seguimiento de pedidos.

4. Comportamiento del sistema
4.1. Flujo principal de compra
Explorar la tienda: consultar productos, categorías y precios.
Seleccionar productos: elegir productos y cantidades disponibles.
Administrar el carrito: modificar cantidades, eliminar artículos y revisar importes.
Registrar los datos del cliente: capturar y validar la información de entrega.
Revisar la compra: confirmar productos, cantidades, impuestos, total y dirección.
Intentar realizar el pago: mostrar que el pago no está disponible y finalizar el flujo.
4.2. Reglas de comportamiento
Productos: cada producto deberá contar con un identificador, nombre, precio y existencia registrada.
Carrito vacío: no se permitirá continuar a la revisión de la compra si no hay productos seleccionados.
Cantidades: solo se aceptarán cantidades enteras positivas.
Existencias: la cantidad solicitada no deberá superar la disponibilidad del producto.
Actualización del carrito: al cambiar cantidades o eliminar productos, los importes deberán actualizarse automáticamente.
Cálculos: el total se obtendrá sumando los subtotales de los productos y los impuestos correspondientes.
Datos del cliente: no se permitirá continuar si faltan datos obligatorios o existen errores de validación.
Revisión: el resumen final deberá coincidir con el contenido del carrito y los datos registrados.
Disponibilidad del producto: antes de avanzar al intento de pago, el sistema deberá comprobar nuevamente que las cantidades solicitadas sigan siendo atendibles.
Pago: al intentar pagar, se mostrará un mensaje que indique que la funcionalidad aún no está disponible. No se realizará ningún cobro ni se enviará información a un proveedor externo.
5. Situaciones problemáticas

La siguiente tabla describe las situaciones problemáticas que el sistema deberá contemplar y el comportamiento esperado para cada una.

Situación problemática	Comportamiento esperado del sistema
El cliente intenta agregar un producto sin existencias.	Informar que el producto no está disponible e impedir que se agregue al carrito.
El cliente solicita más unidades de las disponibles.	Rechazar la cantidad solicitada e informar la existencia máxima disponible.
El cliente introduce una cantidad igual a cero, negativa o decimal.	Rechazar el valor y solicitar una cantidad entera positiva.
El cliente intenta continuar con el carrito vacío.	Impedir que avance y sugerir que agregue productos.
El cliente elimina todos los productos del carrito.	Actualizar el carrito y dejar deshabilitado el avance hacia la revisión.
El cliente introduce un correo electrónico con formato incorrecto.