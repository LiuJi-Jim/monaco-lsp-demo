/* --------------------------------------------------------------------------------------------
 * Copyright (c) 2018-2022 TypeFox GmbH (http://www.typefox.io). All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
import { WebSocketServer } from 'ws';
import { Server } from 'http';
import express from 'express';
import { upgradeWsServer } from './server-common.js';

export const runSqlServer = (baseDir: string, relativeDir: string) => {
  process.on('uncaughtException', function (err: any) {
    console.error('Uncaught Exception: ', err.toString());
    if (err.stack) {
      console.error(err.stack);
    }
  });

  // create the express application
  const app = express();
  // start the server
  const server: Server = app.listen(23333);
  // create the web socket
  const wss = new WebSocketServer({
    noServer: true,
    perMessageDeflate: false,
  });
  upgradeWsServer({
    serverName: 'SQL',
    pathName: '/helloServer',
    server,
    wss,
    baseDir,
    relativeDir,
  });
};
