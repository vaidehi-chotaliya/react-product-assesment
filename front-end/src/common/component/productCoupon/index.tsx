import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { Button, Input, List, Tag, Typography } from 'antd';
import React from 'react';

import { ICoupon, ICouponApplied } from '../../../service/api/product/type';

const { Title, Paragraph, Text } = Typography;

interface IProps {
  inputCode: string;
  coupons: ICoupon[] | undefined;
  selectedCoupon: ICoupon | null;
  setCoupleValue: (coupon: ICoupon) => void;
  handleApplyCoupon: () => void;
  orderDetails: ICouponApplied | null;
}

const ProductCoupon: React.FC<IProps> = ({
  inputCode,
  coupons,
  selectedCoupon,
  setCoupleValue,
  handleApplyCoupon,
  orderDetails
}) => {
  console.log('orderDetails', orderDetails);
  return (
    <div className="coupon-container">
      <Title level={4}>Choose a Coupon</Title>
      <List
        grid={{ gutter: 16, column: 3 }}
        dataSource={coupons}
        renderItem={(coupon) => (
          <List.Item>
            <Tag
              style={{ width: '100%', textAlign: 'center', cursor: 'pointer' }}
              key={coupon._id}
              color={coupon.code === (selectedCoupon?.code || '') ? 'green' : 'default'}
              onClick={() => setCoupleValue(coupon)}
            >
              <Text strong>{coupon.code}</Text> - {coupon.discountPercentage}% off
            </Tag>
          </List.Item>
        )}
      />
      {selectedCoupon && (
        <Paragraph className="coupon-desc" style={{ marginTop: 16 }}>
          <Text strong>Description: </Text> {selectedCoupon.description}
        </Paragraph>
      )}
      <div className="coupon-input" style={{ marginTop: 16 }}>
        <Input
          placeholder="Enter coupon code"
          value={inputCode}
          style={{ width: 200, marginRight: 10 }}
          onChange={(e) => setCoupleValue({ ...selectedCoupon, code: e.target.value } as ICoupon)}
        />
        <Button type="primary" onClick={handleApplyCoupon}>
          Apply
        </Button>
        {orderDetails?.isCoupon_applied && (
          <CheckCircleOutlined style={{ color: 'green', marginLeft: 10 }} />
        )}
        {orderDetails && !orderDetails.isCoupon_applied && (
          <CloseCircleOutlined style={{ color: 'red', marginLeft: 10 }} />
        )}
      </div>
      <Paragraph
        className="coupon-message"
        style={{ marginTop: 8, color: orderDetails?.isCoupon_applied ? 'green' : 'red' }}
      >
        {orderDetails?.message}
      </Paragraph>
    </div>
  );
};

export default ProductCoupon;
