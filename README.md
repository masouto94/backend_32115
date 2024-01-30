# Proyecto final curso backend: comisión 47285

## Login
El punto de entrada es `/login`. Ahí se autentica o registra el usuario. Sin ello, no puede acceder al resto de la app

## Index
En el `/index` se puede acceder a un listado de acciones para `Products` `Carts` y `User`.
- Se pueden consultar y crear productos en `Products`. Solo el admin puede crear productos
- Se puede concretar la compra en `Carts`
- Se puede eliminar la cuenta en `User`. Solo el admin podrá eliminar cuentas por ID o forzar la eliminación de los usuarios inactivos

## Docs
El endpoint `/apidocs` sirve una UI de documentación en Swagger

## Acciones croneadas
En `src/config/cron/cronTasks.js` hay dos tareas croneadas para correr a las 00:00 UTC para recuperar a los usuarios con 20 días de inactividad y prevenirlos de que si no se loguean en 10 días se le eliminará la cuenta. A la vez, corre la task que elimina a usuarios con más de 30 días de inactividad

## Tests
En `/test` están presentes los tests para `Cart`, `Sessions` y `Product`. Se pueden ejecutar individualmente con `npm run test test/Product.test.js` o masivamente con `npm run test test/**`. También se puede usar el endpoint de `/mocks` para hacer stress tests de creación productos