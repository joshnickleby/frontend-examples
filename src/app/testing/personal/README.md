
# Reason

## HTTP Class

File format: `<class-name>.http.ts`

Class format: `<ClassName>Http`

Handles all of the http calls. Able to switch out different clients if preferred.
It also allows you to mock the client easier or create classes around it.

## Service Class

File format: `<class-name>.service.ts`

Class format: `<ClassName>Service`

I like to use `BehaviorSubject` instead of returning an `Observable`. I make public
accessible variables so that there is a centralized location for the data that
the components can access. Reduces subscribers and code in the components.

## Service Test Helper

Contains the following for reusing:

- TestBed
- Service
- HttpSpy for the service (see above HTTP format)
- HttpMock for testing http control

Instantiation of a `ServiceTestHelper` requires the name of the `HttpObject` and the methods to spy on.

eg. `TestHttp` with name of `'TestHttp'` and methods `['getStuff', 'saveStuff']`.

You may define this at the top level as a "static" variable. Using the `#configureEnv`
function you may, within the `beforeEach` body, call this to setup the environment.

This method requires the service class (`TestService`), the http class (`TestHttp`),
a spy creation function - currently required to provide 
`(httpObjectName, httpMethodNames) => jasmine.createSpyObject(httpObjectName, httpMethodNames)`
due to jasmine not allowing implementation outside of test class, and any additional
imports and providers.

Within the individual unit tests you may then reassign the mocking of a method
such as `env.httpSpy.getStuff.and.returnValue('hello')`. Which the service will
reference upon calling it.


## Test List Assertion Helper

Useful for providing an expected list and the test result list for
comparing values within the object. Currently setup for lists that
match in exact order.
