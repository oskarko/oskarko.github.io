---
title:  "Patrón MVP y test unitarios"
date:   2016-11-19 21:04:22
categories: [MVP, test unitarios]
layout: post
tags: [MVP, test unitarios]
comments: True
---
He decidido dividir esta entrada en dos entradas diferentes para que no fuese extremadamente larga y aburrida de leer. En esta primera entrada os hablaré sobre el **patrón MVP y los test unitarios**, tan olvidados como necesarios.

A diferencia del `patrón MVC`, el `patrón MVP` intenta desacoplar tanto como pueda el uso del framework de Android, facilitando así los test unitarios. MVP aporta independencia del framework de Android.

![modelView]({% link images/MVP-Android1.png %}){: .center-image }


Las vistas quedan unicamente para recibir la interacción del usuario con la aplicación y mostrar en pantalla los cambios asociados a esas interacciones previas (si pulso un botón, muestra un Toast...). Las vistas son las Activity y los Fragment propiamente dicho. 

El presenter es una capa intermedia que desacopla la lógica de la aplicación de las vistas. Actúa como intermediario entre las vistas y los casos de uso (los modelos). Recibe los datos provenientes de los modelos y los prepara para pasarlos a las vistas. 

Los modelos son los casos de uso de la propia aplicación (llamadas a la API, CRUD sobre BBDD, etc), es decir, la lógica de negocio de la aplicación. Lo ideal y lo recomendable es que sólo exista un modelo por cada caso de uso de la aplicación para una mayor escalabilidad de la aplicación ([principios SOLID][enlaceSOLID]).

Para la realización de los test unitarios de un modo más simple es ideal el uso de interfaces con las vistas. Aunque [hay quien no es partidario de ello.][wasteOfTime]

Para sacar el máximo partido a este patrón de diseño se suele usar la inyección de dependencias, pero eso lo veremos en otro momento. Por ahora **será la propia actividad la encargada de proporcionar las dependencias** al presenter. Veremos [un ejemplo sencillo][enlaceRepo]. En lugar de crear las dependencias que necesitamos para realizar una determinada tarea, estas dependencias vendrán dadas (inyectadas) en el constructor o en algunos setters(). Así, por ejemplo, el presenter no necesita nunca llamar a getActivity() para conseguir el contexto del framework de Android, sino que éste, por ejemplo, se le pasará en el contructor o en un setter mediante una interfaz. Nuestro presenter no necesita lidiar directamente con el framework, sino con clases que contengan el contexto y que implementen dichas interfaces para hacerlo todo de una forma más abstracta.

En proyectos grandes es común usar la inyección de dependencias para no complicarnos la vida con las dependencias en gran número. Pero como digo, eso lo veremos en otra entrada...

**ventajas** de usar el Patrón MVP:

* escribir un código más limpio, sin invasión del framework de Android a partir de la capa del presenter.
* test unitarios más sencillos.

**desventajas**:

* no existe mucha documentación en lógicas de negocio complejas.



![bigbangt_dos]({% link images/bbt_02.gif %}){: .center-image }



**Ciclo de trabajo del patrón MVP:** 

`View -> Presenter:` mediante listener los presenter recibirán las interacciones del usuario sobre la interfaz gráfica (UI).

`Presenter -> View:` simplemente llamando métodos para actualizar las vistas como por ejemplo setText() o setBackgroundColor().

`Presenter -> Model:` Se solicitará actualizar los datos llamando a setters de los modelos como, por ejemplo, myModel.saveEmail("oskarko@myemail.com").

`Model -> Presenter:` Normalmente los modelos actualizarán la información realizando llamadas a las distintas API o consultando las bases de datos. Una vez que se han obtenido los datos deseados, se puede notificar al presenter de los nuevos datos mediante métodos de callbacks tales como updateEmail(String email).

En nuestro [proyecto de ejemplo][enlaceRepo] tendremos una vista (*activity*) con dos botones, realizando al hacer 'clic' sobre cada uno de ellos, una tarea distinta. Por tanto tendremos una vista, un presenter y dos modelos (tantos como casos de uso).
El primer botón realizará una llamada a un servicio web mediante retrofit y mostrará un mensaje según el resultado obtenido. El segundo botón simulará una consulta a una base de datos para rellenar y visualizar una lista con datos ficticios.

{% highlight ruby %}
    
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        // ...
        service = ((MVPApplication)getApplication()).getNetworkService();
        presenter = new MainPresenterImpl(this, new FindItemsInteractorImpl(), service);
    }

    @Override
    public void onClick(View v) {
        switch (v.getId()) {
            case R.id.buttonRetrofit:
                presenter.onClick(0);
                break;
            case R.id.buttonList:
                presenter.onClick(1);
                break;
        }
    }

    @Override
    public void showMessage(String msg) {
        Toast.makeText(this, msg, Toast.LENGTH_LONG).show();
    }

    @Override
    public void onItemClick(AdapterView<?> parent, View view, int position, long id) {
        presenter.onItemClicked(position);
    }

{% endhighlight %}

Como vemos, la actividad simplemente inicializa el presenter con las dependencias necesarias y pasa al presenter la elección tomada por el usuario en cada acción, o muestra en pantalla los cambios o resultados que el propio presenter le ordenará.


{% highlight ruby %}

@Override
    public void onItemClicked(int position) {
        if (mainView != null) {
            mainView.showMessage(String.format("Position %d clicked", position + 1));
        }
    }

    @Override
    public void onClick(int id) {
        mainView.showProgress();
        if (id == 0){
            loadRetrofitData();
        }
        else {
            findItemsInteractor.findItems(this);
        }
    }

    public void loadRetrofitData(){
        result = 0;
        // llamada asíncrona
        service.makeCall(this);
    }

    @Override
    public void onSuccess(int userId) {
        result = userId;
        mainView.hideProgress();
        mainView.showMessage(String.format("Respuesta del webService -> userId: %d", userId));
    }

    @Override
    public void onFail(String msg) {
        mainView.hideProgress();
        mainView.showMessage(msg);
    }

{% endhighlight %}

En el presenter, mediante las dependencias inyectadas en el constructor, y con los métodos de callback para obtener las respuestas es donde decidiremos que modelos llamar para conseguir los datos o resultados que más nos interesan en cada momento de la aplicación.


{% highlight ruby %}
    
    @Override
    public void findItems(OnFinishedListener listener) {
        listener.onFinished(createArrayList());
    }

    private List<String> createArrayList() {
        return Arrays.asList(
                "Item 1",
                "Item 2",
                "Item 3",
                "Item 4",
                "Item 5",
                "Item 6",
                "Item 7",
                "Item 8",
                "Item 9",
                "Item 10"
        );
    }

{% endhighlight %}

Y en los modelos de la aplicación es donde se contendrá toda la lógica de negocios. En este ejemplo, simulamos rellenar un array como si llamásemos a una base de datos y devolvemos los datos al presenter mediante el listener.

Puede parecer complicado a primera vista, además del uso de las diferentes interfaces que implementan las vistas, presenters y modelos. Nada más lejos de la realidad, es tan fácil como crear un proyecto vacío e ir programando poco a poco para ver exáctamente como funciona este patrón en concreto. Puedes echarle un vistazo al [proyecto de ejemplo][enlaceRepo] para ver realmente como está definido cada cosa. Te sorprenderás gratamente de su simpleza.

![indiana_jones]({% link images/indiana_01.gif %}){: .center-image }


Y ahora pasemos a hablar un poco sobre los **test unitarios**. Los test unitarios son el mecanismo que tenemos los programadores para comprobar que nuestros métodos funcionan tal y como deberían de funcionar y devuelven el tipo de dato que deberían de devolver (en caso de devolver alguno). Deberán de ser automatizables, reutilizables, independientes y profesionales. Una de su mayores ventajas es que funcionan a modo de documentación del propio código y en caso de contener algún error en nuestro código, éste queda más acotado y localizable (ojo! el que nuestra aplicación supere todos los test unitarios no significa que esté libre de contener errores).

Podremos ser muy buenos programadores pero sin la práctica necesaria no seremos capaces de realizar buenos test unitarios por el simple hecho de que es una codificación "diferente". Además, algunas de las preguntas más recurrentes a la hora de escribir test unitarios es `¿Qué debo testear? ¿TODO?` Pues no, no deberemos de comprobar el funcionamiento del propio framework de Android o las librerías externas que usamos en nuestro proyecto, como **retrofit**, por ejemplo. Puesto que no controlamos ese código; por tanto, deberemos de testear únicamente **nuestro propio código.**

{% highlight ruby %}
    
    @Test
    public void checkIfShowsMessageOnItemClick() {
        presenter.onItemClicked(1);
        verify(view, times(1)).showMessage(anyString());
    }

{% endhighlight %}

En este primer test hemos comprobado que al presionar sobre cualquiera de los dos botones de la aplicación se muestra un resultado en pantalla.

`El que tu aplicación supere todos los test unitarios no significa que esté libre de 'bugs', pero de seguro que si no los supera, signifca que algo no está funcionando como debería. Son tan importantes como necesarios.`

Existen dos tipos de tests:

* Prueba unitaria: prueba un único método de una clase. El alcance es muy reducido y está perfectamente acotado. Cualquier dependencia del módulo bajo prueba debe ser sustituida por un mock, o un stub.
* Prueba de integración: prueba la interacción entre dos o más elementos, que pueden ser clases, módulos, paquetes, subsistemas, etc… incluso la interacción del sistema con el entorno de producción.

Para obtener una definición de Mock y Stub, podemos citar lo que **Gerard Meszaros** definió en su libro `XUnit Test Patterns`:

Los Stubs, "proporcionan respuestas predefinidas a ciertas llamadas durante los test, sin responder a otra cosa para la que no hayan sido programados”, es decir, los stubs son configurados para que devuelvan valores que se ajusten a lo que la prueba unitaria quiere probar, por lo que se utilizan para verificar el estado de los objetos. Serían por ejemplo el resultado de una consulta a base de datos que puede realizar un modelo.

Los Mocks, "son objetos preprogramados con expectativas que conforman la especificación de lo que se espera que reciban las llamadas”, es decir, son objetos que se usan para probar que se realizan correctamente llamadas a otros métodos, por ejemplo, a una web API, por lo que se utilizan para verificar el comportamiento de los objetos. Aunque también pueden devolver una respuesta con un estado determinado, su foco se centra más en el análisis del comportamiento. Nos ayudan a testear, por tanto, el paso de mensajes entre objetos.

Usaremos Robolectric y Mockito para nuestros test unitarios sobre MVP.

{% highlight ruby %}
    
    @Test
    public void checkIfItemsArePassedToView() {
        List<String> items = Arrays.asList("Model", "View", "Presenter");
        presenter.onFinished(items);
        verify(view, times(1)).setItems(items);
        verify(view, times(1)).hideProgress();
    }

{% endhighlight %}

En este segundo test comprobamos que la conexión entre el presenter y la vista funciona sin problemas, y ésta última recibe los datos de forma correcta de parte del presenter.

{% highlight ruby %}
    
    @Test
    public void checkRetrofitCallIsCorrect() throws Exception {

        ArgumentCaptor<String> captor = forClass(String.class);
        final int result = 1;

        presenter.loadRetrofitData();
        verify(service, times(1)).makeCall(callbackAC.capture());

        // comprobación previa
        assertThat(presenter.getResult(), is(equalTo(0)));

        callbackAC.getValue().onSuccess(result);

        // comprobaciones finales
        assertThat(presenter.getResult(), is(equalTo(result)));
        verify(view, times(1)).hideProgress();
        verify(view, times(1)).showMessage(captor.capture());
        assertThat(captor.getValue(), is(String.format("Respuesta del webService -> userId: %d", result)));

    }

{% endhighlight %}

Realizar test unitarios sobre un IntenService no es nada fácil ([ejemplo][enlaceIntentService]), y es ahí donde radica la belleza de este patrón de diseño. Si modelas bien tu aplicación, no necesitarás usar ningún IntentService. Y como ejemplo, realizaremos una llamada a un webService mediante retrofit de forma totalmente asíncrona sin necesidad de usar ningún intentService. Con el proyecto adjunto sus [correspondientes test unitarios][enlaceTests].

![thank_you]({% link images/thank_you.gif %}){: .center-image }





Bibliografía:

-- [http://fernandocejas.com/2014/04/08/unit-testing-asynchronous-methods-with-mockito/][enlaceUno]

-- [http://www.genbetadev.com/paradigmas-de-programacion/usando-mvp-e-inversion-de-dependencias-para-abstraernos-del-framework-en-android][enlaceDos]

-- [https://erikcaffrey.github.io/2015/11/03/mvp/][enlaceTres]

-- [http://104.168.175.144/modelo-vista-presentador-mvp-en-android/][enlaceCuatro]

-- [https://www.captechconsulting.com/blogs/a-mvp-approach-to-lifecycle-safe-requests-with-retrofit-20-and-rxjava][enlaceCinco]

-- [https://kmangutov.wordpress.com/2015/03/28/android-mvp-consuming-restful-apis/][enlaceSeis]

-- [http://www.limecreativelabs.com/mvp-android/][enlaceSiete]

-- [http://macoscope.com/blog/model-view-presenter-architecture-in-android-applications/][enlaceOcho]

-- [http://joshfischer.io/#!/sept2016][enlaceNueve]

-- [http://mdswanson.com/blog/2013/12/16/reliable-android-http-testing-with-retrofit-and-mockito.html][enlaceDiez]

-- [http://xurxodeveloper.blogspot.com.es/2014/11/pruebas-unitarias-en-android-con-mockito.html][enlaceOnce]

-- [https://unpocodejava.wordpress.com/2012/07/11/un-poco-de-mockito/][enlaceDoce]

-- [https://es.wikipedia.org/wiki/Modelo%E2%80%93vista%E2%80%93presentador][enlaceTrece]

-- [https://blackpentsoft.wordpress.com/2013/02/04/test-de-integracion-vs-test-unitarios/][enlaceCatorce]

-- [https://itblogsogeti.com/2015/03/26/desarrollo-pruebas-unitarias-trinitario-gomez-sogeti/][enlaceQuince]



[enlaceUno]: http://fernandocejas.com/2014/04/08/unit-testing-asynchronous-methods-with-mockito/
[enlaceDos]: http://www.genbetadev.com/paradigmas-de-programacion/usando-mvp-e-inversion-de-dependencias-para-abstraernos-del-framework-en-android
[enlaceTres]: https://erikcaffrey.github.io/2015/11/03/mvp/
[enlaceCuatro]: http://104.168.175.144/modelo-vista-presentador-mvp-en-android/
[enlaceCinco]: https://www.captechconsulting.com/blogs/a-mvp-approach-to-lifecycle-safe-requests-with-retrofit-20-and-rxjava
[enlaceSeis]: https://kmangutov.wordpress.com/2015/03/28/android-mvp-consuming-restful-apis/
[enlaceSiete]: http://www.limecreativelabs.com/mvp-android/
[enlaceOcho]: http://macoscope.com/blog/model-view-presenter-architecture-in-android-applications/
[enlaceNueve]: http://joshfischer.io/#!/sept2016
[enlaceDiez]: http://mdswanson.com/blog/2013/12/16/reliable-android-http-testing-with-retrofit-and-mockito.html
[enlaceOnce]: http://xurxodeveloper.blogspot.com.es/2014/11/pruebas-unitarias-en-android-con-mockito.html
[enlaceDoce]: https://unpocodejava.wordpress.com/2012/07/11/un-poco-de-mockito/
[enlaceTrece]: https://es.wikipedia.org/wiki/Modelo%E2%80%93vista%E2%80%93presentador
[enlaceCatorce]: https://blackpentsoft.wordpress.com/2013/02/04/test-de-integracion-vs-test-unitarios/
[enlaceQuince]: https://itblogsogeti.com/2015/03/26/desarrollo-pruebas-unitarias-trinitario-gomez-sogeti/
[enlaceRepo]: https://github.com/oskarko/MVP-Pattern-Example
[enlaceIntentService]: http://ics.upjs.sk/~novotnyr/blog/1160/one-does-not-simply-test-the-intentservices
[enlaceTests]: https://github.com/oskarko/MVP-Pattern-Example/blob/master/app/src/test/java/es/org/mvpexample/ExampleUnitTest.java
[enlaceSOLID]: http://www.genbetadev.com/paradigmas-de-programacion/solid-cinco-principios-basicos-de-diseno-de-clases
[wasteOfTime]: https://gist.github.com/pedrovgs/61a8301a9952d195081edc989aa1fd41