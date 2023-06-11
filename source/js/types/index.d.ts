declare module "*.svg?raw" {
  const src: any;
  export default src;
}
declare module "*.esm.js" {
  const marked: any;
  export { marked };
}

declare module "*.md?raw" {
  const md: any;
  export default md;
}
