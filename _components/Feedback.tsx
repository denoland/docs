export default function Feedback({ file }) {
  if (!file) {
    return <></>;
  } else {
    const githubPath = "https://github.com/denoland/docs/edit/main" + file;
    return (
      <section class="flex flex-col mt-12 gap-2 p-4 border border-blue-100
      dark:border-background-tertiary bg-blue-50 dark:bg-background-secondary
      rounded max-w-[66ch] mx-auto">
        <h2 class="text-xl border-b border-blue-100 dark:border-background-tertiary
        mb-2 pb-2 font-normal">
          Did you find what you needed?
        </h2>
        <div class="flex flex-col sm:flex-row sm:flex-wrap gap-8">
          <div class="flex-1">
            <form aria-live="polite" id="feedback-form">
              <div
                id="feedback-form__content"
                aria-labelledby="feedback-title"
                class="grid grid-cols-1 transition-all duration-300 grid-rows-[max-content_0fr] w-full items-start gap-2 overflow-hidden"
              >
                <div className="flex flex-wrap gap-2 items-center">
                  <input
                    class="sr-only"
                    id="feedback-yes"
                    type="radio"
                    name="feedback-vote"
                    aria-label="Yes"
                    value="yes"
                    required={true}
                  />
                  <label class="btn" for="feedback-yes">
                    Yes
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
                  </label>
                  <input
                    class="sr-only"
                    id="feedback-no"
                    type="radio"
                    name="feedback-vote"
                    aria-label="No"
                    value="no"
                    required={true}
                  />
                  <label class="btn" for="feedback-no">
                    No
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
                  </label>
                  <a
                    class="btn"
                    target="_blank"
                    href={githubPath}
                  >
                    Edit this page

                    <svg
                      width="98"
                      height="96"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                      focusable="false"
                      fill="currentColor"
                      style="display:inline-block;user-select:none;vertical-align:text-bottom;"
                      viewBox="0 0 98 96"
                    >
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M48.854 0C21.839 0 0 22 0 49.217c0 21.756 13.993 40.172 33.405 46.69 2.427.49 3.316-1.059 3.316-2.362 0-1.141-.08-5.052-.08-9.127-13.59 2.934-16.42-5.867-16.42-5.867-2.184-5.704-5.42-7.17-5.42-7.17-4.448-3.015.324-3.015.324-3.015 4.934.326 7.523 5.052 7.523 5.052 4.367 7.496 11.404 5.378 14.235 4.074.404-3.178 1.699-5.378 3.074-6.6-10.839-1.141-22.243-5.378-22.243-24.283 0-5.378 1.94-9.778 5.014-13.2-.485-1.222-2.184-6.275.486-13.038 0 0 4.125-1.304 13.426 5.052a46.97 46.97 0 0 1 12.214-1.63c4.125 0 8.33.571 12.213 1.63 9.302-6.356 13.427-5.052 13.427-5.052 2.67 6.763.97 11.816.485 13.038 3.155 3.422 5.015 7.822 5.015 13.2 0 18.905-11.404 23.06-22.324 24.283 1.78 1.548 3.316 4.481 3.316 9.126 0 6.6-.08 11.897-.08 13.526 0 1.304.89 2.853 3.316 2.364 19.412-6.52 33.405-24.935 33.405-46.691C97.707 22 75.788 0 48.854 0z"
                        fill="currentColor"
                      />
                    </svg>
                  </a>
                </div>
                <div
                  id="feedback-more"
                  class="hidden w-full overflow-hidden"
                >
                  <p class="font-semibold !my-2">
                    Thank you! Feedback received.{" "}
                    <span aria-hidden="true">✅</span>
                  </p>
                  <div class="space-y-1">
                    <label for="feedback-comment">
                      Any additional comments? (optional)
                    </label>
                    <textarea
                      class="block w-full p-2 border border-foreground-tertiary dark:bg-background-primary rounded"
                      name="feedback-comment"
                      id="feedback-comment"
                    >
                    </textarea>
                  </div>
                  <div class="space-y-1">
                    <label for="feedback-contact">
                      Email address (optional)
                    </label>
                    <input
                      type="email"
                      class="block w-full p-2 border border-foreground-tertiary dark:bg-background-primary rounded"
                      name="feedback-contact"
                      id="feedback-contact"
                      aria-invalid="false"
                      value=""
                    />
                  </div>
                  <button
                    type="submit"
                    class="btn bg-green-400 dark:bg-green-600 mt-4"
                  >
                    Send additional feedback
                  </button>
                </div>
              </div>
              <a
                rel=""
                class="mt-4 !underline underline-offset-2 text-xs block"
                target="_blank"
                href="/deploy/manual/privacy-policy"
              >
                Privacy policy
              </a>
            </form>
          </div>
        </div>
      </section>
    );
  }
}
