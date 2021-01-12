/*
  Copyright 2020 Lowdefy, Inc

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

import { type } from '@lowdefy/helpers';

const useMethod = ({ location, meta, methodName, operator, params }) => {
  if (meta.named) {
    try {
      if (type.isArray(params)) {
        return meta.fn(...params);
      }
      if (type.isObject(params)) {
        return meta.fn(...meta.named.map((key) => params[key]));
      }
    } catch (e) {
      throw new Error(
        `Operator Error: ${operator}.${methodName} - ${
          e.message
        } Received: {"${operator}.${methodName}":${JSON.stringify(params)}} at ${location}.`
      );
    }
    throw new Error(
      `Operator Error: ${operator}.${methodName} takes an object or array as value input. Received: {"${operator}.${methodName}":${JSON.stringify(
        params
      )}} at ${location}.`
    );
  }
};

export default useMethod;
