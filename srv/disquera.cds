using { disquera as my } from '../db/schema';

service DisqueraService @(path: '/disquera') {
    entity Bandas as projection on my.Bandas;
    @cds.redirection.target
    entity Discos as projection on my.Discos;
    entity Musicos as projection on my.Musicos;
    entity Centros as projection on my.Centros;
    @cds.redirection.target
    entity Sesiones as projection on my.Sesiones;
    entity CentrosDiscos as projection on my.CentrosDiscos;
    entity MusicosBandas as projection on my.MusicosBandas;

// una vista en donde estén reflejados los siguientes elementos: nombre de la banda, nombre del disco, cantidad de canciones del disco y quién distribuye el mismo.
    entity DisqueraInfo as select from my.Discos{
        nombre,
        banda.nombre as nombre_banda,
        canciones,
        centros.centro.nombre as centros
    };
//una vista de la entidad de ‘Grabaciones’, incluir nombre del disco, nombre de la banda y género, además del nombre y apellido del músico. Mostrar 1 sólo registro, el cual será el registro más reciente que haya recibido promoción. Excluir de la vista los siguientes elementos: createdAt, createdBy, modifiedAt, modifiedBy
    
    entity Grabacion as select from my.Sesiones {
        createdAt as creado,
        disco.nombre as nombre,
        disco.banda.nombre as nombre_banda,
        disco.banda.genero as genero,
        disco.banda.musicos.musico.nombre as nombre_musico,
        
    } order by creado desc limit 1;

    // LOGICA CUSTOM
    
    action crearMusicos(data: array of Musicos) returns String;
    action eliminarMusicos(data: array of Integer) returns String;
    function getMusico(id: Musicos:ID) returns Musicos;
}