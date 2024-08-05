import { LeftOutlined } from '@ant-design/icons';
import {
  Button,
  Card,
  Descriptions,
  Divider,
  Image,
  Layout,
  Rate,
  Space,
  Tabs,
  Tag,
  Typography,
  message
} from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import OrderDetails from '../../common/component/orderDetail';
import ProductCoupon from '../../common/component/productCoupon';
import UserModal from '../../common/modal/user';
import {
  IColorAndSizeArray,
  ICoupon,
  ICouponApplied,
  ICouponReq,
  IOrderReq,
  IUser
} from '../../service/api/product/type';
import {
  useCouponApplied,
  useCouponList,
  useOrderConfirmed,
  useProductDetails
} from '../../service/hook/product';
import { ROUTES } from '../../utils/routes';

const { Text } = Typography;
const { Content, Sider } = Layout;

const ProductDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [availableColors, setAvailableColors] = useState<IColorAndSizeArray[]>([]);
  const [price, setPrice] = useState<number>(0);
  const [productEntryId, setProductEntryId] = useState<string>('');
  const [inputCode, setInputCode] = useState<string>('');
  const [selectedCoupon, setSelectedCoupon] = useState<ICoupon | null>(null);
  const [visible, setVisible] = useState<boolean>(false);
  const [userEmail, setUserEmail] = useState<string>('');
  const [orderDetails, setOrderDetails] = useState<ICouponApplied | null>(null);

  const { data: productDetails } = useProductDetails(id ?? '');
  const { data: coupons } = useCouponList(id ?? '');
  const { mutate: applyCoupon } = useCouponApplied();
  const { mutate: confirmOrder } = useOrderConfirmed();

  useEffect(() => {
    if (productDetails) {
      const initialSize = productDetails.sizeWiseColorPriceArray[0]._id;
      const initialColorArray = productDetails.sizeWiseColorPriceArray[0].colorAndSizeArray;

      setSelectedSize(initialSize);
      setAvailableColors(initialColorArray);
      setSelectedColor(initialColorArray[0].colorId);
      setPrice(initialColorArray[0].price);
      setProductEntryId(initialColorArray[0].productEntryId);
    }
  }, [productDetails]);

  const handleSizeChange = (sizeId: string) => {
    const sizeData = productDetails?.sizeWiseColorPriceArray.find((item) => item._id === sizeId);
    if (sizeData) {
      const initialColor = sizeData.colorAndSizeArray[0];

      setSelectedSize(sizeId);
      setAvailableColors(sizeData.colorAndSizeArray);
      setSelectedColor(initialColor.colorId);
      setPrice(initialColor.price);
      setProductEntryId(initialColor.productEntryId);

      resetCouponSelection();
    }
  };

  const handleColorChange = (colorId: string) => {
    const colorData = availableColors.find((color) => color.colorId === colorId);
    if (colorData) {
      setSelectedColor(colorId);
      setPrice(colorData.price);
      setProductEntryId(colorData.productEntryId);

      resetCouponSelection();
    }
  };

  const resetCouponSelection = () => {
    setInputCode('');
    setOrderDetails(null);
    setSelectedCoupon(null);
  };

  const sizeTabs = useMemo(() => {
    return productDetails?.sizeWiseColorPriceArray.map((size) => ({
      key: size._id,
      label: size.size,
      children: null
    }));
  }, [productDetails]);

  const handleApplyCoupon = () => {
    if (!inputCode) {
      message.error('Please select a coupon code');
      return;
    }

    if (!userEmail) {
      setVisible(true);
      return;
    }

    const couponDetails: ICouponReq = {
      productEntryId,
      couponId: selectedCoupon?._id ?? null,
      email: userEmail
    };

    applyCoupon(couponDetails, {
      onSuccess: (res) => setOrderDetails(res),
      onError: (error) => {
        setOrderDetails(null);
        message.error(error.message || 'Failed to apply coupon');
      }
    });
  };

  const handleConfirmOrder = () => {
    if (!userEmail) {
      setVisible(true);
      return;
    }

    const orderData: IOrderReq = {
      productEntryId,
      couponId: orderDetails?.isCoupon_applied ? selectedCoupon?._id : null,
      email: userEmail,
      orderValue: orderDetails?.amount_payable ?? price
    };

    confirmOrder(orderData, {
      onSuccess: (res) => navigate(`/order/${res._id}`),
      onError: () => message.error('Order confirmation failed')
    });
  };

  const handleModalCancel = () => setVisible(false);

  const handleModalFinish = (values: IUser) => {
    setVisible(false);
    setUserEmail(values.email);
  };

  const setCouponValue = (coupon: ICoupon) => {
    setSelectedCoupon(coupon);
    setInputCode(coupon.code);
    setOrderDetails(null);
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        width={300}
        style={{
          backgroundColor: '#fff',
          padding: '20px',
          boxShadow: '2px 0 8px rgba(0, 0, 0, 0.1)'
        }}
      >
        <Button
          type="link"
          icon={<LeftOutlined />}
          onClick={() => navigate(ROUTES.productList)}
          style={{ marginBottom: 16 }}
        >
          Back
        </Button>
        <Image
          alt={productDetails?.productName}
          src={productDetails?.productImage}
          width="100%"
          height={400}
          style={{ objectFit: 'cover', borderRadius: 8 }}
        />
        <Divider />
        <Descriptions column={1}>
          <Descriptions.Item label="Description">
            <Text>{productDetails?.productDescription}</Text>
          </Descriptions.Item>
          <Descriptions.Item label="Rating">
            <Rate disabled value={productDetails?.productRate} />
          </Descriptions.Item>
          <Descriptions.Item label="Price">
            <Text>₹{price}</Text>
          </Descriptions.Item>
        </Descriptions>
      </Sider>

      <Layout>
        <Content style={{ padding: '24px' }}>
          <Card className="product-options-card" style={{ marginBottom: '24px' }}>
            <Tabs
              size="large"
              activeKey={selectedSize}
              onChange={handleSizeChange}
              items={sizeTabs}
              tabBarGutter={24}
              tabPosition="top"
            />
            <Divider orientation="left">Available Colors</Divider>
            <Space size="middle" wrap>
              {availableColors.map((color) => (
                <Tag
                  key={color.colorId}
                  color={color.colorId === selectedColor ? 'blue' : 'default'}
                  onClick={() => handleColorChange(color.colorId)}
                  style={{ cursor: 'pointer', padding: '0.5em 1em', borderRadius: 8 }}
                >
                  {color.color}
                </Tag>
              ))}
            </Space>
          </Card>

          <Card className="product-coupon-card" style={{ marginBottom: '24px' }}>
            <ProductCoupon
              inputCode={inputCode}
              coupons={coupons}
              selectedCoupon={selectedCoupon}
              setCoupleValue={setCouponValue}
              handleApplyCoupon={handleApplyCoupon}
              orderDetails={orderDetails}
            />
          </Card>

          <Card className="order-details-card">
            <OrderDetails
              price={price}
              orderDetails={orderDetails}
              handleConfirmOrder={handleConfirmOrder}
            />
          </Card>
        </Content>
      </Layout>

      {visible && (
        <UserModal
          visible={visible}
          handleCancel={handleModalCancel}
          onFinish={handleModalFinish}
        />
      )}
    </Layout>
  );
};

export default ProductDetail;
