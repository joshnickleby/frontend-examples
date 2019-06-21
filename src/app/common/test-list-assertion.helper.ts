/**
 * Takes in an expected list and actual for doing comparisons
 * of the lists.
 */
export class TestListAssertionHelper {

  static create(expectedList: any[], actualList: any[]) {
    return new TestListAssertionHelper(expectedList, actualList);
  }

  constructor(
    public expectedList: any[] = [],
    public actualList: any[] = []
  ) {}

  // iterates simultaneously through the lists and checks they have matching values. Reduces it all to a single boolean
  testSameValues(key: string): boolean {
    return Array.from(Array(this.expectedList.length).keys())
      .map(i => this.expectedList[i][key] === this.actualList[i][key])
      .reduce((p, q) => p && q);
  }

  // iterates simultaneously through the lists and checks they have matching values based on input value. Reduces it all to a single boolean
  testSameValuesCustom(key: string, values: any[]): boolean {
    return values.length === this.actualList.length &&
      Array.from(Array(this.actualList.length).keys())
        .map(i => values[i] === this.actualList[i][key])
        .reduce((p, q) => p && q);
  }

  testSameLength(): boolean {
    return this.expectedList.length === this.actualList.length;
  }
}
