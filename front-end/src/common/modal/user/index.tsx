import { Button, Form, Input, Modal } from 'antd';

import { IUser } from '../../../service/api/product/type';

interface IProps {
  visible: boolean;
  handleCancel: () => void;
  onFinish: (values: IUser) => void;
}

const UserModal: React.FC<IProps> = ({ visible, handleCancel, onFinish }) => {
  return (
    <Modal open={visible} title="Enter Email" onCancel={handleCancel} footer={null} centered>
      <div className="container-add">
        <Form
          layout="vertical"
          name="add-user"
          style={{ maxWidth: 400, width: '100%' }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: 'Please enter email' },
              { type: 'email', message: 'Please enter a valid email' }
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item style={{ textAlign: 'center' }}>
            <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
              Submit
            </Button>
          </Form.Item>
        </Form>
      </div>
    </Modal>
  );
};

export default UserModal;
