import "react-photo-view/dist/react-photo-view.css"
import { PhotoProvider, PhotoView } from "react-photo-view"

export default function MagicImg(props: any) {
  return (
    <PhotoProvider>
      <PhotoView src={props.src}>
        <img style={{width:"20%"}} src={props.src} alt="error" />
      </PhotoView>
    </PhotoProvider>
  )
}