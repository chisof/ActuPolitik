#!/usr/bin/env bash
set -e

echo "🚀 Initialisation de l'environnement"
export ANDROID_SDK_ROOT=$HOME/android-sdk
export PATH=$PATH:$ANDROID_SDK_ROOT/cmdline-tools/latest/bin:$ANDROID_SDK_ROOT/platform-tools

# 1) Vérif et install de git, node, npm
command -v git  >/dev/null 2>&1 || pkg install -y git
command -v node >/dev/null 2>&1 || pkg install -y nodejs-lts
command -v npm  >/dev/null 2>&1 || pkg install -y npm

# 2) Clone ou update du repo
if [ ! -d "../ActuPolitik" ]; then
  git clone https://github.com/TonUtilisateur/ActuPolitik.git ../ActuPolitik
fi
cd ../ActuPolitik

# 3) Installation des modules
npm install

# 4) Setup Android SDK (licences + plateformes)
yes | sdkmanager --licenses
sdkmanager "platform-tools" "platforms;android-33" "build-tools;33.0.0"

# 5) Compilation APK release
cd android
./gradlew assembleRelease

APK="./app/build/outputs/apk/release/app-release.apk"
if [ -f "$APK" ]; then
  echo "✅ APK généré: $APK"
  command -v pm >/dev/null 2>&1 && pm install -r $APK
else
  echo "❌ Échec de la compilation"
  exit 1
fi

echo "🎉 Build terminé !" 
