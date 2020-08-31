---
title:  "Adding Share Extensions with Swift"
date:   2018-03-21 16:04:22
categories: [iOS, Swift]
layout: post
tags: [iOS, Swift]
comments: True
---
If your app uses a certain type of file, such as images, PDF or just files in general, for internal use or as part of a functionality, then you will definitely  need to use extensions in your application to take it to the next level. But what are extensions in iOS?

With the arrival of iOS 8, Apple introduced the well-known [App Extensions][enlaceCuatro], a brand new way of interacting with other apps or systems without actually launching it. It makes us able to share files from one app to another, modify a file in a third app and obtain it back already modified in your application. These are some of the more significant examples of what you can do with the “App Extensions”. Although the very secure iOS architecture prevents the use of malicious codes from third-party applications, the use of extensions within our own apps can be the cause of a real headache. 

![ShareExtension01]({% link images/mr_T.gif %}){: .center-image }

The extensions are not separate applications in our app; they efficiently add extra functionality to our app and focus on a single task. 
The existing types of extensions are:
- `Today`: an extension that is displayed in the “today” view of the Notification Center that shows brief information and allows you to perform quick and easy tasks
- `Share`: an extension that allows your application to share (and receive) content with users on social networks and other similar sharing services
- `Action`: an extension that allows the creation of custom action buttons in a predefined view in order to allow users to view or transform content originating in a third application
- `Photo Editing`: an extension that allows users to edit a photo or video within the Photos application
- `Document Provider`: an extension used to allow other applications to access the documents managed by your application
- `Custom Keyboard`: an extension that replaces the system keyboard


![ShareExtension02]({% link images/shareextension/image_12.png %}){: .center-image }

In today’s example, we will learn how to create a ‘Share Extension’ to receive files from other applications to our own. First [we will create a test project][enlaceProyecto] where we will add a “table view” that shows the files in the internal folder on our application.

![ShareExtension03]({% link images/shareextension/image_01.png %}){: .center-image }

Now we need to add an extension to our project. To do this we go to “File >> New >> Target” and select “Share Extension”.

![ShareExtension04]({% link images/shareextension/image_02.png %}){: .center-image }

Give it a name that is easy recognizable from other applications:

![ShareExtension05]({% link images/shareextension/image_03.png %}){: .center-image }

You will be asked for your confirmation to activate the extension that you just created, click Yes (Activate).

![ShareExtension06]({% link images/shareextension/image_04.png %}){: .center-image }

You will see that “ShareViewController” class has appeared which inherits `NO` from UIViewController like this

{% gist 20468fba3b003f30717f6ae663c7bdfc %}

For practical reasons, we erase all this and create our own personalized “ShareViewController”. But before we can do that, we must first customize the Storyboard that is linked to this class. In this case, I have deleted almost all the default settings and I created it to my liking.

![ShareExtension07]({% link images/shareextension/image_05.png %}){: .center-image }

Once we have the visual display, it is time to add a code to our extension. First, we need to define what type of files we are going to accept in our application. So open the file “Info.plist” with the extension and replace this code:

{% gist f70bec06e33033e2c605827df08be114 %}

Which means that it accepts any file. But we don’t want it to accept every possible file, we only want PDF, docx, xlsx type files…. Replace the previous code with this one:

{% gist 3c7392a4aaa41f8d9e487dd8d58861da %}

Which means that it will accept files from a URL (e.g. Dropbox) or attachments in mail messages. Now I will go more into detail about the rest of the extension code. First you need to make it inherit UIViewController and add a “importFile” method that contains a code similar to the following:

{% gist 96246f70cecda563d35b5fdd5a94c4b4 %}

First, we need to identify what type of files we expect to find

{% highlight ruby %}

let identifier = kUTTypeContent as String

{% endhighlight %}

Using an ItemProvider, load the file that you have received in your “ShareExtension”. Copy it to the shared folder in your extension and your main application. Before launching the application, check the shared folder for the files you just imported. 
Once the file has been copied to said shared folder, you will get a UIAlertController that informs the user and closes the application.

{% gist 14e016f8f0efc120aafbb908c1801517 %}

Notice that in order to go back and leave the current ViewController, we do not use a `dismiss` as we normally do. Instead we use:

{% gist b75a6c80daae42569d5d34c2949e2dda %}

To close the ViewController of our extension. Weird huh? By slightly modifying the code we can download files from DropBox and import them into our application, very much in the same way we can take the files that we import from local files (such as attachments in Mail). [Take a look at our project to see how it’s done][enlaceProyecto]

![ShareExtension08]({% link images/matrix_01.gif %}){: .center-image }

We have to enable the groups between our application and our extension in order to share files between them. To do this, go to the ‘Capabilities’ tab and enable the “App Groups” option in both and create an “App Groups” (usually “group.”plus the same bundle that we use in the app). Once created, we must also add this to the extension. 

![ShareExtension09]({% link images/shareextension/image_06.png %}){: .center-image }

So that’s done, our app now has a “Share Extension” to import files. Now I will explain how to read the files from the ViewController of our app. 

{% gist 0c31b091b9469960b72395e876de6ac9 %}

ViewController has a “refresh” method to read the content of the shared folder with the extension. Copy them to the internal folder of the application. Once it’s copied correctly, you can delete this file in the shared folder, it no longer serves a purpose here.
After all this is done we use another method, in this case “getAllFiles()”, to read all the files in our internal folder and make them pop up in the tableview. How to do this is not within the objectives of this post. I skipped thi because I have talked about this in one of my previous posts. [Check out the example I am using on GitHub][enlaceProyecto]. The end result, should be something like this:

![ShareExtension11]({% link images/shareextension/image_11.png %}){: .center-image }


Keep in mind next considerations:

- The “Deployment Target” must be the same in our application and in our “Share Extension”
I- n order to upload a binary to the `AppStore`, the `Version` and `Build` of our Extension must match the `Version` and `Build` of the application; the bundle version of the extension must be equal to the build of our Application and the bundle version string must almost be equal to the version of our application.
- It is very easy to forget to enable “App Groups”, are you sure you checked it?
- Due to the instability of XCode (9), you easily get conflicts while you are preparing your extension. A “Clean” + “Build” will make your life easier.
- If necessary, you can launch your application from your extension by [using URL Schemes][enlaceUno]
- The “UserDefaults” are not shared between your application and your extension.  For this, you can use the UserDefaults of Groups so that:



{% gist f6186460b50f85355784dae724ffd000 %}

{% gist 55888264379aa21afbe57c69cd50e957 %}

- The images that you add to your Assets will not be loaded by default in your extensions. You must enable the “TargetMembership” for each image.

![ShareExtension10]({% link images/shareextension/image_08.png %}){: .center-image }


You can download the complete project [on my GitHub repository][enlaceProyecto].

Happy coding! ☺


Bibliography:

-- [https://www.appcoda.com/ios-8-action-extensions-tutorial][enlaceDos]

-- [http://blog.intrepid.io/ios-app-extensions][enlaceTres]

-- [https://developer.apple.com/app-extensions][enlaceCuatro]


[enlaceUno]: https://www.appcoda.com/working-url-schemes-ios
[enlaceDos]: https://www.appcoda.com/ios-8-action-extensions-tutorial
[enlaceTres]: http://blog.intrepid.io/ios-app-extensions
[enlaceCuatro]: https://developer.apple.com/app-extensions
[enlaceProyecto]: https://github.com/oskarko/ShareExtensionExample
