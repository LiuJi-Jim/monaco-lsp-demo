/* --------------------------------------------------------------------------------------------
 * Copyright (c) 2018-2022 TypeFox GmbH (http://www.typefox.io). All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
import { resolve } from 'path';
import { runSqlServer } from './main.js';
import { getLocalDirectory } from './fs-utils.js';

const baseDir = resolve(getLocalDirectory(import.meta.url));
const relativeDir = '../dist/sql-server.js';
runSqlServer(baseDir, relativeDir);
