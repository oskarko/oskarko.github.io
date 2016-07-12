---
title:  "Base de datos con greenDao"
date:   2016-07-05 19:14:22
categories: [greenDao]
tags: [SqLite]
comments: True
---
Después de un tiempo con mucho trabajo y poco tiempo libre, vuelvo a escribir sobre Android, y en esta ocasión escribiré sobre [greenDao][greenDao]. Si nunca has oído hablar sobre greenDao te diré que es un [ORM][ORMe] open source para Android que te ayudará - y mucho - a implementar y trastear tus **bases de datos SQLite** de una manera simple y sencilla, preocupándote sólo de las entidades - `las tablas` - y las relaciones entre las distintas entidades existentes. 

No es necesario que te preocupes por cómo funciona **greenDao**, simplemente preocúpate de rellenar tu base de datos con datos ;)

![rellenando]({{ site.url }}/images/rellenando.gif){: .center-image }

Suena bien, ¿verdad? Pero... [¿cómo funciona?][features] Pues gracias a dos módulos principales: **Core** y **Generator**. El primero de ellos irá empaquetado en tu app y el segundo te ayudará a generar las clases necesarias para interactuar con tu base de datos. Y ni siquiera tendrás que interactuar con ellas... Todo de una forma muy muy rápida.

Aunque la primera vez que lo usas en un proyecto puede parecer un poco complejo; así que te explicaré brevemente como iniciar un proyecto con **greenDao** en `Android Studio`. Configuración inicial:


{% highlight ruby %}
    
* Application name: GreenDAOExample
* Package name: es.org.greendaoexample
* Minimum SDK: 15
* Blank Activity
* Activity name: MainActivity

{% endhighlight %}



Ya tenemos la configuración inicial de Android, aunque ahora necesitaremos añadir un nuevo módulo Java para la implementación de **greenDao** en el proyecto. Para hacer esto selecciona "*Archivo*" - "*Nuevo*" - "*Nuevo módulo*" ... y elije "*librería Java*" tal y como puedes ver en la siguiente captura:

![Java library]({{ site.url }}/images/java_library.png){: .center-image }

Presiona en "*Siguiente*" y llama a tu nuevo módulo `greendao-gen` y a la clase Java como `MainGenerator`. No hace falta modificar nada más, por tanto, presiona en "*Finalizar*". La estructura de tu proyecto deberá verse así:

![structure]({{ site.url }}/images/structure.png){: .center-image }

Y finalmente sólo nos queda añadir las dependencias de **greenDao** en *gradle* y ¡listo!

![baile]({{ site.url }}/images/facil.gif){: .center-image }

Abrimos el archivo `build.gradle` y añadimos `compile 'de.greenrobot:greendao:2.1.0'`. La versión 2.1.0 de greenDao es la más actual a la hora de escribir este pequeño tutorial, pero puedes comprobar la versión más reciente [aquí][dependencias]. Aquí te dejo una pequeña captura de como quedan las dependencias en este ejemplo:

![dependencies example]({{ site.url }}/images/dependencies.png){: .center-image }

Acabamos de añadir la dependencia para nuestro **módulo Core**, pero ahora necesitamos añadir las dependencias al **módulo Generator**. Abrimos el archivo `build.gradle` del módulo Java que añadimos y escribimos `compile 'de.greenrobot:greendao-generator:2.1.0'` (recuerda comprobar la última versión disponible [aquí][genDependencias]). Y como siempre, captura del resultado:

![dependencies exampleGen]({{ site.url }}/images/dependencies_gen.png){: .center-image }

Sincronizamos todos los archivos de *gradle* para comprobar que no tenemos errores pendientes de resolver, y por fin, es hora de escribir algo de código :)

Para este tutorial he creado un par de entidades: CLIENTE y VIAJE, con una relación entre ellas de uno-a-muchas, y con algunos campos para introducir datos en las entidades. Fijaros en el detalle de definir la ruta donde irán las clases relacionadas con la base de datos.
La clase MainGenerator deberá quedarte más o menos como sigue:



{% highlight ruby %}
    
    package com.example;

import de.greenrobot.daogenerator.DaoGenerator;
import de.greenrobot.daogenerator.Entity;
import de.greenrobot.daogenerator.Property;
import de.greenrobot.daogenerator.Schema;

/**
 * @author Óscar Rodríguez <oscar.garrucho@gmail.com>
 * @since 22/6/16 16:18
 */
public class MainGenerator {

    private static final String PROJECT_DIR = System.getProperty("user.dir");

    public static void main(String[] args) {

        // Prueba inicial para generar el código de las entidades
        createConfigSchema();
    }

    private static void createConfigSchema() {

        int schemaVersion = 1;   // incrementar en cada nueva actualización del esquema.
        String dataPackage = "es.org.greendaoexample.data.db";   // ruta donde almacenar las clases-entidades.

        Schema configSchema = new Schema(schemaVersion, dataPackage);
        configSchema.setDefaultJavaPackageDao(dataPackage + ".dao");
        configSchema.enableKeepSectionsByDefault();   // con esto no sobreescribe código personal añadido en las clases de entidades.

        addTables(configSchema);

        try {
            new DaoGenerator().generateAll(configSchema, PROJECT_DIR + "/app/src/main/java");
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private static void addTables(Schema schema) {

        /* entidades */

        Entity cliente = schema.addEntity("Cliente");   // nombre de la tabla-entidad
        cliente.addIdProperty().primaryKey().autoincrement();   // columna id
        cliente.addStringProperty("dni").notNull().unique();
        cliente.addStringProperty("nombre").notNull();
        cliente.addStringProperty("apellidos");   // puede ser NULL
        cliente.addStringProperty("direccion");
        cliente.addIntProperty("edad");

        Entity viaje = schema.addEntity("Viaje");
        viaje.addIdProperty().primaryKey().autoincrement();
        Property clienteId = viaje.addLongProperty("cliente_id").index().getProperty();   // clave foránea
        viaje.addStringProperty("destino");
        viaje.addIntProperty("dias");
        viaje.addDateProperty("fecha_reserva");


        // Relaciones (tipo -> 1:N)

        // un viaje sólo puede pertenecer a un cliente, pero un cliente puede realizar varios viajes.
        viaje.addToOne(cliente, clienteId);
        cliente.addToMany(viaje, clienteId);
    }
}


{% endhighlight %}


PROJECT_DIR es una variable inicializada con la ruta principal donde tenemos colocado nuestro proyecto. `scheme` nos indica que es la primera versión de nuestra base de datos, y que se alojará en el paquete *es.org.greendaoexample.data.db* (tienes que ir incrementando `scheme` en cada actualización de la base de datos a modo de recuento), también habilitaremos [keep sections][keepSections] para mantener la estrucutra de la base de datos en próximas actualizaciones de la misma.

Después de eso crearemos la estructura de tablas (entidades) y la relación entre ellas. Una vez hecho, hacemos clic sobre la clase Maingenerator con el botón derecho y elegimos `Run 'MainGenerator.main()'` , y al cabo de unos pocos segundos se generarán todas las entidades en el paquete arriba indicado con sus correspondientes relaciones entre ellas.

![generator_run]({{ site.url }}/images/gen_run.png){: .center-image }

¡Y eso es todo! ya tienes integrado greenDAO de forma correcta y sencilla en tu proyecto. Si quieres saber ahora cómo interactuar con dichas entidades y comenzar a realizar CRUD sobre tu nueva base de datos puedes echar un vistazo al [ejemplo que viene con greenDAO][daoExample], o si quieres uno un poco más sencillo, te dejo en mi repositorio un [proyecto de ejemplo][enlaceCodeRepo] ;)

Fácil, rápido y con ejemplos, ¿necesitas más?

![en_absoluto]({{ site.url }}/images/notatall.gif){: .center-image }




Bibliografía:

- [http://greenrobot.org/greendao/][enlaceUno]

- [http://www.limecreativelabs.com/greendao-sqlite-orm-android/][enlaceDos]

- [http://blog.egorand.me/keeping-your-secrets-safe-with-greendaos-database-encryption/][enlaceTres]


[enlaceUno]: http://greenrobot.org/greendao
[enlaceDos]: http://www.limecreativelabs.com/greendao-sqlite-orm-android
[enlaceTres]: http://blog.egorand.me/keeping-your-secrets-safe-with-greendaos-database-encryption
[enlaceCodeRepo]: https://github.com/oskarko/GreenDAOExample
[greenDao]: https://github.com/greenrobot/greenDAO
[ORM]: https://en.wikipedia.org/wiki/Object-relational_mapping
[ORMe]: https://es.wikipedia.org/wiki/Mapeo_objeto-relacional
[features]: http://greenrobot.org/greendao/features/
[dependencias]: http://search.maven.org/#search%7Cga%7C1%7Cg%3A%22de.greenrobot%22%20AND%20a%3A%22greendao%22
[genDependencias]: http://search.maven.org/#search%7Cga%7C1%7Cg%3A%22de.greenrobot%22%20AND%20a%3A%22greendao-generator%22
[keepSections]: http://greenrobot.org/tag/keep-sections/
[daoExample]: https://github.com/greenrobot/greenDAO/tree/master/DaoExample