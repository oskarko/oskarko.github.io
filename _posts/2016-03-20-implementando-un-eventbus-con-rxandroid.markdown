---
title:  "Implementando un Event Bus con RxAndroid"
date:   2016-03-20 12:05:22
categories: [RxAndroid]
tags: [RxAndroid]
---
Una de las rutinas más tediosas a la hora de crear una app es la implementación de la  comunicación entre las distintas partes de las que se compone dicha app (actividades, fragmentos, servicios...). Que si métodos de Callback, que si AsyncTask, intents, y aún así, nunca estamos a salvo de ser sorprendidos por un [NPE][NullPointerException] al eliminarnos el recolector de basuras de Android una actividad en el momento menos oportuno.

Para solucionar este quebradero de cabeza podemos usar un modelo de Event Bus para simplificar todas la comunicaciones internas de nuestra app. Pero, ¿qué es un Event Bus? El modelo de Event Bus se encarga de la transmisión de Objetos Java entre actividades, fragmentos y servicios, y además, de una manera fácil y limpia.

Hay varios framework que funcionan como Event Bus: [EventBus de greenRobot][EventBusGreenRobot], [Otto de Square][OttoDeSquare] y [RxAndroid][RxAndroidEnlace] entre varios otros. Para nuestro ejemplo usaremos RxAndroid, que entre sus muchas funciones, una de ellas es poder actuar en un modelado de Event Bus.

El modelo de Event Bus se compone de cuatro piezas fundamentales: un `bus` o canal de comunicación, un `evento` o clase POJO que se enviará a través del bus, un `publisher` que enviará dichos eventos y uno o varios `subscribers` que recibirán los eventos.

En nuestro ejemplo tendremos una única actividad que contendrá dos fragmentos en su interior ejecutandose a la misma vez. Uno de esos fragmentos contendrá un botón, que al hacer 'clik' sobre él lanzará un evento que se recibirá en el segundo fragmento, y al recibirlo, lanzará un simple SnackBar que se mostrará en la actividad principal.

Primero necesitaremos añadir las dependencias de RxAndroid a gradle.

{% highlight ruby %}
dependencies {
    
    compile 'io.reactivex:rxandroid:1.1.0' 
}
{% endhighlight %}

Definiremos nuestra clase bus con un método para enviar eventos y otro para "recibirlos". Su implementación es bastante sencilla.

{% highlight ruby %}
public class RxBus {

    private final Subject<Object, Object> _bus;
    
    _bus = new SerializedSubject<>(PublishSubject.create());

    public void send(Object o) {
        _bus.onNext(o);
    }

    public Observable<Object> toObserverable() {
        return _bus;
    }
}
{% endhighlight %}

El evento que enviaremos en nuestro ejemplo será un simple objeto Java que contendrá un String como atributo. El "publisher" será el botón contenido en el primer fragmento. Al clickar sobre él se ejecutará uno de los dos métodos implementados en nuestra clase bus, por tanto, debemos de registrarnos en dicha clase y a través de ella enviar nuestro evento POJO.

{% highlight ruby %}
mButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                
                _rxBus.send(new OskarkoEvent("click!"));
            }
        });
{% endhighlight %}

Sólo tendremos un "subscriber" en este ejemplo. Estará a la escucha de recibir los eventos en el segundo fragmento, y publicará en la actividad principal el texto que contendrá el evento en su interior.

{% highlight ruby %}
_subscriptions
        .add(_rxBus.toObserverable()
                .subscribe(new Action1<Object>() {
                    @Override
                    public void call(Object event) {
                        if (event instanceof OskarkoEvent) {
                            Snackbar
                            .make(getView(), ((OskarkoEvent) event).getText(), 
                                    Snackbar.LENGTH_SHORT).show();
                        }
                    }
                }));
{% endhighlight %}

Así que, finalmente, tenemos dos fragmentos cargados en la actividad principal, y al clickar sobre el botón del primer fragmento, con la implementación de un Event Bus con RxAndroid, el segundo fragmento recibirá el evento con muy pocas líneas de código, sin interfaces con métodos de Callback, sin intents, sin AsyncTask... cómodo y sencillo.

![Actividad mostrando SnackBar]({{ site.url }}/images/rxbusexample2.jpg){: .center-image }


Hay que tener en cuenta algunos aspectos antes de usar un modelo de Event Bus:

- No creas que siempre será mejor sustituir un patrón de comunicación con el modelo de Event Bus. Una AsyncTask o un simple listener serán una mejor opción en muchas ocasiones. Imagina el ejemplo de un "subscriber" que actuará como "publisher" a la vez con un mismo evento. La depuración puede llegar a ser casi imposible.

- No olvides registrar y desregistrar tus "publishers" y "subscribers" para no hacer un acopio innecesario de memoria, de lo contrario tu app podría no discurrir de la forma que esperas. Haz la prueba ;-)

- Recuerda que un "subscriber" que está contenido en una actividad o un fragmento que es nulo en un momento determinado no llegará a recibir nunca ese evento. Con la librería EventBus de greenRobot hay una forma de que sí puedan recibirlos, pero con RxAndroid y Otto, NO.


Puedes descargar el proyecto completo desde [mi repositorio de GitHub][enlaceCodeRepo]

![Minions aplaudiendo]({{ site.url }}/images/minions.gif){: .center-image }



Bibliografía:

- [http://nerds.weddingpartyapp.com/tech/2014/12/24/implementing-an-event-bus-with-rxjava-rxbus/][enlaceUno]

- [https://github.com/kaushikgopal/RxJava-Android-Samples][enlaceDos]

- [http://aaronliew.github.io/blog/2015/04/15/rxandroid/][enlaceTres]

- [https://guides.codepath.com/android/Communicating-with-an-Event-Bus][enlaceCuatro]

[enlaceUno]: http://nerds.weddingpartyapp.com/tech/2014/12/24/implementing-an-event-bus-with-rxjava-rxbus/
[enlaceDos]: https://github.com/kaushikgopal/RxJava-Android-Samples
[enlaceTres]: http://aaronliew.github.io/blog/2015/04/15/rxandroid/
[enlaceCuatro]: https://guides.codepath.com/android/Communicating-with-an-Event-Bus
[enlaceCodeRepo]: https://github.com/oskarko/RxAndroidExample
[NullPointerException]: https://docs.oracle.com/javase/7/docs/api/java/lang/NullPointerException.html
[EventBusGreenRobot]: https://github.com/greenrobot/EventBus
[OttoDeSquare]: http://square.github.io/otto/
[RxAndroidEnlace]: https://github.com/ReactiveX/RxAndroid