import { Injectable } from '@angular/core';
import { ColourHexService } from '../colour-hex.service';
import { Position } from 'src/app/utils/position';

interface TextRenderState {
  colour: string;
  pos: Position;
}

@Injectable({
  providedIn: 'root',
})
export class TextRendererService {
  // start and end of supported chars, not inc. specials
  private readonly startChar = 32;
  private readonly endChar = 256;
  private readonly supportedSpecialChars = '{}\n';

  private font = 'Arial';
  private charSizes: number[] = [];
  private fontSize?: number;

  private ctx?: CanvasRenderingContext2D;

  constructor(public colourHexService: ColourHexService) {}

  public setFontSize(fontSize: number): void {
    if (!this.ctx) return;

    this.ctx.font = `${fontSize}px ${this.font}`;
    this.fontSize = fontSize;
    // precompute width ratios
    for (let i = this.startChar; i < this.endChar; i++) {
      const char = String.fromCharCode(i);
      this.charSizes[i - this.startChar] =
        this.ctx.measureText(char).width / fontSize;
    }
  }

  public setContext(ctx: CanvasRenderingContext2D): void {
    this.ctx = ctx;
    this.ctx.font = this.font;
  }

  private renderTextSegment(text: string, state: TextRenderState): void {
    this.ctx.save();
    this.ctx.fillStyle = state.colour;
    this.ctx.translate(state.pos.x, state.pos.y);
    this.ctx.fillText(text, 0, 0);
    this.ctx.restore();
  }

  // FROM: https://stackoverflow.com/questions/43904201/how-can-i-colour-different-words-in-the-same-line-with-html5-canvas
  // adapted for use in this project
  private drawTextFromState(text: string, state: TextRenderState): void {
    if (!this.ctx) throw new Error('Context not provided.');

    const xStart = state.pos.x;
    const colourStack: string[] = [];
    let subText = '';
    let width = 0;

    for (let i = 0; i < text.length; i++) {
      const ch = text[i];
      const charCode = text.charCodeAt(i);

      // we don't support it, skip
      if (
        !this.supportedSpecialChars.includes(ch) &&
        (charCode < this.startChar || charCode >= this.endChar)
      )
        continue;

      if (!this.supportedSpecialChars.includes(ch)) {
        subText += ch;
        width += this.charSizes[charCode - this.startChar] * this.fontSize;
      } else {
        if (subText.length > 0) {
          this.renderTextSegment(subText, state);
          state.pos.x += width;
          subText = '';
          width = 0;
        }

        switch (ch) {
          case '\n':
            state.pos.x = xStart;
            state.pos.y += this.fontSize;
            break;

          case '{':
            colourStack.push(state.colour);
            if (text[i + 1] === '#') {
              const hexCandidate = text.substring(i + 1, i + 8);
              if (/^#[0-9A-Fa-f]{6}$/.test(hexCandidate)) {
                state.colour = hexCandidate;
                i += 7;
              }
            }
            break;

          case '}':
            const prevColour = colourStack.pop();
            if (prevColour) state.colour = prevColour;
            break;
        }
      }
    }

    if (subText.length > 0) {
      this.renderTextSegment(subText, state);
    }
  }

  public drawText(text: string, pos: Position, colour: string = 'black'): void {
    // fallback prevents crashes from invalid caller input
    const fontColour = this.colourHexService.getHex(colour) || '#000000';
    const newRenderState = { colour: fontColour, pos: pos };
    this.drawTextFromState(text, newRenderState);
  }
}
