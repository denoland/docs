export function cliNow() {
  const timeOnly = new Date().toLocaleTimeString();
  return `[${timeOnly}]`;
}
