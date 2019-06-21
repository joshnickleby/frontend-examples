
# Overview

I wanted to make Angular testing easier and learn how to mock objects similar to
Java + Mockito.

[CharacterSheetServiceTest](https://github.com/joshnickleby/angular-examples/blob/master/src/app/testing/personal/services/character-sheet.service.spec.ts)
[CharacterSheetDashboardComponentTest](https://github.com/joshnickleby/angular-examples/blob/master/src/app/testing/personal/components/character-sheet-dashboard/character-sheet-dashboard.component.spec.ts)

# Reasoning

## Service Test

### HTTP Class

[CharacterSheetHttp](https://github.com/joshnickleby/angular-examples/blob/master/src/app/testing/personal/services/character-sheet.http.ts)

File format: `<class-name>.http.ts`

Class format: `<ClassName>Http`

Handles all of the http calls. Able to switch out different clients if preferred.
It also allows you to mock the client easier or create classes around it.

### Service Class

[CharacterService](https://github.com/joshnickleby/angular-examples/blob/master/src/app/testing/personal/services/character-sheet.service.ts)

File format: `<class-name>.service.ts`

Class format: `<ClassName>Service`

I like to use `BehaviorSubject` instead of returning an `Observable`. I make public
accessible variables so that there is a centralized location for the data that
the components can access. Reduces subscribers and code in the components.

I created a few wrapper `BehaviorSubject` extended classes that you can find here:

[ListBehaviorSubject](https://github.com/joshnickleby/angular-examples/blob/master/src/app/common/list-behavior-subject.ts)

[SingleObjectList](https://github.com/joshnickleby/angular-examples/blob/master/src/app/common/single-object-list.ts)

### Service Test Helper

[ServiceTestHelper](https://github.com/joshnickleby/angular-examples/blob/master/src/app/common/service-test.helper.ts)

Used to setup the test environment (shown in the service test)

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

### Test List Assertion Helper

[TestListAssertionHelper](https://github.com/joshnickleby/angular-examples/blob/master/src/app/common/test-list-assertion.helper.ts)

Useful for providing an expected list and the test result list for
comparing values within the object. Currently setup for lists that
match in exact order.

## Component/View Test

### Component Class

I try to keep as little of the logic in this as possible. Mainly just the `ngOnInit` call to populate the list to reduce the
calls and have it specific to this component.

If I have some specific logic for this component I will make functions for it; otherwise I will try to keep it as simple as possible.

### Component View

For any table/list view I use the `*ngFor` format. Using the the variables in the service allow me to call the variable directly.

eg. `... *ngFor="let item of itemService.list$ | async" ...`

For the selected item and new item I use as special `BehaviorSubject` wrapper class. A little hack that allows me to make a single
object into a variable for use on the frontend. It requires that only ONE object exist in it otherwise the view will break.

Due to these single objects actually existing in a list I have used `class` for identification instead of `id` as attribute tags.
