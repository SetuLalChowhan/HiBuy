import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  return (
    <Link to={"#"} className='text-gray-700 cursor-pointer'>
    <div  className='overflow-hidden'>
    <img
        className='hover:scale-110 transition ease-in-out'
        src={`http://localhost:3000/${product.image}`}
        alt={product.name}
      />
    </div>
        <p className='pt-3 pb-1 text-sme h-20 font-semibold'>{product.name}</p>
        <p className='text-lg font-medium'>{product.price} Tk</p>
     
    </Link>
  );
}

export default ProductCard;
