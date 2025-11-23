import { Component, OnInit } from '@angular/core';
import { NgIf } from '@angular/common';

@Component({
  selector: 'algorithm-navbar',
  templateUrl: './algorithm-navbar.component.html',
  styleUrls: ['./algorithm-navbar.component.scss'],
  imports:[NgIf]
})
export class AlgorithmNavbarComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
