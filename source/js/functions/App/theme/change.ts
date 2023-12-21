import { useTheme } from "@Root/js/React/Mobx/Theme"

export default function changeTheme() {
  if (useTheme().themeState == "light") {
    useTheme().dark()
  } else {
    useTheme().light()
  }
}
