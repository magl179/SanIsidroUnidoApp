**C:\ionicTest\SanIsidroApp\code\platforms\android\project.properties**
cordova.system.library.4=com.google.android.gms:play-services-auth:11.8.0
cordova.system.library.5=com.google.android.gms:play-services-identity:11.8.0

I have solved it by changing REVERSED_CLIENT_ID
if client id 123-xyz.apps.googleusercontent.com then you need to reverse it com.googleusercontent.apps.123-xyz

Example:
Client id in google develper tool is : 123-xyz.apps.googleusercontent.com
and command below is with reverse client id

cordova plugin add cordova-plugin-googleplus --save --variable REVERSED_CLIENT_ID=com.googleusercontent.apps.123-xyz