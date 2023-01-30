import { Component, Input, OnInit } from '@angular/core';
import { GameInterface } from 'src/app/models/models';

@Component({
  selector: 'app-game-tabs',
  templateUrl: './game-tabs.component.html',
  styleUrls: ['./game-tabs.component.scss'],
})
export class GameTabsComponent implements OnInit {
  @Input() game: GameInterface;
  constructor() {}

  ngOnInit(): void {}
}
