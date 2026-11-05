import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";
import "../GameModeSelector";
import "../SinglePlayerModal";

@customElement("play-page")
export class PlayPage extends LitElement {
  createRenderRoot() {
    return this;
  }

  render() {
    return html`
      <div
        id="page-play"
        class="flex min-h-dvh w-full flex-col items-center bg-black/20"
      >
        <game-mode-selector></game-mode-selector>
      </div>
    `;
  }
}
