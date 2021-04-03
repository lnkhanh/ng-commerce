// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import { environment } from './environment.base';

environment.adminUrl = 'http://api.ng-commerce.local/api/admin/v1';

environment.version = '0.0.1';
environment.buildVersion = '0000001';
environment.buildDate = '02/02/2021'; // mm/dd/yyyy

export { environment };

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
