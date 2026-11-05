import { GameType } from "@openfront/engine-api/game/GameTypes";
import { html, LitElement } from "lit";
import { customElement } from "lit/decorators.js";
import {
  multiplayerAllowed,
  multiplayerAllowedForSession,
  type DesktopSessionState,
  type DesktopUpdateState,
} from "./DesktopShell";
import { whenModalLoaded } from "./LazyModals";
import type { JoinLobbyEvent } from "./Main";
import type { SinglePlayerModal } from "./SinglePlayerModal";
import { translateText } from "./Utils";

/**
 * The standalone build has one game mode: a local match against bots.
 * These exports remain small and pure so older callers/tests can still ask
 * whether a join is local without bringing back any online UI.
 */
export function joinIsGateable(lobby: JoinLobbyEvent): boolean {
  return (
    lobby.gameStartInfo?.config.gameType !== GameType.Singleplayer &&
    lobby.gameRecord === undefined
  );
}

export function shouldBlockMultiplayerAction(
  update: DesktopUpdateState | null,
  session: DesktopSessionState | null,
  backendOutage: boolean,
): boolean {
  return (
    (update !== null && !multiplayerAllowed(update)) ||
    (session !== null && !multiplayerAllowedForSession(session)) ||
    !multiplayerAllowedForBackend(backendOutage)
  );
}

export function multiplayerAllowedForBackend(backendOutage: boolean): boolean {
  return !backendOutage;
}

export function shouldBlockSocketSourcedAction(
  update: DesktopUpdateState | null,
  session: DesktopSessionState | null,
): boolean {
  return shouldBlockMultiplayerAction(update, session, false);
}

export function reportMultiplayerRefusal(_backendOutage: boolean): void {}

export function shouldBlockJoin(
  lobby: JoinLobbyEvent,
  update: DesktopUpdateState | null,
  session: DesktopSessionState | null,
): boolean {
  return (
    joinIsGateable(lobby) && shouldBlockSocketSourcedAction(update, session)
  );
}

@customElement("game-mode-selector")
export class GameModeSelector extends LitElement {
  createRenderRoot() {
    return this;
  }

  public start(): void {}

  public stop(): void {}

  private openSinglePlayer = () => {
    whenModalLoaded("single-player-modal", () => {
      (
        document.querySelector("single-player-modal") as SinglePlayerModal
      )?.open();
    });
  };

  render() {
    return html`
      <section class="w-full max-w-5xl mx-auto px-4 py-8 sm:py-12">
        <div
          class="rounded-3xl border border-white/10 bg-surface/80 p-6 sm:p-10 text-center shadow-2xl"
        >
          <p
            class="text-xs font-bold uppercase tracking-[0.3em] text-malibu-blue"
          >
            ${translateText("main.solo")}
          </p>
          <h1
            class="mt-3 text-3xl sm:text-5xl font-black uppercase tracking-wide text-white"
          >
            ${translateText("main.play")}
          </h1>
          <p class="mx-auto mt-4 max-w-xl text-sm sm:text-base text-white/60">
            ${translateText("main.solo")}
          </p>
          <button
            type="button"
            class="mt-8 inline-flex min-w-56 items-center justify-center rounded-xl bg-malibu-blue px-8 py-4 text-sm font-black uppercase tracking-widest text-white transition hover:bg-aquarius active:scale-95"
            @click=${this.openSinglePlayer}
          >
            ${translateText("main.play")}
          </button>
        </div>
      </section>
    `;
  }
}
