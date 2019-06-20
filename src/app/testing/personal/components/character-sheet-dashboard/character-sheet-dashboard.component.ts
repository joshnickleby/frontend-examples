import { Component, OnInit } from '@angular/core';
import {CharacterSheetService} from '../../services/character-sheet.service';

@Component({
  selector: 'app-character-sheet-dashboard',
  templateUrl: './character-sheet-dashboard.component.html',
  styleUrls: ['./character-sheet-dashboard.component.css']
})
export class CharacterSheetDashboardComponent implements OnInit {

  constructor(public characterSheetService: CharacterSheetService) { }

  ngOnInit() {
    this.characterSheetService.getAllCharacterSheets();
  }

}
