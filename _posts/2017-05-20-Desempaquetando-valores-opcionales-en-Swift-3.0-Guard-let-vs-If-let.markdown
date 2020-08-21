---
title:  "Desempaquetando valores opciones en Swift 3.0 - Guard let vs If let"
date:   2017-05-20 17:04:22
categories: [iOS, Swift]
layout: post
tags: [iOS, Swift]
comments: True
---
Cuando comienzas a escribir código como programador iOS necesitas flexibilidad: poder usar vars o lets (variables o constantes), classes o structs (clases o estructuras), sets o arrays... Independientemente de su funcionalidad, poder elegir entre diferentes soluciones es súper importante para poder llegar a ser un mejor programador, en cuanto a productividad se refiere.

Desempaquetar valores opciones no es una excepción.

Seguramente ya estarás familiarizado con la comprobación y desempaquetado de valores opcionales mediante la sintaxis "if let" a la hora de desempaquetar un valor opcional. Dicha sintaxis nos permite desempaquetar un valor opcional de forma segura y muy sencilla cuando el valor opcional contiene un valor, y si no lo contiene, simplemente no ejecuta el bloque de código existente dentro del "if let". Simplemente lo colocas, y te centras en el código que se debe ejecutar únicamente cuando tengamos un valor dentro del valor opcional.

Por tanto, ¿Por qué deberíamos usar otra sintaxis si "if let" funciona maravillosamente bien?, pues por lo que he escrito en el primer párrafo: para ser mejores programadores. Cuanto más simple, claro y sencillo sea nuestro código, más mantenible podrá ser.

Veamos el siguiente ejemplo:

![GuardLetViewController]({% link images/guardletviewcontroller.png %}){: .center-image }

Es una sencilla aplicación para iOS donde solicitaremos al usuario varios datos personales mediante "textFields" para posteriormente mostrarlos en una única "label". Los valores que se obtienen de estos "textfields" son valores opcionales, por lo que tendremos que desempaquetarlos previamente antes de poder mostrarlos en la "label".

La manera más sencilla que se nos podría ocurrir sería algo así:

![GuardLetViewController1]({% link images/guardletviewcontroller1.png %}){: .center-image }

Aunque funciona bien, queda un poco engorroso con tantos if anidados, ¿no? ¿Qué pasaría si tuviésemos diez IF más? Sería un poco enredado su mantenimiento y escalabilidad. Podríamos usar una pequeña variación para no andar anidando los IF: (usando return con cada if-let)

![GuardLetViewController2]({% link images/guardletviewcontroller2.png %}){: .center-image }

Se ve un poco más claro y sencillo que el anterior pero los valores opcionales desempaquetados sólo podrán ser usados dentro de sus correspondientes "if let", si queremos usarlos posteriormente tendremos que volver a desempaquetarlos, por tanto, no parece una opción muy eficiente.

Ahora intentaremos reescribir el código nuevamente usando "guard let", que fue una de las mejoras que se introdujo con la llegada de Swift 2.0, en lugar de "if let":

![GuardLetViewController3]({% link images/guardletviewcontroller3.png %}){: .center-image }

De esta forma nuestro código se ve más legible y fácil de mantener, ¿verdad? Y estos dos factores son muy importantes, sobre todo si trabajamos en equipo con otros programadores. Además, usando "guard let" nos ahorramos todas las anidaciones que vimos en el primer ejemplo de "if let". Y lo que hace realmente valioso a "guard let" (y a diferencia de "if let") es que los valores opcionales que desempaquetamos seguirán estando desempaquetados para el resto del bloque de código, incluso fuera del "guard let".

Podemos optimizar el código aún más todavía sin perder claridad

![GuardLetViewController4]({% link images/guardletviewcontroller4.png %}){: .center-image }

Nota: Dentro de cada "guard let" debemos de tener obligatoriamente un elemento de control de flujo, bien sea un simple return, un break o un continue (Ojo! recuerda que tanto break como continue se usan para bucles, y return para funciones).

Podemos probar todos estos conceptos fácilmente en "Playground".

![GuardLetViewController5]({% link images/guardletviewcontroller5.png %}){: .center-image }

![GuardLetViewController6]({% link images/guardletviewcontroller6.png %}){: .center-image }


Usando "guard" podemos mejorar la calidad de nuestro código, con una mejor lectura y un mantenimiento más sencillo. Todo va a depender finalmente de nuestros gustos a la hora de elegir entre "if let" o "guard let". Pero de nuestra flexibilidad como programadores dependerá nuestra productividad final.


![Goku_Napa]({% link images/DBZ_05.gif %}){: .center-image }

Eso sí, no debemos caer en el error de querer usar "guard let" en todo momento que nos sea posible. Los extremos siempre son malos. Lo ideal es no sustituir sentencias sencillas de IF-ELSE mediante "guard let", con ello el código se hará más engorroso nuevamente a la hora de leerlo.

{% highlight ruby %}
    
    // Don't:
    ...
    guard let name = nameTextField, name != "Oscar" else {
        return nil
    }
    
    return name
}



    // Better!
    ...
    if let name = nameTextField, name != "Oscar" {
        return nil
    } else {
        return name
    }
}

{% endhighlight %}



Y tampoco se recomienda su uso para sustituir sentencias IF-ELSE más conplejas. Además, y ya para terminar, no se recomienda escribir dentro de la cláusula ELSE del "guard let" más de una o dos líneas. Si realmente tienes que escribir un bloque de código complejo te encuentras en la situación anterior. 




Bibliografía:

-- [https://medium.com/@mimicatcodes/unwrapping-optional-values-in-swift-3-0-guard-let-vs-if-let-40a0b05f9e69][enlaceUno]

-- [http://radex.io/swift/guard/][enlaceDos]

-- [https://andybargh.com/the-swift-guard-statement/][enlaceTres]

-- [The Swift Programming Language (Swift 3.1)][enlaceCuatro]



[enlaceUno]: https://medium.com/@mimicatcodes/unwrapping-optional-values-in-swift-3-0-guard-let-vs-if-let-40a0b05f9e69
[enlaceDos]: http://radex.io/swift/guard/
[enlaceTres]: https://andybargh.com/the-swift-guard-statement/
[enlaceCuatro]: https://developer.apple.com/library/content/documentation/Swift/Conceptual/Swift_Programming_Language/TheBasics.html#//apple_ref/doc/uid/TP40014097-CH5-ID309
