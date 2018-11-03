# Empathic agents: running example in JavaScript (Node.js)
**Author**: [Timotheus Kampik](https://github.com/TimKam)

This repository contains an example implementation of *empathic agents*--agents that use to make trade-offs between their own utility and the utility of other agents in their environment when deciding which actions they should execute--implemented in JavaScript (for Node.js).

## Empathic agents
This repository is meant as supplementary material to a book chapter, in which we provide a detailed explanation of the empathic agent concept.
A colloquial description of some of the underlying concepts can be found in [this README](https://github.com/TimKam/empathic-jason/blob/master/README.md#empathic-agents).
 
## Architecture
The example is implemented in JavaScript for Node.js, as a web-socket based client-server application.
The agents are clients, while the server models the environment and manages agent communications:

*   **Socket server:**

    The socket server consists of a *generic server module* and a *environment specification* that describes a particular scenario.

    *   **Generic server module:**

        The generic server module provides the communication backbone for agent interaction, and also manages the share value system.


    *   **Environment specification:**

        The environment specification describes the world the agents "live" in, i.e. the shared value system the agents rely on.

*   **Agents**
    
    Each agent depends on the *generic agent module* and has its own *agent specification*.

    *   **Generic agent module:**

        The generic agent module provides the empathic agent algorithms to the agents.

    *   **Agent specification:**

        An agent specification defines an agent's utility function and registers the agents with the server.


Currently, the application is limited to two agents.
For this basic demonstrations, both socket server and clients run on the same machine.
The default scenario this project implements is a one-off vehicle coordination scenario (see below).
It is possible to adjust the agent and environment specification to run more advanced custom scenarios;
however, this scientific prototype takes some short cuts that make it infeasible for production use.

## Requirements
The examples are implemented in JavaScript and require [Node.js](https://nodejs.org/), version 10.11.0 or later, as well as [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com).
The instructions below assume Node.js and npm (or yarn, respectively) are installed.

## Installation
Clone this repository with ``git@github.com:TimKam/empathic-agents-js.git``.
Then, install program and its dependencies with ``npm install`` or ``yarn``.
You find an overview of the required npm packages that will be automatically installed in the [package.json](./package.json) file.

## Running the example
In this project, we provide the *vehicle* scenario of the corresponding research paper as a running example.
To run the example proceed as follows:

*   Navigate to the project's root directory and open three terminal windows.

*   In your first window, start the environment server by executing ``node ./src/server.js``.

*   In your second and and third window, start two agent by running ``node src/agent.js <scenarioType> <agentId> <agentType>``, with:

    *   ``<scenarioType>``: the scenario to be executed (either ``vehicles``, or ``music``);

    *   ``<agentId>``: the ID of the agent (either ``0`` or ``1``);

    *   ``<agentType>``: the type of the agent (either ``naive``, ``lazy``, or ``full``).

    For example, you could run ``node src/agent.js music 1 full`` in one window and ``node src/agent.js music 0 full`` in the other.

Note that you can adjust the example specification to run other 2-agent scenarios.

## Testing
The project contains a set of [Jasime](https://jasmine.github.io/2.0/node.html) tests.
To execute the tests, run ``npm test``.

## Generating JSDoc
The code of this project is documented with [JSDoc](http://usejsdoc.org/).
To generate the documentation, run ``npm run doc``.
You will find the generated documentation in the ``out`` directory.

## Acknowledgements
This work was partially supported by the Wallenberg AI, Autonomous Systems and Software Program (WASP) funded by the Knut and Alice Wallenberg Foundation.

<!--## References
*   [1] T. Kampik, J. C. Nieves, and H. Lindgren, “Towards empathic autonomous agents,” in 6th International Workshop on Engineering Multi-Agent Systems (EMAS 2018), Stockholm, 2018.-->
