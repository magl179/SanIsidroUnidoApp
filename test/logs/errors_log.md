
## Error con Google Login

Se debia a que no deben haber dos paquetes que usen dos diferentes versiones de los servicios de google, se arregla usando las mismas versiones: esto se observa en la ruta: **C:\ionicTest\SanIsidroApp\code\platforms\android\project.properties**
```xml
cordova.system.library.4=com.google.android.gms:play-services-auth:11.8.0
cordova.system.library.5=com.google.android.gms:play-services-identity:11.8.0
```

## Advertencia con el Plugin de Onesignal

**Mensaje**
> Configure project :app
> WARNING: The onesignal-gradle-plugin MUST be before com.android.application!
   Please put onesignal-gradle-plugin first OR update to com.android.tools.build:gradle:3.0.0 or newer

## Problema con la Geolocalización

El Problema es que el plugin de Geolocalización no puede detectar o ejecutar la función de obtener coordenadas si el GPS o los servicios de localización están desactivados, por lo que primero se debe verificar si se tiene permisos de localización, luego pedir activar el GPS y luego si obtener la localización

## Error ERR_CLEARTEXT_NOT_PERMITTED 

```bash
<access origin="*" />
<edit-config file="app/src/main/AndroidManifest.xml" mode="merge" target="/manifest/application" xmlns:android="http://schemas.android.com/apk/res/android">
    <application android:networkSecurityConfig="@xml/network_security_config" />
    <application android:usesCleartextTraffic="true" />
</edit-config>
<allow-navigation href="*"/>
```
Edit /resources/android/xml/network_security_config.xml

```bash
<?xml version="1.0" encoding="utf-8"?>
<network-security-config>
    <domain-config cleartextTrafficPermitted="true">
        <domain>localhost</domain>
        <domain>192.168.1.6</domain>
    </domain-config>
</network-security-config>
```