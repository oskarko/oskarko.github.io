---
title:  "CocoaPods, tu gestor de dependencias favorito"
date:   2017-03-22 19:04:22
categories: [iOS, Swift, CocoaPods]
layout: post
tags: [iOS, Swift, CocoaPods]
comments: True
---
CocoaPods es un gestor de dependencias para tu proyecto de Xcode. Es tan fácil como especificar qué dependencias necesitas en un sencillo archivo de texto plano. Es capaz de mantener las dependencias entre las distintas librerías que añades y 'mergear' el código fuente de las distintas dependencias. A fecha de escribir esto [va por la versión 1.2.0][enlaceTres] (rama estable).


¿Por qué necesitas un gestor de dependencias en tu vida? Bueno, no es obligatorio su uso, pero, podrías dedicar tu valioso tiempo a mejorar tu código en lugar de, sencillamente, malgastar tiempo en escribir cientos de líneas de código que no necesitarías escribir. También es cierto que puedes hacer uso de terceras librerías sin necesidad de usar un gestor de dependencías, pero eso te seguiría haciendo perder mucho tiempo tanto en la búsqueda, instalación y en el mantenimiento de dichas librerías (o eliminación de las mismas). Por tanto, la razón principal es obiva: por tiempo. Y como todos sabemos, el tiempo es oro, así que no lo malgastes ;)

![Tiempo]({% link images/pulp_01.gif %}){: .center-image }

### Instalando...

CocoaPods está hecho con Ruby, y por tanto, para instalarlo **necesitamos tener instalado Ruby** en nuestro Max OS X; pero no sufras, que viene por defecto instalado con todas las versiones de OS X desde la versión 10.7.

Abre una terminal e introduce el siguiente comando (necesitarás introducir tu password para dar permisos de instalación)

{% highlight ruby %}
    
    sudo gem install cocoapods

{% endhighlight %}

Ruby instalará todas las **gemas** que sean necesarias para lograr la correcta instalación de CocoaPods.

![Tiempo]({% link images/confetti_03.png %}){: .center-image }

Si nos diera algún tipo de error, o si incluso de quedara congelada la instrucción, sería súper recomendable actualizar a la versión mas reciente de Ruby Gems:

{% highlight ruby %}
    
    sudo gem update --system

{% endhighlight %}

Además, desde la propia CocoaPods nos recomiendan tener instalada la `Command Line Tools` (Xcode >> Preferences >> Downloads >> Command Line Tools) 

**¡Instalado!**

### Configurando un nuevo proyecto con CocoaPods...

Para nuestro proyecto de ejemplo, tan sólo le añadiremos una divertida librería con la ayuda de CocoaPods, más que suficiente para ver como es su configuración y funcionamiento en tiempo de ejecución. Aquí cabe mencionar que todos los Pods que podemos usar en nuestro proyecto deben de estar "dados de alta" en el repositorio de [Github que CocoaPods tiene][enlaceDiez].

[La librería][enlaceDoce] permite soltar confetti por toda la pantalla de nuestro dispositivo, a modo de celebración de algún logro o día festivo. Tan bonito como simple.

![Confetti]({% link images/confetti_01.png %}){: .center-image }

Vamos allá! Nuevamente en una terminal deberemos situarnos en la carpeta raíz de nuestro proyecto (justo donde tenemos el archivo <nombreProyecto>.xcodeproj)

{% highlight ruby %}
    
    cd ~/Path/To/Project/Folder

{% endhighlight %}

Y desde allí ejecutamos el siguiente comando:

{% highlight ruby %}
    
    pod init

{% endhighlight %}

esto creará [nuestro Podfile][enlaceCinco] en el directorio raíz del proyecto. Comenzaremos a editarlo (podéis editarlo con vuestro editor de texto plano favorito, yo suelo usar **vi**):

{% highlight ruby %}
    
    vi Podfile

{% endhighlight %}

y por defecto veremos algo parecido a esto:

{% highlight ruby %}
    
    # Uncomment this line to define a global platform for your project
	platform :ios, '8.0'

	target 'CocoaPodsDemo' do
  		# Comment this line if you're not using Swift and don't want to use dynamic frameworks
  	use_frameworks!

  	# Pods for CocoaPodsDemo
	pod "SAConfettiView"

	end

{% endhighlight %}



la primera línea indica a CocoaPods que tu librería funcionará a partir de la versión 8.0 de iOS. La línea `use_frameworks!` es obligatoria si vienes programando en Swift, de lo contrario, obtendrás un error al intentar usar el Pod sin esta línea. Y con la línea `pod SAConfettiView` le decimos a CocoaPods que busque, compile e instale la librería llamada SAConfettiView.

![Buzz]({% link images/year_01.gif %}){: .center-image }

### Un alto en el camino...

Referirse a las librerías de Swift como librerías propiamente dicho, es un error. Cuando escribo librerías refiriendo al lenguaje Swift en verdad estoy refiriéndome a framworks, o para ser más exactos **"Swift dynamic framework”**, porque las librerías (estáticas) en Swift simplemente no están permitidas. Entonces, ¿Cuál es la diferencia entre una librería, un framework y un CocoaPod? Bien, espero arrojar algo de luz sobre este asunto:

-- CocoaPod (o 'Pod', usado de forma abreviada) se refiere indistintamente a una librería o un framework que se ha añadido a tu proyecto mediante la herramienta CocoaPods.

-- "dynamic frameworks" (o framworks, simple y llanamente) fueron introducidos con la llegada de iOS 8, permitiendo además de código, adjuntar imágenes y otros tipos de **assets** que hasta entonces, no se podía. Otra sustancial diferencia es que en los frameworks tenemos "namespace classes" que viene a lograr que Xcode use dos clases con nombres idénticos (de distintos frameworks) sin dar errores de símbolos duplicados en proyecto. Esto es debido a que, a diferencia de Objetive-C, los frameworks escritos en Swift no están incluidos en iOS evitando duplicados como bien ya sabes.

Y de todo esto se encarga CocoaPods por ti, en las sombras, sin que tú te enteres lo más mínimo. **Genial, ¿eh?**

### Volviendo a nuestro proyecto

Hemos especificado ~~la librería~~ el framework que queremos importar sin indicarle la versión, eso hará que CocoaPods nos instale la última versión estable disponible. Si quisiéramos indicarle una versión en concreto, deberíamos colocarla en el pod de la siguiente manera:

{% highlight ruby %}
    
    pod 'SAConfettiView', '~> 1.0'

{% endhighlight %}

Y eso le indicaría a CocoaPods que descargase únicamente la versión 1.0 o cualquier otra versión superior hasta la 1.1 sin incluir la 1.1 del pod que le estamos indicando. Todo el tema de las versiones lo tienen muy bien explicado los compañeros de [kodigoswift.com][enlaceOcho], échale un vistazo ;) .Guarda y cierra. Ahora es el momento de decirle a CocoaPods que descargue e instale las dependencias de tu proyecto. Para eso, nuevamente en la terminal, cerciorándonos de que estamos en el directorio raíz del proyecto, escribimos el siguiente comando:

{% highlight ruby %}
    
    pod install

{% endhighlight %}

Verás algo parecido a esto:

![Final]({% link images/confetti_05.png %}){: .center-image }

Ahora, en la carpeta raíz del proyecto CocoaPods te ha creado un archivo <nombreProyecto>.xcworkspace además de una carpeta Pods donde guardará todas las dependencias de tu proyecto. A partir de ahora, para abrir el proyecto en Xcode usaremos este archivo <nombreProyecto>.xcworkspace en lugar del original que nos creó el propio Xcode, de lo contrario, obtendremos varios errores.

**¡Perfecto, acabas de instalar tu primer Pod!**

![Drac]({% link images/drac_01.gif %}){: .center-image }

### Programando con nuestro primer Pod

Si tenías abierto el proyecto en Xcode, ciérralo y ahora abre el archivo <nombreProyecto>.xcworkspace en su lugar. Sólo necesitaremos usar la clase ViewController que viene por defecto en el proyecto, en ella definiremos una variable del tipo "SAConfettiView":

{% highlight ruby %}
    
    var confettiView: SAConfettiView!

{% endhighlight %}


Y dentro del método `viewDidLoad` iniciaremos la variable, la adjuntaremos a la vista y ejecutaremos su método para que la lluvia de confetti comience. 

{% highlight ruby %}
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        confettiView = SAConfettiView(frame: self.view.bounds)
        self.view.addSubview(confettiView)
        confettiView.startConfetti()
        
    }

{% endhighlight %}

No olvidemos importar la librería justo debajo de la importación de UIKit, de lo contrario... ¡error!

{% highlight ruby %}
    
    import UIKit
    import SAConfettiView

{% endhighlight %}

Tan fácil como eso. Con esta dependencia - framework - no necesitamos tocar nada de las vistas. Sólo inicializa tu proyecto en el emulador de Xcode y disfruta con el resultado!

![confetti](https://cloud.githubusercontent.com/assets/11940172/11791210/f97b6bd8-a2da-11e5-9083-b131fa796373.gif){: .center-image }

No olvides que tienes [el proyecto][enlaceUno] que hemos venido usando en este 'post' en mi respositorio de GitHub ;)


## Bonus:

Un breve inciso sobre el mantenimiento de nuestros pods en cualquiera de nuestros proyectos. Tenemos que aprender a diferenciar entre instalar y actualizar nuestros Pods. Cada vez que modificamos nuestro archivo Podfile para añadir o eliminar una dependencia, necesitaremos ejecutar 'pod install'. Si lo único que pretendemos es usar una versión más actual de algunos de los Pods de nuestro proyecto, deberemos usar 'pod update' una vez modificado nuestro Podfile. Hay que recordar que esta "actualización" seguirá los límites que impusimos dentro del Podfile, por tanto, si pusimos 

{% highlight ruby %}
    
    pod 'MyAwesomePodLibrary', '~> 2.0'

{% endhighlight %}

CocoaPods intentará actualizar nuestra dependencia, pero nunca con una versión 2.0 o superior. Y por último, el comando 'pod outdated' listará todas las posibles versiones nuevas a las que podríamos actualizar. Para cualquier otra duda, recomiendo [la documentación de CocoaPods][enlaceNueve], es increíblemente buena.

Bibliografía:

-- [https://www.raywenderlich.com/97014/use-cocoapods-with-swift][enlaceCuatro]

-- [http://www.migueldiazrubio.com/desarrollo-ios-gestionar-dependencias-con-cocoapods/][enlaceSiete]

-- [https://www.kodigoswift.com/tutorial-cocoapods-instalacion-y-gestion-de-dependencias/][enlaceOcho]


[enlaceUno]: https://github.com/oskarko/CocoaPodsDemo
[enlaceDos]: https://github.com/oskarko/CocoaPodsDemo/blob/master/CocoaPodsDemo/ViewController.swift
[enlaceTres]: https://github.com/CocoaPods/CocoaPods
[enlaceCuatro]: https://www.raywenderlich.com/97014/use-cocoapods-with-swift
[enlaceCinco]: https://guides.cocoapods.org/using/the-podfile.html
[enlaceSiete]: http://www.migueldiazrubio.com/desarrollo-ios-gestionar-dependencias-con-cocoapods/
[enlaceOcho]: https://www.kodigoswift.com/tutorial-cocoapods-instalacion-y-gestion-de-dependencias/
[enlaceNueve]: https://guides.cocoapods.org/
[enlaceDiez]: http://github.com/CocoaPods/Specs
[enlaceDoce]: https://cocoapods.org/pods/SAConfettiView




