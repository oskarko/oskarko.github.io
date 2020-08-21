---
title:  "NDK de android o como ejecutar código nativo en C"
date:   2016-05-04 21:09:22
categories: [RxAndroid]
layout: post
tags: [NDK]
comments: True
---
Los desarrolladores pueden, mediante el Android NDK ([Native Development Kit][uno]), reutilizar código escrito en C/C++ haciendo uso de ello a través del JNI ([Java Native Interface][jni]). El NDK hace que la ejecución de la aplicación sea directamente en el procesador y no será interpretado mediante una máquina virtual, siendo común en aplicaciones que hagan un uso intensivo de la CPU mediante complejas operaciones matemáticas. En algunas ocasiones esto puede traducirse en una ejecución de la app más rápida.

El uso de código nativo en android no está al alcance de todos, y su uso es, cuanto menos, difícil de manejar. Realmente no aporta grandes mejores o diferencias respecto a código android, por lo que,  a no ser que no nos quede más remedio, deberemos de sopesar su implementación. Aplicaciones como Whatsapp o Skype utilizan el NDK de android, ¿curioso, verdad?

![Ahhhmmmm]({% link images/friends1.gif %}){: .center-image }

Manos a la obra, lo primero que deberemos hacer será [descargar el NDK de android][dos] según cual sea nuestro SO; descargadlo y descomprimidlo; yo he renombrado la carpeta como ndk, simplemente. Ahora la copiaremos al directorio donde tengamos instalado el SDK de android y la añadiremos al PATH.

{% highlight ruby %}
    
    mv ndk /Users/Oskarko/Library/Android 

{% endhighlight %}

{% highlight ruby %}
    
    export PATH=$PATH:/Users/Oskarko/Library/Android/ndk

{% endhighlight %}

El último paso sería compilar el código nativo mediante el NDK de android, para ello navegamos a la raíz de nuestro proyecto y lo compilamos con el comando `ndk-build`

Como proyecto de ejemplo he tomado prestado el visor de PDF de los chicos de [APV PDF Viewer][tres]. 

{% highlight ruby %}
    
    sh

    python2.7 ./scripts/pjpp.py --configuration pro

{% endhighlight %}

{% highlight ruby %}
    
    ../scripts/build-native.sh

{% endhighlight %}

{% highlight ruby %}
    
    cd ..
    ndk-build

{% endhighlight %}

Después de descomprimir el proyecto y ejecutar [algún comando en Python][enlaceUno], compilo el código mediante `ndk-build` para generar las librerías `*.so`

![Carpeta LIBS]({% link images/lib_apv.png %}){: .center-image }

Una vez copiadas a la carpeta `libs` de Android Studio tan sólo tendremos que darle a Gradle todo lo que nos pida hasta conseguir compilar la app.

![Dandole a Gradle lo que te pide]({% link images/friends2.gif %}){: .center-image }


Puedes descargar el proyecto completo desde [mi repositorio de GitHub][enlaceCodeRepo]



Bibliografía:

-- [https://code.google.com/archive/p/apv/wikis/Building.wiki][enlaceUno]

-- [https://geekytheory.com/que-es-el-android-ndk-parte-1/][enlaceDos]

-- [https://geekytheory.com/instalacion-del-android-ndk-parte-2/][enlaceTres]

-- [https://geekytheory.com/hola-mundo-con-android-ndk-parte-4/][enlaceCuatro]

-- [https://geekytheory.com/paso-de-parametros-en-funciones-con-android-ndk-parte-5/][enlaceCinco]

[uno]: https://developer.android.com/intl/es/tools/sdk/ndk/index.html
[dos]: https://developer.android.com/intl/es/ndk/downloads/index.html
[jni]: http://developer.android.com/intl/es/training/articles/perf-jni.html
[tres]: https://code.google.com/archive/p/apv/
[enlaceUno]: https://code.google.com/archive/p/apv/wikis/Building.wiki
[enlaceDos]: https://geekytheory.com/que-es-el-android-ndk-parte-1/
[enlaceTres]: https://geekytheory.com/instalacion-del-android-ndk-parte-2/
[enlaceCuatro]: https://geekytheory.com/hola-mundo-con-android-ndk-parte-4/
[enlaceCinco]: https://geekytheory.com/paso-de-parametros-en-funciones-con-android-ndk-parte-5/
[enlaceCodeRepo]: https://github.com/oskarko/APVExample