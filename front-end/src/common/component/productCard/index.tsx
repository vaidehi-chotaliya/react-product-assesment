import { Badge, Button, Card, Rate } from 'antd';
import { useNavigate } from 'react-router-dom';

import { IProduct } from '../../../service/api/product/type';

const { Meta } = Card;

interface IProps {
  product: IProduct;
}

const ProductCard: React.FC<IProps> = ({ product }) => {
  const navigate = useNavigate();

  return (
    <Badge.Ribbon>
      <Card
        hoverable
        className="product-card"
        cover={
          <div className="product-image-container">
            <img alt={product.name} src={product.image} className="product-image" />
          </div>
        }
        onClick={() => navigate(`/product/${product._id}`)}
      >
        <Meta title={product.name} />
      </Card>
    </Badge.Ribbon>
  );
};

export default ProductCard;
