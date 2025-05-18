import 'dotenv/config';

export default {
  expo: {
    name: 'ZivoFrontend',
    slug: 'ZivoFrontend',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/images/icon.png',
    scheme: 'myapp',
    userInterfaceStyle: 'automatic',
    newArchEnabled: true,
    ios: {
      supportsTablet: true,
      config: {
        googleMapsApiKey: process.env.IOS_MAPS_API_KEY
      }
    },
    android: {
      package: 'com.elifep2.zivofrontend',
      adaptiveIcon: {
        foregroundImage: './assets/images/adaptive-icon.png',
        backgroundColor: '#ffffff',
      },
      config: {
        googleMaps: {
          apiKey: process.env.GOOGLE_MAPS_API_KEY
        }
      }
    },
    web: {
      bundler: 'metro',
      output: 'static',
      favicon: './assets/images/favicon.png',
    },
    plugins: [
      'expo-router',
      [
        'expo-splash-screen',
        {
          image: './assets/images/splash-icon.png',
          imageWidth: 200,
          resizeMode: 'contain',
          backgroundColor: '#ffffff',
        },
      ],
      'expo-localization',
    ],
    experiments: {
      typedRoutes: true,
    },
    extra: {
      apiUrl: process.env.API_URL,
      apiKey: process.env.GOOGLE_MAPS_API_KEY,
      googleMapsApiKey: process.env.IOS_MAPS_API_KEY,
      eas: {
        projectId: "c8e6ff60-4bea-4784-9bc9-513e0c7f51e6"
      }
    },
    updates: {
      url: "https://u.expo.dev/c8e6ff60-4bea-4784-9bc9-513e0c7f51e6"
    },
    runtimeVersion: {
      policy: "appVersion"
    }
  },
};
