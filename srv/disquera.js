const cds = require("@sap/cds");

module.exports = cds.service.impl(async function () {
  const db = await cds.connect.to("db");
  const { Musicos, Sesiones } = db.entities;

  //EJERCICIO 28/9 Administrar promocion al Crear SESION  

  this.before("CREATE", "Sesiones", async (req) => {
    //faltan validaciones

    try {
      if (req.data.horas >= 6) {
        req.data.promocion = true;
        req.data.horas = parseInt(req.data.horas) + 2;
      } else {
        req.data.promocion = false;
      }
    } catch (error) {
      return req.error;
    }
  });

  //EJERCICIO 28/9 Administrar promocion --> Acumulo las horas que llegan en el update a las horas ya registradas
  this.before("UPDATE", "Sesiones", async (req) => {
    const ID = req.params[0];
    let horas = req.data.horas;

    try {
      const sesion = await SELECT.from(Sesiones).where({ ID: ID });
      console.log(sesion);
      let horasAcumuladas = sesion[0].horas;
      if (horas >= 6) {
        horas = horas + 2;
        console.log(horas);
        req.data.promocion = true;
        req.data.horas = horas + horasAcumuladas;
      } else {
        req.data.promocion = false;
        req.data.horas = horasAcumuladas + horas;
      }
    } catch (error) {
      return error;
    }
  });

  this.after("READ", "Discos", (req) => {
    console.log("Los resultados");
    console.log(req);
  });
  this.before("UPDATE", "Discos", (req) => {
    console.log(req.data.nombre);
    if (req.data.nombre.length <= 1 || !req.data.nombre) {
      console.log("El nombre no puede estar vacío");
    }
  });
  this.before("CREATE", "Discos", (req) => {
    if (req.data.nombre.length <= 1 || !req.data.nombre) {
      console.log("El nombre no puede estar vacío");
    }
  });

  this.after("READ", "Bandas", async (req) => {
    if (req && req.length > 0) {
      req.forEach((banda) => {
        if (banda.genero) {
          // Convierte el género a mayúsculas
          banda.genero = banda.genero.toUpperCase();
        }
      });
    }
  });

  //EJERCICIO 28/9 Crear músicos de manera masiva
  this.on("crearMusicos", async (req) => {
    const musicos = [req.data];
    //Faltan validaciones
    try {
      const created = await INSERT.into(Musicos).entries(musicos);
      if (created) {
        return "Datos registrados con éxito";
      }
    } catch (error) {
      return new Error("Hubo un error");
    }
  });
  //EJERCICIO 28/9 Eliminar músicos de manera masiva
  this.on("eliminarMusicos", async (req) => {
    let ids = req.data.data;
    //Faltan las validaciones
    try {
      ids.forEach(async (id) => {
        await DELETE.from(Musicos).where({ ID: id });
      });
    } catch (error) {
      return new Error("Hubo un error");
    }
    return "Ids eliminados con éxito";
  });

  //EJERCICIO 28/9 Buscar músico por su id
  this.on("getMusico", async (req) => {    
    const id = req.data.id;
    
    const musico = await SELECT.from(Musicos).where({ ID: id });
    return musico;
  });
});
