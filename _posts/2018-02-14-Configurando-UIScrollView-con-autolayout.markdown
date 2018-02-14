---
title:  "Configurando UIScrollView con autolayout"
date:   2018-02-14 16:23:22
categories: [iOS, Swift]
layout: post
tags: [iOS, Swift]
comments: True
---
Como desarrollador de iOS he visto en más de una ocasión a compañeros sufriendo con el uso de los scrollView. Desde soluciones poco elegantes hasta acabados poco funcionales, pasando por mil y una soluciones poco o nada aconsejables. En este pequeño post os mostraré como lo hago yo, de una forma sencilla y fácil de manejar. Y podréis darle toda la altura que necesitéis.

Lo primero que haremos es crear un proyecto a modo de ejemplo:

![UIScrollView01]({{ site.url }}/images/UIScrollView01.png){: .center-image }

Sobre el ViewController que ya tenemos en nuestro storyBoard añadiremos un UIScrollView:

![UIScrollView02]({{ site.url }}/images/UIScrollView02.png){: .center-image }

Usaremos autolayout para ajustar todas las constraints a la vista superior:

![UIScrollView03]({{ site.url }}/images/UIScrollView03.png){: .center-image }

Ahora añadiremos un UIView (al que llamaremos "Background View") al interior de nuestro scrollView. Deberemos de tener nuestro único ViewController como en la imagen:

![UIScrollView04]({{ site.url }}/images/UIScrollView04.png){: .center-image }

A este UIView (al que hemos llamado "Background View") le añadiremos constraints para ajustarlo por completo al scrollView:

![UIScrollView05]({{ site.url }}/images/UIScrollView03.png){: .center-image }

** Súper importante ** A nuestro "Background View" le añadiremos un par de constraints más: "Equal Heights" y "Equal Widths" con la UIView superior de nuestro ViewController:

![UIScrollView06]({{ site.url }}/images/UIScrollView06.png){: .center-image }

Y a esta constraint de altura que acabamos de añadir deberemos de colocarle la prioridad baja (250):

![UIScrollView07]({{ site.url }}/images/UIScrollView07.png){: .center-image }

¡Listo! Ahora podemos añadir tantos elementos al interior de nuestro scrollView como necesitemos, y funcionará maravillosamente igual de bien con todos ellos. No olvidéis añadir constraints a los elementos que vayáis añadiendo al interior del scrollView para que se muestren tal y como queréis.

![UIScrollView08]({{ site.url }}/images/UIScrollView08.png){: .center-image }

Por si tenéis alguna duda, [aquí os dejo un proyecto a modo de ejemplo][enlaceUno]

![UIScrollView09]({{ site.url }}/images/UIScrollView09.png){: .center-image }

Happy coding! :)

[enlaceUno]: https://medium.com/@mimicatcodes/unwrapping-optional-values-in-swift-3-0-guard-let-vs-if-let-40a0b05f9e69