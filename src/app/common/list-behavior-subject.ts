import {BehaviorSubject} from 'rxjs';

/**
 * Wrapper class for a BehaviorSubject that contains a list
 */
export class ListBehaviorSubject<T> extends BehaviorSubject<T[]> {

  static create<T>(list = []) {
    return new ListBehaviorSubject<T>(list);
  }

  constructor(list: T[] = []) {
    super(list);
  }

  add(item: T) {
    this.shareUpdate((list: T[]) => list.push(item));
  }

  remove(item: T) {
    this.shareUpdate((list: T[]) => list.filter(t => t != item));
  }

  clear() { this.next([]); }

  private shareUpdate(updateFn) {
    const existing = this.getValue();
    updateFn(existing);
    this.next(existing);
  }
}
