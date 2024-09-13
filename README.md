# Authentication Frontend

## Install Node 20 lts

```
nvm install 20 --lts
nvm list (copy the 20 lts)
nvm use 20.x.x
```

## Run in dev

- npm run start

## Build to prod

- make sure that .env points to PROD
  NODE_ENV=production
  EXPO_PUBLIC_API_SERVER_URI=https://legacy-backend.xyz/legacy
- git commit/push
- npm run eas:preview
- get the link to the App in Builds at https://expo.dev/accounts
- in your android, download Expo go, and enter the link to the build, or use the QR code.

## Icons

- list of icons: [https://oblador.github.io/react-native-vector-icons/](https://oblador.github.io/react-native-vector-icons/)

## Troubleshooting

CommandError: No development build (com.fredaguiar.authenticatorfrontend) for this project is installed. Please make and install a development build on the device first

Solution:

- Android Studio / Virtual Device Manager / Wipe data / cold boot
- npm run adroid

---

"RNCAndroidDialogPicker" was not found in the UIManager

Solution:

- Android Studio / Virtual Device Manager / Wipe data / cold boot
- npm run android
- make sure that there is nothing broken in the code

---

.env file can't be read

- variable key must start with EXPO PUBLIC

---

AxiosError: Network Error

- do not use localhost in the android emulator
- maybe you deleted .env
- update the nodejs server ip address (ipconfig and .env)
- check if the NodeJS server has crashed (uncaught exception maybe?)
