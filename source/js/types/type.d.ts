type MD = string

type DB = any

interface ImgData {
  uuid: number
  imgBase64: string
}

interface MagicImgOptions extends NormalComponentsOptions {
  magic?: any
  src: string
}

interface DialogOptions<T> extends NormalComponentsOptions {
  setMailSharePanelState: React.Dispatch<React.SetStateAction<T>>
  mailSharePanelState: any
}
interface NormalComponentsOptions extends React.HTMLProps<HTMLDivElement> {
  // className?: string
  children?: React.ReactNode | JSX.Element
  style?: React.CSSProperties | undefined
}

interface LayoutOptions extends NormalComponentsOptions {
  jus?: React.CSSProperties["justifyContent"]
  ali?: React.CSSProperties["alignItems"]
  dir?: React.CSSProperties["flexDirection"]
  space?: Array<number>
  order?: Array<number>
  move?: Movement
  min?: any
  margin? :React.CSSProperties["margin"]
}

interface Movement {
  x?: any
  y?: any
}
