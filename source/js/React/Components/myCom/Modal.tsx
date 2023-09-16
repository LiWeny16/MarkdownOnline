import React from "react"
import { Modal, ModalProps } from "@arco-design/web-react"

export default function App(props: ModalProps | any) {
    const [visible, setVisible] = React.useState(false);
  return (
    <div>
      <Modal
        title="Modal Title"
        visible={visible}
        onOk={() => setVisible(false)}
        onCancel={() => setVisible(false)}
        autoFocus={false}
        focusLock={true}
      >
        <p>
          You can customize modal body text by the current situation. This modal
          will be closed immediately once you press the OK button.
        </p>
      </Modal>
    </div>
  )
}
