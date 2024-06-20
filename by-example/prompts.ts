/**
 * @title Input Prompts
 * @difficulty beginner
 * @tags cli, web
 * @run <url>
 * @resource {https://developer.mozilla.org/en-US/docs/Web/API/Window/prompt} MDN: prompt
 * @resource {https://developer.mozilla.org/en-US/docs/Web/API/Window/alert} MDN: alert
 * @resource {https://developer.mozilla.org/en-US/docs/Web/API/Window/confirm} MDN: confirm
 * @group CLI
 *
 * Prompts are used to ask the user for input or feedback on actions.
 */

// The most basic way to interact with the user is by alerting them, and waiting
// for them to acknowledge by pressing [Enter].
alert("Please acknowledge the message.");
console.log("The message has been acknowledged.");

// Instead of just an acknowledgement, we can also ask the user for a yes/no
// response.
const shouldProceed = confirm("Do you want to proceed?");
console.log("Should proceed?", shouldProceed);

// We can also prompt the user for some text input. If the user cancels the
// prompt, the returned value will be `null`.
const name = prompt("Please enter your name:");
console.log("Name:", name);

// When prompting you can also specify a default value to use if the user
// cancels the prompt.
const age = prompt("Please enter your age:", "18");
console.log("Age:", age);
