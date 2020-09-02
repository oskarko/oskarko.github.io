---
title:  "Configuring UIScrollView with autolayout"
date:   2018-02-14 14:23:22
categories: [iOS, Swift]
layout: post
tags: [iOS, Swift]
comments: True
---
As an IOS developer I have seen my colleagues struggle with the use of scrollView more than once. From rather inelegant solutions to finishing touches with a low functionality and over one thousand and one solutions that I wouldn’t recommend either. In this short post I will show you how I do it, in a way that is simple and easy to understand. From here, you can make it as complex as you need.

As an example, we will first create a project:

![UIScrollView01]({% link images/UIScrollView01.png %}){: .center-image }

With the ViewController that we already have on our storyBoard, we will add a UIScrollView:

![UIScrollView02]({% link images/UIScrollView02.png %}){: .center-image }

We will use autolayout to adjust all the constraints to the top view:

![UIScrollView03]({% link images/UIScrollView03.png %}){: .center-image }

Now we will add a UIView (that we will call “Background View”) inside our scrollView. We must have our only ViewController as on the picture below:

![UIScrollView04]({% link images/UIScrollView04.png %}){: .center-image }

We will add constraints to this UIView (that we have previously named “Background View”) to completely adjust it to scrollView:

![UIScrollView05]({% link images/UIScrollView03.png %}){: .center-image }

** Very Important ** We will add a couple more constraints to our “Background View”: “Equal Heights” and “Equal Widths”, with the top UIView of our ViewController:

![UIScrollView06]({% link images/UIScrollView06.png %}){: .center-image }

And we must give a low priority (250)  to this equal height constraint that we just added:

![UIScrollView07]({% link images/UIScrollView07.png %}){: .center-image }

Ready! Now we can add as many elements inside our scrollView as we need. They will work as well with all the others. Do not forget to add constraints to each element you add inside scrollView in order to display them exactly how you want.

![UIScrollView08]({% link images/UIScrollView08.png %}){: .center-image }

If you have any further doubts, [here is an example that you can follow.][enlaceUno]

![UIScrollView09]({% link images/UIScrollView09.gif %}){: .center-image }

Happy coding! :heart:

[enlaceUno]: https://github.com/oskarko/UIScrollViewExample