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

import { serializer } from '@lowdefy/helpers';

import authorizeRequest from './authorizeRequest';
import checkConnectionRead from './checkConnectionRead';
import checkConnectionWrite from './checkConnectionWrite';
import evaluateOperators from './evaluateOperators';
import getConnectionConfig from './getConnectionConfig';
import getConnectionHandler from './getConnectionHandler';
import getRequestConfig from './getRequestConfig';
import getRequestHandler from './getRequestHandler';

async function request(context, { pageId, payload, requestId }) {
  const { logger } = context;
  logger.debug({ route: 'request', params: { pageId, payload, requestId } }, 'Started request');
  const requestConfig = await getRequestConfig(context, { pageId, requestId });
  const connectionConfig = await getConnectionConfig(context, { pageId, requestId });
  authorizeRequest(context, { requestConfig });

  const connectionHandler = getConnectionHandler(context, { connectionConfig });
  const requestHandler = getRequestHandler(context, { connectionHandler, requestConfig });

  const { connectionProperties, requestProperties } = await evaluateOperators(context, {
    connectionConfig,
    payload: serializer.deserialize(payload),
    requestConfig,
  });

  checkConnectionRead({
    connectionId: request.connectionId,
    connectionProperties,
    checkRead: requestHandler.checkRead,
  });
  checkConnectionWrite({
    connectionId: request.connectionId,
    connectionProperties,
    checkWrite: requestHandler.checkWrite,
  });

  // try {
  //   validate({ schema: connectionDefinition.schema, data: connectionProperties });
  //   validate({ schema: requestDefinition.schema, data: requestProperties });
  // } catch (error) {
  //   throw new ConfigurationError(error.message);
  // }

  // const response = await this.callResolver({
  //   connectionProperties,
  //   requestProperties,
  //   resolver: requestDefinition.resolver,
  // });

  const response = null;

  return {
    id: request.id,
    success: true,
    type: request.type,
    response: serializer.serialize(response),
  };
}

export default request;
