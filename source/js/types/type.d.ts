type MD = string

type DB = any

interface ImgData {
  uuid: number
  imgBase64: string
}

interface MagicImgOptions extends NormalComponentsOptions {
  magic?: any
  src: string
  uuid?:any
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
  margin?: React.CSSProperties["margin"]
}

interface Movement {
  x?: any
  y?: any
}

interface TokenType {
  type:string
}
interface ImageToken extends TokenType {
  href:string,
  title:string,
  text:string
}

type Position = "L" | "R" | "C" | "Any"

