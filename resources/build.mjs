// Builds the free downloads into public/downloads: renders the PDFs and zips
// the code resources. Run `npm run resources`, or `npm run resources -- <name>`
// for one of them (a name below, e.g. "website-launch-checklist").
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, rmSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { renderToFile } from "@react-pdf/renderer";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const downloads = join(root, "public/downloads");

// Documents: modules in resources/documents exporting `file` and `document()`.
const DOCUMENTS = ["website-launch-checklist", "mysql-query-tuning-cheatsheet"];

// Code: [zip name, folder to zip, the folder's name inside the zip]. Build
// output, dependencies and local settings are left out of every zip.
const ZIPS = [
  ["pradipta-rest-lock.zip", "wordpress/pradipta-rest-lock", "pradipta-rest-lock"],
  ["shopify-free-shipping-bar.zip", "resources/shopify-free-shipping-bar", "shopify-free-shipping-bar"],
  ["tailwind-block-theme.zip", "resources/tailwind-block-theme", "tailwind-block-theme"],
  ["headless-wordpress-starter.zip", "resources/headless-wordpress-starter", "headless-wordpress-starter"],
];

const EXCLUDE = [
  "*.DS_Store",
  "*/node_modules/*",
  "*/.next/*",
  "*/.env",
  "*/.env.local",
  "*/.git/*",
  "*/next-env.d.ts",
  "*.tsbuildinfo",
];

const only = process.argv[2];
const wanted = (name) => !only || name === only || name.startsWith(only);

mkdirSync(downloads, { recursive: true });

for (const name of DOCUMENTS.filter(wanted)) {
  const { file, document } = await import(`./documents/${name}.mjs`);
  await renderToFile(document(), join(downloads, file));
  console.log(`PDF  public/downloads/${file}`);
}

for (const [zip, folder, as] of ZIPS.filter(([zip]) => wanted(zip.replace(/\.zip$/, "")))) {
  const source = join(root, folder);
  if (!existsSync(source)) throw new Error(`Missing ${folder}`);

  // zip stores paths as given, so zip from the parent under the right name.
  const target = join(downloads, zip);
  rmSync(target, { force: true });
  const parent = dirname(source);
  const name = source.slice(parent.length + 1);
  if (name !== as) throw new Error(`${folder} must be named ${as}`);
  execFileSync("zip", ["-X", "-q", "-r", target, as, "-x", ...EXCLUDE], { cwd: parent, stdio: "inherit" });
  console.log(`ZIP  public/downloads/${zip}`);
}
