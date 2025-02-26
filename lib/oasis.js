import "rsvp" as RSVP;
import "oasis/logger" as Logger;
import { assert } from "oasis/util";
import "oasis/state" as State;
import { configuration, configure } from "oasis/config";
import "oasis/sandbox" as Sandbox;
import "oasis/sandbox_init" as initializeSandbox;

import "oasis/service" as Service;
import { registerHandler, connect, portFor } from "oasis/connect";

import "oasis/iframe_adapter" as iframeAdapter;
import "oasis/webworker_adapter" as webworkerAdapter;

var Oasis = {};

// Logger.enable();

Oasis.adapters = {
  iframe: iframeAdapter,
  webworker: webworkerAdapter
};


/**
  This is the entry point that allows the containing environment to create a
  child sandbox.

  Options:

  * `capabilities`: an array of registered services
  * `url`: a registered URL to a JavaScript file that will initialize the
    sandbox in the sandboxed environment
  * `adapter`: a reference to an adapter that will handle the lifecycle
    of the sandbox. Right now, there are iframe and web worker adapters.

  @param {Object} options
*/
Oasis.createSandbox = function(options) {
  return new Sandbox(options);
};

Oasis.Service = Oasis.Consumer = Service;

var packages = State.packages;
Oasis.reset = function() {
  State.reset();
  packages = State.packages;
  Oasis.consumers = State.consumers;
};
Oasis.reset();

Oasis.config = configuration;
Oasis.configure = configure;


/**
  This registers a sandbox type inside of the containing environment so that
  it can be referenced by URL in `createSandbox`.

  Options:

  * `capabilities`: An array of service names that will be supplied when calling
    `createSandbox`
  * `url`: The URL of the JavaScript file that contains the sandbox code

  @param {Object} options
*/
Oasis.register = function(options) {
  assert(options.capabilities, "You are trying to register a package without any capabilities. Please provide a list of requested capabilities, or an empty array ([]).");

  packages[options.url] = options;
};

Oasis.registerHandler = registerHandler;
Oasis.connect = connect;
Oasis.portFor = portFor;

// initializeSandbox will detect whether we are in a sandbox that needs
// initialization or not.
initializeSandbox();


Oasis.RSVP = RSVP;

export = Oasis;
