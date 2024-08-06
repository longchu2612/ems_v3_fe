// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  // imageHost: 'https://ttd-api.onelink.co.th/',
  imageHost: 'https://qrpaybox.tomotek.vn/',    
  // host: 'http://150.95.113.52:8080/api/',
  host: 'https://sep490-g11-ems.pro.vn/api/',
  // host: 'http://192.168.0.245:8088/api/v1/', //HOANG
  // host: 'http://192.168.0.32:8088/api/v1/', // DUY
  // imageHost: 'http://202.129.205.221:4002/',
  //   host: 'https://api-qrpayv2.tomotek.vn/api/v1/',
  // host: 'http://18.136.23.114:5000/api/v1/',
  // https:ttd-api.onelink.co.th/api/v1/admin/auth/login
  defaultauth: 'fackbackend',
  firebaseConfig: {
    apiKey: '',
    authDomain: '',
    databaseURL: '',
    projectId: '',
    storageBucket: '',
    messagingSenderId: '',
    appId: '',
    measurementId: ''
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
