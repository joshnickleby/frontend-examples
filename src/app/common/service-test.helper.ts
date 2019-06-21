import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {getTestBed, TestBed} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';

/**
 *  A class that reduces redundancy for setting up service mocks.
 *
 *  serviceClass contains the service using the httpClass
 *  httpClass contains the HttpClient
 */
export class ServiceTestHelper<T> {

  public env: TestBed;
  public service: T;
  public httpSpy: any;
  public httpMock: HttpTestingController;

  // used in the spy creation
  constructor(
    public httpObjectName: string,
    public httpMethodNames: string[] = []) {}

  configureEnv(serviceClass, httpClass, spyCreatorFn, providers: any[] = [], imports: any[] = []) {
    // jasmine class cannot get called outside of test file - current work around
    const spy = spyCreatorFn(this.httpObjectName, this.httpMethodNames);

    spy.id = (Math.random() * 1000) + 1; // used for debugging and reference

    const existingImports = [HttpClientTestingModule, RouterTestingModule, ...imports];
    const existingProviders = [serviceClass, { provide: httpClass, useValue: spy }, ...providers];

    TestBed.configureTestingModule({
      imports: existingImports,
      providers: existingProviders
    });
    this.env = getTestBed();
    this.service = this.env.get(serviceClass);
    this.httpSpy = this.env.get(httpClass);
    this.httpMock = this.env.get(HttpTestingController);
  }
}
