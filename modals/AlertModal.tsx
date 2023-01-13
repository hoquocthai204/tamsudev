import { Modal, Button } from "antd";
import React from "react";

interface AlertModalProps {
  open: boolean;
  setOpen: (value: boolean) => void;
  title: string;
}

const AlertModal: React.FunctionComponent<AlertModalProps> = ({
  open,
  setOpen,
  title,
}) => {
  return (
    <Modal
      title={"Metamask alert"}
      centered
      open={open}
      onOk={() => setOpen(false)}
      onCancel={() => setOpen(false)}
      footer={[
        <Button key="back" onClick={() => setOpen(false)}>
          Return
        </Button>,
      ]}
      className="review-modal"
    >
      <p className="review-modal__title">{title}</p>
    </Modal>
  );
};

export default AlertModal;
