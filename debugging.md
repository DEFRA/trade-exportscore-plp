# Debugging

## Where not to try debugging your Unit tests

Whilst development is conducted in WSL2 via VS Code, try as I might, I cannot get any of the debugging options to work there. Believe me, I have tried everything and googled / binged the issue to the point of losing my sanity...

## Where to debug your Unit tests

You may have guessed that if you cannot debug in WSL2, the only choice is locally and, if you did, you are correct. For reason(s) unknown to me, the same launch.json file will work correctly in _normal_ VS Code but reports random, seemingly impossible, errors in WSL2. So, in summary, please clone the repository in your normal instance of VS Code to follow the steps below.

### How to run the tests within the current file

The first step to run your tests from the current file is to ensure the current file is the test file and not the production code. I know, sounds obvious, but as the test files and production code files are almost the same name, it is easy to make the mistake... I certainly have!

Once in the appropriate file, select the Run / Debug menu from the left-side of VS Code:

![VS Code Run / Debug Menu](./readme-images/Screenshot%202024-07-24%20155459.png "VS Code Run / Debug Menu")

At the time of writing, my version looked as below but yours may be slightly different. If the "Current Jest File" is not the selected profile, please change it manually.

![VS Code Run / Debug Screen](./readme-images/Screenshot%202024-07-24%20160334.png "VS Code Run / Debug Screen")

As you can see, the panes are largely empty when a debug session is not running but, the bottom window shows a selection of breakpoints I've previously set in some of the test and production files. Whilst you must start the Jest debugging session from the appropriate file, but there is no restriction on where you place a breakpoint 😊

By default, all of the describes and the tests within the describes that are contained in the test file will be run. This may well be OK when you are starting a new test file, but can get frustrating if you're debugging existing code or simply have a lot of tests in the file. There is a simple solution though... phew! 😮‍💨

It is likely that any test file you open will have describe and test sections similar to the example below:

![Normal Test File](./readme-images/Screenshot%202024-07-24%20161145.png "Normal Test File example")

However:

![Modified Test File](./readme-images/Screenshot%202024-07-24%20161129.png "Modified Test File example")

Yep, if you simply add `.only` immediately after the `describe` and the `test`, the Jest Test Runner will only run the one test from the specified describe, no matter how many describe sections you have defined or how many tests you have in your selected describe. Pretty cool, huh? It is actually even better! Whilst the word **only** strongly suggests you cannot use multiple times, you actually can! This means that if you want to debug more than 1 test during the same debugging session, you can. 😊 Personally, I rarely do debug more than 1 test but it is useful that you can if you have a scenario where you need / want to!
