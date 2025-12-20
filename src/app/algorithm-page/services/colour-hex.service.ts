import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ColourHexService {
  private readonly colourMap = new Map<string, string>([
    ['black', '#000000'],
    ['green', '#53D26F'],
    ['orange', '#FF6332'],
    ['purple', '#CA32FF'],
    ['red', '#EB2A2A'],
  ]);

  public getHex(colour: string): string {
    return this.colourMap.get(colour);
  }
}
