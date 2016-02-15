/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
'use strict';

import * as path from 'path';

import { workspace, Disposable, ExtensionContext } from 'vscode';
import { LanguageClient, LanguageClientOptions, SettingMonitor, ServerOptions, TransportKind } from 'vscode-languageclient';

export function activate(context: ExtensionContext) {

  let serverModule = context.asAbsolutePath(path.join('server', 'server.js'));
  let debugOptions = { execArgv: ["--nolazy", "--debug=6004"] };
  
  let serverOptions: ServerOptions = {
    run : { module: serverModule, transport: TransportKind.ipc },
    debug: { module: serverModule, transport: TransportKind.ipc, options: debugOptions }
  }
  
  let clientOptions: LanguageClientOptions = {
    documentSelector: ['coffeescript'],
    synchronize: {
      configurationSection: 'coffeelint',
      fileEvents: workspace.createFileSystemWatcher('**/coffeelint.json')
    }
  }
  
  let client = new LanguageClient('CoffeeLint Server', serverOptions, clientOptions);
  context.subscriptions.push(new SettingMonitor(client, 'coffeelint.enable').start());
}
