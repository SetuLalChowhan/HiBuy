import React, { useEffect, useState } from "react";
import Banner from "../components/Banner";
import axios from "axios";
import ProductCard from "../components/ProductCard";
import Title from "../components/Title";
import { FaCheckCircle, FaExchangeAlt, FaLock } from "react-icons/fa";
import { TbTruck, TbTruckReturn } from "react-icons/tb";
import { BiSupport } from "react-icons/bi";
export default function Home() {
  const [latestProducts, setLatestProdcuts] = useState([]);
  const [bestSellerProducts, setBestSellerProdcuts] = useState([]);
  const testimonials = [
    {
      name: "John Doe",
      text: "The quality of the products is amazing! I highly recommend shopping here.",
    },
    {
      name: "Jane Smith",
      text: "Great customer service and fast shipping. Will definitely be back for more!",
    },
    {
      name: "Alice Johnson",
      text: "I love my new clothes! They fit perfectly and look fantastic.",
    },
  ];
  const allPolicy = [
    {
      icon: FaExchangeAlt,
      policy_title: "Easy Exchange Policy",
      policy_pera: "Easy Exchange Policy",
    },
    {
      icon: TbTruckReturn,
      policy_title: "7 Days Return Policy",
      policy_pera: "We provide 7 days free return policy",
    },
    {
      icon: BiSupport,
      policy_title: "Best customer support",
      policy_pera: "we provide 24/7 customer support",
    },
  ];

  useEffect(() => {
    const fetchLatestProduct = async () => {
      const response = await axios.get(
        `http://localhost:3000/api/products/all-products?latest=true&startIndex=0&limit=10`
      );
      setLatestProdcuts(response.data.products);
    };

    fetchLatestProduct();
  }, []);
  useEffect(() => {
    const fetchLatestProduct = async () => {
      const response = await axios.get(
        `http://localhost:3000/api/products/all-products?bestSeller=true&startIndex=0&limit=10`
      );
      setBestSellerProdcuts(response.data.products);
    };

    fetchLatestProduct();
  }, []);
  console.log(latestProducts);
  return (
    <div className="container">
      {/* Banner */}
      <Banner />
      {/* Latest Collections */}
      <div className="w-full py-10">
        <Title
          title={"Latest"}
          title2={"Collections"}
          para={
            "Explore our meticulously crafted collections, designed to reflect thelatest trends in fashion and style. Each piece embodies timelesselegance, ensuring you stand out in every moment."
          }
        />

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 mt-5 ">
          {latestProducts.map((product, index) => (
            <ProductCard key={index} product={product} />
          ))}
        </div>
      </div>
      {/* Best Sellers */}
      <div className="w-full py-10">
        <Title
          title={"best"}
          title2={"Sellers"}
          para={
            "Explore our meticulously crafted collections, designed to reflect thelatest trends in fashion and style. Each piece embodies timelesselegance, ensuring you stand out in every moment."
          }
        />

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 mt-5 ">
          {bestSellerProducts.map((product, index) =>
            index <= 7 ? <ProductCard key={index} product={product} /> : null
          )}
        </div>
      </div>
      {/* Policy */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 py-10">
        {allPolicy.map((policy, index) => (
          <div
            key={index}
            className="flex flex-col justify-center items-center p-6 "
          >
            <policy.icon size={40} className="text-primary mb-4" />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              {policy.policy_title}
            </h3>
            <p className="text-center text-gray-600">{policy.policy_pera}</p>
          </div>
        ))}
      </div>

      {/* Testimonials Section */}
      <div className="w-full py-10 bg-gray-100">
        <h2 className="text-center text-2xl font-bold mb-5">What Our Customers Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md">
              <p className="text-gray-600 italic mb-4">"{testimonial.text}"</p>
              <h4 className="text-lg font-semibold text-gray-800">{testimonial.name}</h4>
            </div>
          ))}
        </div>
      </div>


      
    </div>
  );
}
