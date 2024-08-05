import { Col, Row } from 'antd';

import ProductCard from '../../common/component/productCard';
import { useProductList } from '../../service/hook/product';

const ProductList: React.FC = () => {
  const { data } = useProductList();

  return (
    <>
      <h2 className="product-title">Buy Product</h2>
      <div className="product-list-container">
        <Row gutter={10} justify="center">
          {data?.map((product) => (
            <Col key={product._id}>
              <ProductCard product={product} />
            </Col>
          ))}
        </Row>
      </div>
    </>
  );
};

export default ProductList;
