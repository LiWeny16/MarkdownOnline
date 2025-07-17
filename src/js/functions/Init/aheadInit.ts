import {
  getTheme,
} from "@App/config/change"
import kit from "bigonion-kit"

const aheadInit = () => {
  kit.addStyle(`
::selection {
border-radius: 5px;
background-color: ${getTheme() === "light" ? "#add6ff" : "#636363"};
}

    `)
}


export { aheadInit }
