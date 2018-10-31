# Empathic agents: running example in JavaScript (Node.js)
**Author**: [Timotheus Kampik](https://github.com/TimKam)

This repository contains an example implementation of *empathic agents*--agents that use to make trade-offs between their own utility and the utility of other agents in their environment when deciding which actions they should execute--implemented in JavaScript (for Node.js).

## Empathic agents



## Architecture
The example is implemented in JavaScript for Node.js, as a web-socket based client-server application.
The agents are clients, while the server models the environment and manages agent communications:

* **Socket server:**

    The socket server

    * **Generic server module:**


    * **Environment specification:**

* **Agents**

    * **Generic agent module:**

    * **Specific agent specification:**

Currently, the application is limited to two agents.
The default scenario this project implements is a one-off vehicle coordination scenario (see below).
However, it is possible to adjust the agent and environment specification to run custom scenarios.

## Requirements
The examples are implemented in JavaScript and require [Node.js](https://nodejs.org/), version 10.11.0 or later, as well as [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com).
The instructions below assume Node.js and npm (or yarn, respectively) are installed.

## Installation
Clone this repository with ``git@github.com:TimKam/empathic-agents-js.git``.
Then, install the the dependencies with ``npm install`` or ``yarn``.

## Running the example
To run the example execute the ``index.js`` file in the project's root directory with ``node index.js``, ``npm run``, or ``yarn run``.

## Example scenario


## Acknowledgements
This work was partially supported by the Wallenberg AI, Autonomous Systems and Software Program (WASP) funded by the Knut and Alice Wallenberg Foundation.

## References
*   [1] T. Kampik, J. C. Nieves, and H. Lindgren, “Towards empathic autonomous agents,” in 6th International Workshop on Engineering Multi-Agent Systems (EMAS 2018), Stockholm, 2018.
