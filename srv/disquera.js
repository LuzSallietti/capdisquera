const cds = require('@sap/cds');


module.exports = cds.service.impl( async function () {
    this.after('READ', "Discos", ( req )=> {
        console.log("Los resultados")
        console.log(req);
    })
    this.before('UPDATE', "Discos", ( req )=> {
        console.log(req.data.nombre);
       if(req.data.nombre.length <= 1 || !req.data.nombre){
        console.log("El nombre no puede estar vacío")
       }
    })
    this.before('CREATE', "Discos", (req) => {
        
        if(req.data.nombre.length <= 1 || !req.data.nombre){
            console.log("El nombre no puede estar vacío")
           }
    })
    /*this.on('READ', "Discos",(req) => {
        console.log("Pasó por Books pero no recupera los valores // Piso la lógica genérica");
    })*/
    this.after('READ', 'Bandas', async (req) => {
        if (req && req.length > 0) {
            req.forEach(banda => {
                if (banda.genero) {
                    // Convierte el género a mayúsculas
                    banda.genero = banda.genero.toUpperCase();
                }
            });
        }
    });   
})
