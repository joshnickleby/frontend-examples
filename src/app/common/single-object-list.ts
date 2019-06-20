import {BehaviorSubject} from 'rxjs';

/**
 *  WARNING: May not fall into best practices.
 *
 *  A hack to use a *ngFor for a single object as a variable.
 *
 *  Used as:
 *      <div *ngFor="let obj of object$ | async">
 *        {{obj.firstValue}}
 *        {{obj.secondValue}}
 *      </div>
 *
 *  Instead of:
 *      <div>
 *        {{(object$ | async).firstValue}}
 *        {{(object$ | async).secondValue}}
 *      </div>
 */
export class SingleObjectList<T> extends BehaviorSubject<T[]> {

  static create<T>(item: T): SingleObjectList<T> {
    return new SingleObjectList(item);
  }

  constructor(item: T = null) {
    super(item === null ? [] : [item]);
  }

  change(item: T) {
    super.next([item]);
  }

  getItem(): T {
    const val = super.getValue();

    return val.length > 0 ? val[0] : null;
  }
}
