export function generateUHID(prefix = "UHID") {
  const ts = Date.now().toString(36);
  const rand = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `${prefix}-${ts}-${rand}`;
}

export function formatUHIDForPrint(uhid: string) {
  return uhid.replace(/-/g, "");
}
