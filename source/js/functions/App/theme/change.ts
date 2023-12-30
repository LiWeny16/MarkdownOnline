import { useTheme } from "@Root/js/React/Mobx/Theme"

export default function changeTheme(mode: string) {
  mode == "light" ? useTheme().light() : useTheme().dark()
}

export function getTheme() {
  return useTheme().themeState
}
