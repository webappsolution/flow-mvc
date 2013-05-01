# [WASI's](http://www.webappsolution.com) FlowMVC

A reference architecture and MVC extensions for developers using Sencha ExtJS or Touch with DeftJS. Take what you already 
know and go with it...just code with the Flow.

FlowMVC builds on the work of [DeftJS](https://github.com/deftjs/), [Sencha ExtJS](http://www.sencha.com/products/extjs), 
and [Sencha Touch](http://www.sencha.com/products/touch) APIs adding extensions that enable Flex and ActionScript 
developers to take their expertise and apply them to the HTML5/JavaScript world. It's a framework that users of Flex 
MVC-based architectures, such as Swiz or Parsley, will be familiar with. FlowMVC can help anyone, but Flex developers 
will find it particularly familiar.

In addition, for enterprises looking to leverage intellectual capital across platforms with Sencha ExtJS or Sencha Touch,
it provides an application structure with reusability and portability in mind encouraging the re-use of application and 
business logic.

For enterprises struggling with the myriad of choices available, FlowMVC and the tools used in the [Cafe Townsend Demo Project](https://github.com/WebAppSolutionInc/sencha-cafe-townsend),
provide a level of security for enterprise architects and managers that their goals, such as well defined project 
structure, documentation, testability, localization, and re-use of resources, both human and IC, are met.

**FlowMVC works with ExtJS version 4.1 and up, Sencha Touch version 2.0 and up, and DeftJS version 0.8.0 and up.**

## Highlights

* FlowMVC uses a Global Event Bus for loosely coupled object communication.
* FlowMVC separates View Controllers from Service Controllers -- we strictly separate Mediators (that own views) from Service Controllers (that own services). Controllers "control flow" of the app -- they orchestrate the app flow with events. They do not control views and work with services at the same time.
* FlowMVC has Service Objects separating server side logic into it's own layer.
* FlowMVC has Mock Service Objects with delays built-in for async service stubbing.
* FlowMVC looks and feels like a robust OO client using traditional MVC architecture and IoC frameworks.
* FlowMVC has an awesome logger!

## Documentation Overview

Full documentation on the features and usage of DeftJS is available in the [Wiki](https://github.com/WebAppSolutionInc/flow-mvc/wiki).

*  [Consistent Project Structure](https://github.com/WebAppSolutionInc/flow-mvc/wiki/Consistent-Project-Structure)
*  [Model-View-Controller-Service Architecture](https://github.com/WebAppSolutionInc/flow-mvc/wiki/MVCS-Architecture)
*  [Dependency Injection](https://github.com/WebAppSolutionInc/flow-mvc/wiki/Dependency-Injection)
*  [Event Bus](https://github.com/WebAppSolutionInc/flow-mvc/wiki/Event-Bus)
*  [HTTP Data Services and Mocks](https://github.com/WebAppSolutionInc/flow-mvc/wiki/Data-Services-And-Mocks)
*  [Implementation of Passive View using Mediators](https://github.com/WebAppSolutionInc/flow-mvc/wiki/Passive-View-And-Mediators)
*  [Jasmine Unit Tests for both functional and asynchronous code blocks](https://github.com/WebAppSolutionInc/flow-mvc/wiki/Running-Unit-Tests)
*  [Reuse of code between ExtJS and Touch versions](https://github.com/WebAppSolutionInc/flow-mvc/wiki/Reusing-Sencha-Code)
*  [FlowMVC API Docs](http://webappsolutioninc.github.io/flow-mvc/docs/)
*  [Resources](https://github.com/WebAppSolutionInc/flow-mvc/wiki/Resources)
*  [License: GNU General Public License](http://webappsolutioninc.github.io/flow-mvc/LICENSE)

## Examples

* [Cafe Townsend Demo Project](https://github.com/WebAppSolutionInc/sencha-cafe-townsend) - A HTML5 implementation 
using Sencha ExtJS, Sencha Touch, DeftJS, and FlowMVC.

## Pending Features

This effort is still ongoing with some in-progress work that will provide the following features:

*  Unit Tests with Jasmine - (In Progress @ 60%)

FlowMVC is currently considered an Alpha release, so help us make it better by adding to the [Issues Page](https://github.com/WebAppSolutionInc/flow-mvc/issues) where 
necessary. Please free to reach out to us and lets us know what you like, love, hate, feature requests, defects, 
etc on the [Issues Page](https://github.com/WebAppSolutionInc/flow-mvc/issues).

