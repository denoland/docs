/**
 * @title Create and dispatch custom events
 * @difficulty beginner
 * @tags cli, deploy, web
 * @run <url>
 * @resource {https://developer.mozilla.org/en-US/docs/Web/API/EventTarget} MDN: EventTarget
 * @resource {https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent} MDN: CustomEvent
 * @group Web Standard APIs
 *
 * EventTarget is the eventing system behind the DOM, and it works as a
 * base class for your own types. Subscribers attach with addEventListener
 * and you publish with dispatchEvent. CustomEvent carries a payload in
 * its detail property. This example builds a small music player on top
 * of it.
 */

// Extend EventTarget to give a class its own events. The play method
// dispatches a cancelable CustomEvent and respects the listeners' verdict.
class Player extends EventTarget {
  play(track: string): boolean {
    const event = new CustomEvent("play", {
      detail: { track },
      cancelable: true,
    });
    // dispatchEvent returns false if any listener called preventDefault
    // on a cancelable event, so the default action can be skipped.
    const allowed = this.dispatchEvent(event);
    if (allowed) console.log(`playing ${track}`); // playing intro.mp3 (and one line per later allowed call)
    return allowed;
  }
}

const player = new Player();

// A plain listener runs on every dispatch. The payload passed as detail
// when the event was created is available on the event object.
player.addEventListener("play", (event) => {
  const { track } = (event as CustomEvent<{ track: string }>).detail;
  console.log(`now playing: ${track}`); // now playing: intro.mp3 (and one line per later play call)
});

player.play("intro.mp3");

// The once option removes the listener automatically after the first
// call, so the second play below does not log "first play" again.
player.addEventListener("play", () => console.log("first play"), {
  once: true,
});

player.play("verse.mp3");
player.play("chorus.mp3");

// The signal option ties a listener to an AbortController. Aborting the
// controller removes the listener, which is easier than keeping the
// function reference around for removeEventListener.
const controller = new AbortController();
player.addEventListener("play", () => console.log("logging analytics"), {
  signal: controller.signal,
});

player.play("bridge.mp3");
controller.abort();
player.play("outro.mp3");

// A listener can veto the default action with preventDefault, because
// the event was created with cancelable set to true. dispatchEvent then
// returns false and play skips its default action.
player.addEventListener("play", (event) => event.preventDefault(), {
  once: true,
});

console.log(player.play("blocked.mp3")); // false
