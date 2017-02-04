---
title:  "Instalar Laravel framework en 12 sencillos pasos"
date:   2017-02-03 20:21:22
categories: [Laravel, PHP, framework]
layout: post
tags: [Laravel, PHP, framework]
comments: True
---
Usar frameworks nos facilita mucho el trabajo diario, puesto que, nos dan herramientas y parte del trabajo ya hecho; y muy bien hecho además. Trabajar con PHP es una gozada, lo reconozco, y a la hora de crear un `backend` para nuestras aplicaciones, o directamente una aplicación web, usar el framework de Laravel nos facilitará mucho la vida.

[Laravel][laravel] es un framework de código abierto (`open source`) para crear aplicaciones web con PHP 5 y PHP 7. Fue creado en 2011 por *Taylor Otwell* para desarrollar en PHP de forma elegante. Para instalar Laravel y comenzar a trabajar con él en *Mac OSX*, he resumido el procedimiento en estos doce sencillos pasos:


*1*. Descargar e instalar [virtualbox][enlaceVM] y [vagrant][enlaceVagrant].


*2*. Descargar e instalar composer 
{% highlight ruby %}
    
    curl -sS https://getcomposer.org/installer | php

{% endhighlight %}


*3*. Una vez descargado, le daremos acceso global y añadimos un alias en el archivo `.bash_profile`
{% highlight ruby %}
    
    sudo mv composer.phar /usr/local/bin/composer.phar
    vim ~/.bash_profile
    alias composer="php /usr/local/bin/composer.phar"        /// añadir esta línea en el fichero .bash_profile

{% endhighlight %}


*4*. Clonaremos el repositorio de Homestead con la configuración en la carpeta que elijamos y generaremos el archivo `Homestead.yaml`
{% highlight ruby %}
    
    git clone https://github.com/laravel/homestead.git Homestead
    bash init.sh

{% endhighlight %}


*5*. Descargamos la imagen de Homestead a través de vagrant
{% highlight ruby %}
    
    vagrant box add laravel/homestead

{% endhighlight %}


*6*. Situados en la carpeta donde clonamos la configuración de Homestead, abriremos el archivo src/stubs/Homestead.yaml y modificaremos la etiqueta `sites` para configurar nuestro proyecto.
{% highlight ruby %}
    
    ---
ip:"192.168.10.10"
memory: 2048
cpus:1
authorize: ~/.ssh/id_rsa.pub
keys: - ~/.ssh/id_rsa
folders: - map: ~/Code
           to: /home/vagrant/Code
sites: - map: ProyectoUno
         to: /home/vagrant/Code/ProyectoUno/public
databases: - homestead
variables: - key: APP_ENV
value: local

{% endhighlight %}



*7*. Comprobamos si tenemos ya instaladas las claves SSH. Si venimos utilizando proyectos con Github las tendremos ya, de ser así, saltar este paso 
{% highlight ruby %}
    
    cd ~/.ssh         /// si existen las keys id_rsa y id_rsa.pub saltar al paso

{% endhighlight %}

Si aún no tenemos las claves SSH, tanto en Mac como en linux podremos generarlas con el siguiente comando (sustituye el email por el tuyo) 
{% highlight ruby %}
    
    ssh-keygen -t rsa -C "you@homestead"

{% endhighlight %}


*8*. Laravel/Homestead usa por defecto una carpeta llamada `/Code` en el directorio raíz, así que no se te olvide crearla
{% highlight ruby %}
    
    mkdir /Code

{% endhighlight %}


*9*. Dentro de nuestra carpeta `/Code` crearemos nuestro proyecto `ProyectoUno`
{% highlight ruby %}
    
    composer create-project laravel/laravel ProyectoUno

{% endhighlight %}


*10*. Abriremos el archivo `hosts` y crearemos un dominio para que apunte al localhost de Laravel (la dirección IP del localhost viene en el archivo de configuración Homestead.yaml que modificamos en el paso 6)
{% highlight ruby %}
    
    sudo vim /etc/hosts
    192.168.10.10 server.local

{% endhighlight %}


*11*. Nos situaremos dentro la carpeta de configuración de Homestead y desde aquí levantaremos la imagen de Homestead
{% highlight ruby %}
    
    cd Homestead/
    homestead up

{% endhighlight %}



*12*. Finalmente, iniciamos el navegador con la URL que configuramos en el archivo `hosts` y podremos ver la página de bienvenida de Laravel.
{% highlight ruby %}
    
    http://server.local

{% endhighlight %}


Más fácil, imposible.

![Laravel]({{ site.url }}/images/laravel.png){: .center-image }





Bibliografía:

-- [https://styde.net/instalacion-de-composer-y-laravel-5-1/][enlaceUno]

-- [https://styde.net/como-instalar-y-configurar-laravel-homestead-2-0/][enlaceDos]

-- [http://petericebear.github.io/installing-laravel-homestead-osx-20160514/][enlaceTres]

-- [http://www.desarrolloweb.com/manuales/manual-laravel-5.html][enlaceCuatro]

-- [https://penguintengil.wordpress.com/2015/12/09/installing-homestead-in-mac-os-x/][enlaceCinco]

-- [http://webtechsharing.com/install-laravel-homestead/][enlaceSeis]



[enlaceUno]: https://styde.net/instalacion-de-composer-y-laravel-5-1/
[enlaceDos]: https://styde.net/como-instalar-y-configurar-laravel-homestead-2-0/
[enlaceTres]: http://petericebear.github.io/installing-laravel-homestead-osx-20160514/
[enlaceCuatro]: http://www.desarrolloweb.com/manuales/manual-laravel-5.html
[enlaceCinco]: https://penguintengil.wordpress.com/2015/12/09/installing-homestead-in-mac-os-x/
[enlaceSeis]: http://webtechsharing.com/install-laravel-homestead/

[enlaceVM]: https://www.virtualbox.org
[enlaceVagrant]: https://www.vagrantup.com
[laravel]: http://www.laravel.com/
