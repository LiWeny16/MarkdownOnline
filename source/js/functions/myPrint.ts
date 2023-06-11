import kit from "https://npm.elemecdn.com/bigonion-kit@0.11.0/esm/esm-kit.mjs";

export function myPrint() {
  let printString = document.getElementById("view-area")!.innerHTML;
  console.log(printString);
  window.document.body.innerHTML = `<div class="markdown-body">${printString}</div>`;
  kit.sleep(250).then(() => {
    window.print();
    location.reload();
  });
}
