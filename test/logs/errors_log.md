**C:\ionicTest\SanIsidroApp\code\platforms\android\project.properties**
cordova.system.library.4=com.google.android.gms:play-services-auth:11.8.0
cordova.system.library.5=com.google.android.gms:play-services-identity:11.8.0

I have solved it by changing REVERSED_CLIENT_ID
if client id 123-xyz.apps.googleusercontent.com then you need to reverse it com.googleusercontent.apps.123-xyz

Example:
Client id in google develper tool is : 123-xyz.apps.googleusercontent.com
and command below is with reverse client id

cordova plugin add cordova-plugin-googleplus --save --variable REVERSED_CLIENT_ID=com.googleusercontent.apps.123-xyz

Problema Popup fue con el google play services todos deben tener la versión 11.8.0

> Configure project :app
WARNING: The onesignal-gradle-plugin MUST be before com.android.application!
   Please put onesignal-gradle-plugin first OR update to com.android.tools.build:gradle:3.0.0 or newer

   Problem Like Geolocation function not executed is:
   **This plugin have a problem. It cannot detect whether gps or location service options are disabled. So, first of all, check if 'Access to my location' option is enabled in your phone. Then activate GPS option, and finally try with your app**