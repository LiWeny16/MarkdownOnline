import { allInit, fillInRemeText, kit, mdConverter } from "@Root/js/index.js"


export default function myPrint() {
  let printString = document.getElementById("view-area")!.innerHTML;
  console.log(printString);
  window.document.body.innerHTML = `<div class="markdown-body">${printString}</div>`;
  kit.sleep(250).then(() => {
    window.print();
    location.reload();
  });
}
