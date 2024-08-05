import { Button, Card, Descriptions, Image, Space, Typography } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';

import { useOrderDetails } from '../../service/hook/product';
import { ROUTES } from '../../utils/routes';

const { Title } = Typography;

const OrderDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: orderDetails } = useOrderDetails(id ?? '');

  return (
    <Card
      bordered={false}
      style={{ maxWidth: 800, margin: '0 auto', padding: '20px' }}
      title={
        <Title level={2} style={{ textAlign: 'center' }}>
          Order Details
        </Title>
      }
    >
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Image
          src={orderDetails?.productImage}
          alt={orderDetails?.productName}
          style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
        />
        <Descriptions bordered column={1}>
          <Descriptions.Item label="Product Name">{orderDetails?.productName}</Descriptions.Item>
          <Descriptions.Item label="Product Description">
            {orderDetails?.productDescription}
          </Descriptions.Item>
          <Descriptions.Item label="Size">{orderDetails?.size}</Descriptions.Item>
          <Descriptions.Item label="Color">{orderDetails?.color}</Descriptions.Item>
          <Descriptions.Item label="Price">₹{orderDetails?.orderValue}</Descriptions.Item>
        </Descriptions>
        <Button type="primary" block size="large" onClick={() => navigate(ROUTES.default)}>
          Continue Shopping
        </Button>
      </Space>
    </Card>
  );
};

export default OrderDetail;
