/*
  Copyright 2020-2021 Lowdefy, Inc

  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
*/

// import { NodeParser } from '@lowdefy/operators';

// import { RequestError } from '../../context/errors.js';

// async function evaluateOperators({ secrets, user }, { connectionConfig, payload, requestConfig }) {
//   const operatorsParser = new NodeParser({
//     payload,
//     secrets,
//     user,
//   });
//   await operatorsParser.init();
//   const { output: connectionProperties, errors: connectionErrors } = operatorsParser.parse({
//     input: connectionConfig.properties || {},
//     location: connectionConfig.connectionId,
//   });
//   if (connectionErrors.length > 0) {
//     throw new RequestError(connectionErrors[0]);
//   }

//   const { output: requestProperties, errors: requestErrors } = operatorsParser.parse({
//     input: requestConfig.properties || {},
//     location: requestConfig.requestId,
//   });
//   if (requestErrors.length > 0) {
//     throw new RequestError(requestErrors[0]);
//   }

//   return {
//     connectionProperties,
//     requestProperties,
//   };
// }

async function evaluateOperators({ secrets, user }, { connectionConfig, payload, requestConfig }) {
  return {
    connectionProperties: connectionConfig.properties || {},
    requestProperties: requestConfig.properties || {},
  };
}

export default evaluateOperators;
