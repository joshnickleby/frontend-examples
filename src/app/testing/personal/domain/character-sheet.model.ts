import {FormControl, FormGroup, Validators} from '@angular/forms';

export class CharacterSheet {

  constructor(
    public name: string = '',
    public id?: number
  ) {}

  public form: FormGroup;

  static generateNewCharacterSheet() {
    const characterSheet = new CharacterSheet();
    characterSheet.generateFormGroup();
    return characterSheet;
  }

  public generateFormGroup() {
    this.form = new FormGroup({
      'name': new FormControl(
        this.name, [
          Validators.required,
          Validators.minLength(4)
        ]
      )
    });
  }

  public applyFormGroup() {
    this.name = this.form.get('name').value;

    this.form = null;
  }
}

export function generateNewCharacterSheetForm(): {sheet: CharacterSheet, form: FormGroup} {
  const sheet = new CharacterSheet();
  const form = new FormGroup({
    'name': new FormControl(
      sheet.name, [
        Validators.required,
        Validators.minLength(4)
      ]
    )
  });

  return {sheet, form};
}
