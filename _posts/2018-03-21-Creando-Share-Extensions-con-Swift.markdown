---
title:  "Creando Share Extensions con Swift"
date:   2018-03-21 16:04:22
categories: [iOS, Swift]
layout: post
tags: [iOS, Swift]
comments: True
---
Si tu app usa algún tipo de archivo como imágenes, PDF o archivos en general, para su uso interno o como parte de una funcionalidad, seguramente necesitarás utilizar extensiones en tu aplicación para llevarla al siguiente nivel, pero ¿qué son las extensiones en iOS?

Con la llegada de iOS 8, Apple introdujo las conocidas [App Extensions][enlaceCuatro], una nueva forma de interactuar con una aplicación sin llegar a lanzarla. Podemos compartir archivos de una app a otra, o incluso modificar un archivo en una tercera app y obtenerla nuevamente ya modificada en nuestra aplicación, como ejemplos más significativos. Aunque la arquitectura de iOS (muy segura) impide el uso de código malicioso de terceras aplicaciones, el uso de extensiones dentro de nuestras propias aplicaciones puede llegar a ser un auténtico dolor de cabeza.

![ShareExtension01]({% link images/mr_T.gif %}){: .center-image }

Las extensiones no son una aplicación "independiente" de nuestra app; añaden una funcionalidad extra a nuestra app de forma eficiente y centrada en una sola y única tarea. Los tipos existentes de extensiones son: 

- `Today`: Una extensión que se muestra en la vista "Hoy" del Centro de Notificaciones que muestra información breve y permite realizar tareas rápidas y sencillas.
- `Share`: Una extensión que permite que su aplicación comparta (o reciba) contenido con usuarios en las redes sociales y otros servicios similares para compartir
- `Action`: Una extensión que permite la creación de botones de acción personalizados en una vista predefinida para permitir a los usuarios ver o transformar el contenido que se origina en una tercera aplicación.
- `Photo Editing`: Una extensión que permite a los usuarios editar una foto o un video dentro de la aplicación Fotos
- `Document Provider`: Una extensión utilizada para permitir que otras aplicaciones accedan a los documentos administrados por su aplicación
- `Custom Keyboard`: Una extensión que reemplaza el teclado del sistema

![ShareExtension02]({% link images/shareextension/image_12.png %}){: .center-image }

En el ejemplo de hoy veremos como crear una "Share extension" para recibir archivos desde otras aplicaciones a la nuestra. Para ellos [crearemos un proyecto de prueba][enlaceProyecto] donde añadiremos un "tableView" para poder mostrar los archivos que contiene nuestra aplicación en su carpeta interna.

![ShareExtension03]({% link images/shareextension/image_01.png %}){: .center-image }

Ahora necesitaremos añadir una extensión a nuestro proyecto. Para ello iremos a "File >> New >> Target..." y seleccionaremos una "Share Extension"

![ShareExtension04]({% link images/shareextension/image_02.png %}){: .center-image }

Tendremos que ponerle un nombre fácil de reconocer desde otras aplicaciones:

![ShareExtension05]({% link images/shareextension/image_03.png %}){: .center-image }

... y te pedirá confirmación para activar la extensión que acabas de crear, dile que "sí" (Activate)

![ShareExtension06]({% link images/shareextension/image_04.png %}){: .center-image }


Verás que ha aparecido una clase "ShareViewController" que `NO` hereda de UIViewController tal que así:

{% highlight ruby %}

class ShareViewController: SLComposeServiceViewController {

    override func isContentValid() -> Bool {
        // Do validation of contentText and/or NSExtensionContext attachments here
        return true
    }

    override func didSelectPost() {
        // This is called after the user selects Post. Do the upload of contentText and/or NSExtensionContext attachments.
    
        // Inform the host that we're done, so it un-blocks its UI. Note: Alternatively you could call super's -didSelectPost, which will similarly complete the extension context.
        self.extensionContext!.completeRequest(returningItems: [], completionHandler: nil)
    }

    override func configurationItems() -> [Any]! {
        // To add configuration options via table cells at the bottom of the sheet, return an array of SLComposeSheetConfigurationItem here.
        return []
    }
}

{% endhighlight %}

Practicamente borraremos todo esto y crearemos nuestra propia "ShareViewController" personalizada, aunque para eso, primero deberemos de personalizar el Storyboard asociado a esta clase. En mi caso, he borrado casi todo lo que venía por defecto y lo he dejado a mi gusto:

![ShareExtension07]({% link images/shareextension/image_05.png %}){: .center-image }

Una vez tengamos la vista, es hora de añadirle código a nuestra extensión. Lo primero será definir qué tipo de archivos vamos a aceptar en nuestra aplicación, así que abriremos el archivo "Info.plist" de la extensión y sustituiremos este código:

{% highlight ruby %}

<key>NSExtension</key>
    <dict>
        <key>NSExtensionAttributes</key>
        <dict>
            <key>NSExtensionActivationRule</key>
            <string>TRUEPREDICATE</string>
        </dict>
        <key>NSExtensionMainStoryboard</key>
        <string>MainInterface</string>
        <key>NSExtensionPointIdentifier</key>
        <string>com.apple.share-services</string>
    </dict>

{% endhighlight %}

que viene a significar que acepta cualquier archivo. Pero nosotros no queremos todos los archivos posibles, sólo cogeremos archivos tipo PDF, docx, xlsx... por tanto sustituiremos el código anterior por este otro:

{% highlight ruby %}

<key>NSExtension</key>
    <dict>
        <key>NSExtensionAttributes</key>
        <dict>
            <key>NSExtensionActivationRule</key>
            <dict>
                <key>NSExtensionActivationSupportsFileWithMaxCount</key>
                <integer>1</integer>
                <key>NSExtensionActivationSupportsWebURLWithMaxCount</key>
                <integer>1</integer>
            </dict>
        </dict>
        <key>NSExtensionMainStoryboard</key>
        <string>MainInterface</string>
        <key>NSExtensionPointIdentifier</key>
        <string>com.apple.share-services</string>
    </dict>

{% endhighlight %}

que significa que aceptaremos archivos desde una URL (por ejemplo, desde Dropbox) o adjuntos en mensajes de Mail. Ahora entraremos en detalle sobre el resto del código de la extensión. Primero haremos que herede de UIViewController y añadiremos un método "importFile" que contendrá código similar al siguiente

{% highlight ruby %}

let fileItem = self.extensionContext!.inputItems.first as! NSExtensionItem
        let textItemProvider = fileItem.attachments!.first as! NSItemProvider
        
        let identifier = kUTTypeContent as String   // files attachment
        let identifier2 = kUTTypeURL as String  // URL files
        
        // from mail and others
        if textItemProvider.hasItemConformingToTypeIdentifier(identifier) {
            
            textItemProvider.loadItem(forTypeIdentifier: identifier, options: nil, completionHandler: { (fileURL, error) in
                if let fileURL = fileURL as? URL {
                    
                    let containerURL = FileManager.default.containerURL(forSecurityApplicationGroupIdentifier: "group.oscargarrucho.myapp")
                    if let fileContainer = containerURL {
                        
                        let fileName = fileURL.lastPathComponent.replacingOccurrences(of: "%20", with: " ")
                        let finale = URL(fileURLWithPath: "\(fileContainer.path)/\(fileName)", isDirectory: false)
                        
                        let fileManager = FileManager.default
                        do {
                            
                            try fileManager.copyItem(at: fileURL, to: finale)
                            self.presentAlert()
                        }
                        catch {
                            print(error)
                        }
                    }
                }
            })
        }

{% endhighlight %}

Primeramente identificamos qué tipo de archivos esperamos encontrar

{% highlight ruby %}

let identifier = kUTTypeContent as String

{% endhighlight %}

Para después, mediante un ItemProvider cargar el archivo que hemos recibido en nuestra "Share Extension" y copiarlo en la carpeta compartida que tiene nuestra extensión y nuestra aplicación principal, para cuando lanzemos nuestra aplicación, lea esta carpeta compartida en busca de los archivos importados desde otras aplicaciones. Una vez copiado el archivo a dicha carpeta compartida, mostraremos un UIAlertController para notificarlo al usuario y salir de la extensión

{% highlight ruby %}

func presentAlert() {
        let alertController = UIAlertController(title: "My App", message: "Your document has been imported correctly", preferredStyle: UIAlertControllerStyle.alert)
        let cancelAction = UIAlertAction(title: "Ok", style: UIAlertActionStyle.cancel) { (result : UIAlertAction) -> Void in
            self.extensionContext?.completeRequest(returningItems: nil, completionHandler: nil)
        }
        alertController.addAction(cancelAction)
        self.present(alertController, animated: true, completion: nil)
    }

{% endhighlight %}

como curiosidad, mirad que para retroceder y abandonar el ViewController actual no usamos un `dismiss` como normalmente hacemos, en su lugar usamos

{% highlight ruby %}

self.extensionContext?.completeRequest(returningItems: nil, completionHandler: nil)

{% endhighlight %}

para abadonar el ViewController de nuestra extensión. Curioso, eh? De igual modo que con ese código podremos coger los archivos que nos importen desde archivos en local (como archivos adjuntos en Mail), modificando levemente ese código podremos descargar archivos desde DropBox e importarlos también en nuestra aplicación. [No olvides echar un vistazo a nuestro proyecto para ver como hacer esto][enlaceProyecto]

![ShareExtension08]({% link images/matrix_01.gif %}){: .center-image }

Aquí solo nos queda habilitar los grupos entre nuestra aplicación y nuestra extensión para poder compartir los archivos entre ellas. Para ello iremos a la pestaña "Capabilities" y habilitaremos la opción "App Groups" en ambas. Desde el traget de nuestra aplicación crearemos un "App Groups" (suele ponerse "group." más el mismo bundle que usamos en la app). Una vez creada, deberemos añadirlo también en la extensión.

![ShareExtension09]({% link images/shareextension/image_06.png %}){: .center-image }

Listo, nuestra app ya tiene una "Share Extension" para importar archivos... ahora veremos cómo leerlos desde el ViewController de nuestra app.

{% highlight ruby %}

@objc func refresh() {
        
        let paths = FileManager.default.urls(for: .documentDirectory, in: .userDomainMask)
        let documentsDirectory = paths[0]
        let containerURL = FileManager.default.containerURL(forSecurityApplicationGroupIdentifier: "group.oscargarrucho.myapp")
        if let fileContainer = containerURL {
            var directoryContentsGroup : [URL] = []
            var fileName = ""
            var isDir : ObjCBool = false
            let fileManager = FileManager.default
            
            do {
                directoryContentsGroup = try FileManager.default.contentsOfDirectory(at: fileContainer, includingPropertiesForKeys: nil, options: [])
                directoryContentsGroup = try FileManager.default.contentsOfDirectory(at: fileContainer, includingPropertiesForKeys: [.contentModificationDateKey], options:.skipsHiddenFiles)
                
                for item in directoryContentsGroup {
                    
                    // We are going to copy each new file imported here!
                    if (fileManager.fileExists(atPath: item.path, isDirectory: &isDir)) {
                        if (!isDir.boolValue) {
                            fileName = item.lastPathComponent
                            let appGroupshared = URL(fileURLWithPath: "\(fileContainer.path)/\(fileName)", isDirectory: false)
                            let copiedFile = URL(fileURLWithPath: "\(documentsDirectory.path)/\(fileName)", isDirectory: false)
                            
                            if (fileManager.fileExists(atPath: appGroupshared.path)) {  // if exist in AppGroup, copy and remove
                                do {
                                    try fileManager.copyItem(at: appGroupshared, to: copiedFile)
                                    try fileManager.removeItem(atPath: appGroupshared.path)
                                }
                                catch {
                                    print(error)
                                }
                            } 
                        }
                    }
                }
            } catch { }
        }
        getAllFiles()  
    }

{% endhighlight %}

En nuestro ViewController tenemos un método "refresh" para leer los archivos que existan en la carpeta compartida con la extensión y copiarlos a la carpeta interna de la aplicación. Si se ha copiado bien, borraremos el archivo en la carpeta compartida puesto que ya no nos sirve. Después llamaremos a otro método, en este caso "getAllFiles()" para leer todos los archivos de nuestra carpeta interna y pintarlos en el tableView. Cómo hacer eso no entra dentro del objetivo de este post lo he omitido para no hace muy larga esta lectura, pero te recuerdo que [tienes el proyecto que estoy usando a modo de ejemplo colgado en Github][enlaceProyecto] para que le eches un ojo si te apetece. El resultado final sería algo así:

![ShareExtension11]({% link images/shareextension/image_11.png %}){: .center-image }


Consideraciones a tener en cuenta:

- El "Deployment Target" debe de ser el mismo en nuestra aplicación y en nuestra "Share Extension".
- De cara a subir un binario al `AppStore`, el `Version` y el `Build` de nuestra extensión deben coincidir con el `Version` y el `Build` de la aplicación de la siguiente forma: el bundle version de la extensión debe ser igual al build de nuestra aplicación, y el bundle version string, short igual al Version de nuestra aplicación.
- Es muy fácil olvidarse de habilitar "App Groups", ¿seguro que lo has revisado?
- Debido a la inestabilidad de XCode (9) es fácil que tengas algún tipo de conflicto mientras preparas tu extensión. Un "Clean" + "Build" te harán la vida mucho más fácil.
- Si realmente lo necesitas, desde tu extensión puedes lanzar tu aplicación mediante [el uso de URL Schemes][enlaceUno].
- Las "UserDefaults" no se comparten entre tu aplicación y tu extensión, para ello puedes usar las UserDefaults de Grupos tal que así:

{% highlight ruby %}

var defaults = NSUserDefaults(suiteName: "group.com.oscargarrucho.shareextensions")
defaults.setObject(“April”, forKey: “monthSelected”)
defaults.synchronize()

{% endhighlight %}

{% highlight ruby %}
var defaults = NSUserDefaults(suiteName: “group.com.oscargarrucho.shareextensions”)
defaults.objectForKey(“monthSelected”)

{% endhighlight %}

- Las imágenes que añadas a tus Assets no se cargarán por defecto en tus extensiones. Debes de habilitar el "Target Membership" por cada imagen

![ShareExtension10]({% link images/shareextension/image_08.png %}){: .center-image }

Puedes descargar el proyecto completo desde [mi repositorio de GitHub][enlaceProyecto]

Happy coding! :)


Bibliografía:

-- [https://www.appcoda.com/ios-8-action-extensions-tutorial][enlaceDos]

-- [http://blog.intrepid.io/ios-app-extensions][enlaceTres]

-- [https://developer.apple.com/app-extensions][enlaceCuatro]


[enlaceUno]: https://www.appcoda.com/working-url-schemes-ios
[enlaceDos]: https://www.appcoda.com/ios-8-action-extensions-tutorial
[enlaceTres]: http://blog.intrepid.io/ios-app-extensions
[enlaceCuatro]: https://developer.apple.com/app-extensions
[enlaceProyecto]: https://github.com/oskarko/ShareExtensionExample
