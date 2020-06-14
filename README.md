# Gekko [![npm](https://img.shields.io/npm/dm/gekko.svg)]() [![Build Status](https://travis-ci.org/askmike/gekko.png)](https://travis-ci.org/askmike/gekko) [![Build status](https://ci.appveyor.com/api/projects/status/github/askmike/gekko?branch=stable&svg=true)](https://ci.appveyor.com/project/askmike/gekko)

## Fork information
I created this fork to bring the gekko code base to the next level. I do this mostly, because I'm obsessed with clean code and I wanted to go through migrating a mid-size
code base to Typescript, just for the experience. Also, the original gekko repo is not maintained anymore, so this is probably a good time to drive it forward.

Goals of the fork are to increase developer experience and code safety of the project, this involves the following steps:
- Migrate gekko to typescript
  - Adding type safety to the code base
  - creating consistent interfaces that contributors can code with
- Refactor monolithic structure
  - Lots of complex modules are baked into the code base (example: src/exchanges, even with an own package.json)
  - imho exchanges and strategies should be installable via npm and gekko should only serve as a platform
  - This is probably the biggest and challenging chunk and the last step
- Move to ESNext
  - Get rid of legacy code, use es6/next code where possible
  - Reduce usage of lodash in favor of native JS (.map, .forEach, arrow functions etc.)
- Follow code style
  - Use Eslint (standard JS integrated for now)

I will always make sure to keep the fork backwards compatible, so nothing should really change along the way. If you notice any bugs or different behavior to the original,
open an issue

## Contribution
If you want to help me, PRs are always welcome. See CONTRIBUTING.md for more information.

## Description
![Gordon Gekko](http://mikevanrossum.nl/static/gekko.jpg)

*The most valuable commodity I know of is information.*

-Gordon Gekko

Gekko is a Bitcoin TA trading and backtesting platform that connects to popular Bitcoin exchanges. It is written in JavaScript and runs on [Node.js](http://nodejs.org).

*Use Gekko at your own risk.*

## Documentation

See [the documentation website](https://gekko.wizb.it/docs/introduction/about_gekko.html).

## Installation & Usage

See [the installing Gekko doc](https://gekko.wizb.it/docs/installation/installing_gekko.html).

## Community & Support

Gekko has [a forum](https://forum.gekko.wizb.it/) that is the place for discussions on using Gekko, automated trading and exchanges. In case you rather want to chat in realtime about Gekko feel free to join the [Gekko Support Discord](https://discord.gg/26wMygt).

## Final

If Gekko helped you in any way, you can always leave the original author a tip at (BTC) 13r1jyivitShUiv9FJvjLH7Nh1ZZptumwW

If you appreciate my refactoring efforts, you can buy me a coffee via (BTC) 3Mok7fMNUjF9vC5wvezZmrE73icSXG6rJ6
