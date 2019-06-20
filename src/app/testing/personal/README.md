
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
