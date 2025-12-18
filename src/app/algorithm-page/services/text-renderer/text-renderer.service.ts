import { Injectable } from '@angular/core';

interface TextRenderState {
  size: number;
  colour: string;
  x: number;
  y: number;
}

@Injectable({
  providedIn: 'root',
})
export class TextRendererService {
  // start and end of supported chars
  private readonly startChar = 32;
  private readonly endChar = 256;

  private readonly tabSpaces = 8;
  private readonly maxTabs = 100; // bigger than we need probably

  private font = '20px Arial';
  private sizes: Array<number> = [];
  private baseSize: number | undefined;
  private spaceSize = 0;
  private tabStops: number[] = [];

  private ctx?: CanvasRenderingContext2D;

  constructor() {
    for (let i = 0; i < this.maxTabs; i += this.tabSpaces) {
      this.tabStops.push(i);
    }
  }

  private extractFontSize(font: string): number {
    const size = font.match(/\d+/);
    return Number(size[0]);
  }

  setFont(font: string): void {
    this.font = font;
    if (this.ctx) {
      this.ctx.font = this.font;
    }
    this.baseSize = this.extractFontSize(this.font);
  }

  public setContext(ctx: CanvasRenderingContext2D): void {
    this.ctx = ctx;
    this.ctx.font = this.font;
    this.baseSize = this.extractFontSize(this.font);

    // best to precompute width ratios
    for (let i = this.startChar; i < this.endChar; i++) {
      const char = String.fromCharCode(i);
      this.sizes[i - this.startChar] =
        ctx.measureText(char).width / this.baseSize;
    }

    this.spaceSize = this.sizes[0];
  }

  private getNextTab(x: number): number {
    for (const t of this.tabStops) {
      const tabValue = t * this.tabSpaces * this.spaceSize;
      if (x < tabValue) {
        return tabValue;
      }
    }
    const last = this.tabStops[this.tabStops.length - 1];
    return last * this.tabSpaces * this.spaceSize;
  }

  private renderTextSegment(
    text: string,
    state: TextRenderState,
    scale: number
  ): void {
    this.ctx.save();
    this.ctx.fillStyle = state.colour;
    this.ctx.translate(state.x, state.y);
    this.ctx.scale(scale, scale);
    this.ctx.fillText(text, 0, 0);
    this.ctx.restore();
  }

  // FROM: https://stackoverflow.com/questions/43904201/how-can-i-colour-different-words-in-the-same-line-with-html5-canvas
  // adapted for use in this project
  public drawText(text: string, state: TextRenderState): void {
    if (!this.ctx) {
      throw new Error('Context not provided.');
    }

    const xStart = state.x;
    const scale = state.size / this.baseSize;
    const stack: TextRenderState[] = [];
    let subText = '';
    let width = 0;

    for (let i = 0; i < text.length; i++) {
      const ch = text[i];
      const charCode = text.charCodeAt(i);

      // we don't support it, skip
      if (charCode < this.startChar || charCode >= this.endChar) {
        continue;
      }

      if (!'{}\n\t'.includes(ch)) {
        subText += ch;
        width += this.sizes[charCode - this.startChar] * state.size;
      } else {
        if (subText.length > 0) {
          this.renderTextSegment(subText, state, scale);
          state.x += width;
          subText = '';
          width = 0;
        }

        switch (ch) {
          case '\n':
            state.x = xStart;
            state.y += state.size;
            break;

          case '\t':
            state.x = this.getNextTab(state.x - xStart) + xStart;
            break;

          case '{':
            stack.push({ ...state });
            i++;
            const next = text[i];
            if (next === '#') {
              const candidate = text.substring(i, i + 7);
              if (/^#[0-9A-Fa-f]{6}$/.test(candidate)) {
                state.colour = candidate;
                i += 6;
              }
            }
            break;

          case '}':
            const prev = stack.pop();
            if (prev) {
              Object.assign(state, prev);
            }
            break;
        }
      }
    }

    if (subText.length > 0) {
      this.renderTextSegment(subText, state, scale);
    }
  }
}
