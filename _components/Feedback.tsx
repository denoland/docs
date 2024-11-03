export default function Feedback(path) {
  if (!path) {
    return <></>;
  }

  const githubPath = "https://github.com/denoland/docs/edit/main" + path;
  return (
    <section class="mt-4 flex flex-wrap justify-between">
      <h2 class="w-full">Help us make these docs great!</h2>
      <form aria-live="polite" id="feedback-form">
        <h3 class="f4 mb-3">Did you find what you needed?</h3>
        <input type="text" name="feedback-token" value="" />
        <div role="radiogroup" aria-labelledby="feedback-title">
          <input
            class="hidden"
            id="feedback-yes"
            type="radio"
            name="feedback-vote"
            aria-label="Yes"
            value="yes"
          />
          <label class="btn mr-1" for="feedback-yes">
            <svg
              aria-hidden="true"
              focusable="false"
              class="color-fg-muted"
              viewBox="0 0 16 16"
              width="16"
              height="16"
              fill="currentColor"
              style="display:inline-block;user-select:none;vertical-align:text-bottom;"
            >
              <path d="M8.834.066c.763.087 1.5.295 2.01.884.505.581.656 1.378.656 2.3 0 .467-.087 1.119-.157 1.637L11.328 5h1.422c.603 0 1.174.085 1.668.333.508.254.911.679 1.137 1.2.453.998.438 2.447.188 4.316l-.04.306c-.105.79-.195 1.473-.313 2.033-.131.63-.315 1.209-.668 1.672C13.97 15.847 12.706 16 11 16c-1.848 0-3.234-.333-4.388-.653-.165-.045-.323-.09-.475-.133-.658-.186-1.2-.34-1.725-.415A1.75 1.75 0 0 1 2.75 16h-1A1.75 1.75 0 0 1 0 14.25v-7.5C0 5.784.784 5 1.75 5h1a1.75 1.75 0 0 1 1.514.872c.258-.105.59-.268.918-.508C5.853 4.874 6.5 4.079 6.5 2.75v-.5c0-1.202.994-2.337 2.334-2.184ZM4.5 13.3c.705.088 1.39.284 2.072.478l.441.125c1.096.305 2.334.598 3.987.598 1.794 0 2.28-.223 2.528-.549.147-.193.276-.505.394-1.07.105-.502.188-1.124.295-1.93l.04-.3c.25-1.882.189-2.933-.068-3.497a.921.921 0 0 0-.442-.48c-.208-.104-.52-.174-.997-.174H11c-.686 0-1.295-.577-1.206-1.336.023-.192.05-.39.076-.586.065-.488.13-.97.13-1.328 0-.809-.144-1.15-.288-1.316-.137-.158-.402-.304-1.048-.378C8.357 1.521 8 1.793 8 2.25v.5c0 1.922-.978 3.128-1.933 3.825a5.831 5.831 0 0 1-1.567.81ZM2.75 6.5h-1a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h1a.25.25 0 0 0 .25-.25v-7.5a.25.25 0 0 0-.25-.25Z">
              </path>
            </svg>
            Yes
          </label>
          <input
            class="hidden"
            id="feedback-no"
            type="radio"
            name="feedback-vote"
            aria-label="No"
            value="no"
          />
          <label class="btn" for="feedback-no">
            <svg
              aria-hidden="true"
              focusable="false"
              viewBox="0 0 16 16"
              width="16"
              height="16"
              fill="currentColor"
              style="display:inline-block;user-select:none;vertical-align:text-bottom;"
            >
              <path d="M7.083 15.986c-.763-.087-1.499-.295-2.011-.884-.504-.581-.655-1.378-.655-2.299 0-.468.087-1.12.157-1.638l.015-.112H3.167c-.603 0-1.174-.086-1.669-.334a2.415 2.415 0 0 1-1.136-1.2c-.454-.998-.438-2.447-.188-4.316l.04-.306C.32 4.108.41 3.424.526 2.864c.132-.63.316-1.209.669-1.672C1.947.205 3.211.053 4.917.053c1.848 0 3.234.332 4.388.652l.474.133c.658.187 1.201.341 1.726.415a1.75 1.75 0 0 1 1.662-1.2h1c.966 0 1.75.784 1.75 1.75v7.5a1.75 1.75 0 0 1-1.75 1.75h-1a1.75 1.75 0 0 1-1.514-.872c-.259.105-.59.268-.919.508-.671.491-1.317 1.285-1.317 2.614v.5c0 1.201-.994 2.336-2.334 2.183Zm4.334-13.232c-.706-.089-1.39-.284-2.072-.479l-.441-.125c-1.096-.304-2.335-.597-3.987-.597-1.794 0-2.28.222-2.529.548-.147.193-.275.505-.393 1.07-.105.502-.188 1.124-.295 1.93l-.04.3c-.25 1.882-.19 2.933.067 3.497a.923.923 0 0 0 .443.48c.208.104.52.175.997.175h1.75c.685 0 1.295.577 1.205 1.335-.022.192-.049.39-.075.586-.066.488-.13.97-.13 1.329 0 .808.144 1.15.288 1.316.137.157.401.303 1.048.377.307.035.664-.237.664-.693v-.5c0-1.922.978-3.127 1.932-3.825a5.878 5.878 0 0 1 1.568-.809Zm1.75 6.798h1a.25.25 0 0 0 .25-.25v-7.5a.25.25 0 0 0-.25-.25h-1a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25Z">
              </path>
            </svg>
            No
          </label>
          <div id="feedback-more" class="hidden">
            <p role="status">
              Thank you! We received your feedback.
            </p>
            <label for="feedback-comment">
              Can you tell us more about your rating? (Optional)
            </label>
            <textarea
              name="feedback-comment"
              id="feedback-comment"
            >
            </textarea>
            <label for="feedback-contact">
              Leave your email if we can contact you.(Optional)
            </label>
            <input
              type="email"
              name="feedback-contact"
              id="feedback-contact"
              aria-invalid="false"
              value=""
            />
            <p>
              If you need a reply, please contact{" "}
              <a href="https://support.github.com/">support</a>.
            </p>
            <div>
              <button type="button" class="btn">
                Cancel
              </button>
              <button type="submit" class="btn">
                Send
              </button>
            </div>
          </div>
          <a
            rel=""
            class="f6 text-underline"
            target="_blank"
            href="/en/site-policy/privacy-policies/github-privacy-statement"
          >
            Privacy policy
          </a>
        </div>
      </form>
      <div>
        <h3>Make a contribution</h3>
        <p class="max-w-xs color-fg-muted mb-3">
          Deno's docs are open source. See something that's wrong or unclear?
          Submit a pull request:
        </p>
        <a
          class="btn"
          target="_blank"
          href={githubPath}
        >
          <svg
            aria-hidden="true"
            focusable="false"
            viewBox="0 0 16 16"
            width="16"
            height="16"
            fill="currentColor"
            style="display:inline-block;user-select:none;vertical-align:text-bottom;"
          >
            <path d="M1.5 3.25a2.25 2.25 0 1 1 3 2.122v5.256a2.251 2.251 0 1 1-1.5 0V5.372A2.25 2.25 0 0 1 1.5 3.25Zm5.677-.177L9.573.677A.25.25 0 0 1 10 .854V2.5h1A2.5 2.5 0 0 1 13.5 5v5.628a2.251 2.251 0 1 1-1.5 0V5a1 1 0 0 0-1-1h-1v1.646a.25.25 0 0 1-.427.177L7.177 3.427a.25.25 0 0 1 0-.354ZM3.75 2.5a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5Zm0 9.5a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5Zm8.25.75a.75.75 0 1 0 1.5 0 .75.75 0 0 0-1.5 0Z">
            </path>
          </svg>
          Edit this page
        </a>
      </div>
    </section>
  );
}
