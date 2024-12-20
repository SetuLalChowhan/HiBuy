import React, { useEffect, useState } from "react";
import Banner from "../components/Banner";
import axios from "axios";
import ProductCard from "../components/ProductCard";
import Title from "../components/Title";
import { FaExchangeAlt } from "react-icons/fa";
import { TbTruckReturn } from "react-icons/tb";
import { BiSupport } from "react-icons/bi";
import { Spinner } from "flowbite-react";

export default function Home() {
  const [latestProducts, setLatestProducts] = useState([]);
  const [bestSellerProducts, setBestSellerProducts] = useState([]);
  const [latestLoading, setLatestLoading] = useState(false);
  const [bestSellerLoading, setBestSellerLoading] = useState(false);
  const [latestError, setLatestError] = useState("");
  const [bestSellerError, setBestSellerError] = useState("");

  const testimonials = [
    { name: "John Doe", text: "The quality of the products is amazing! I highly recommend shopping here." },
    { name: "Jane Smith", text: "Great customer service and fast shipping. Will definitely be back for more!" },
    { name: "Alice Johnson", text: "I love my new clothes! They fit perfectly and look fantastic." },
  ];

  const policies = [
    { icon: FaExchangeAlt, title: "Easy Exchange Policy", description: "We offer a hassle-free exchange policy for your convenience." },
    { icon: TbTruckReturn, title: "7 Days Return Policy", description: "Enjoy a 7-day return policy with no extra charges." },
    { icon: BiSupport, title: "24/7 Customer Support", description: "Our customer support is available around the clock to assist you." },
  ];

  useEffect(() => {
    const fetchLatestProducts = async () => {
      setLatestLoading(true);
      setLatestError("");
      try {
        const response = await axios.get(`http://localhost:3000/api/products/all-products?latest=true&startIndex=0&limit=10`);
        setLatestProducts(response.data.products);
      } catch (error) {
        console.error("Error fetching latest products:", error);
        setLatestError("Failed to load the latest products. Please try again.");
      } finally {
        setLatestLoading(false);
      }
    };

    fetchLatestProducts();
  }, []);

  useEffect(() => {
    const fetchBestSellerProducts = async () => {
      setBestSellerLoading(true);
      setBestSellerError("");
      try {
        const response = await axios.get(`http://localhost:3000/api/products/all-products?bestSeller=true&startIndex=0&limit=10`);
        setBestSellerProducts(response.data.products);
      } catch (error) {
        console.error("Error fetching best sellers:", error);
        setBestSellerError("Failed to load best-seller products. Please try again.");
      } finally {
        setBestSellerLoading(false);
      }
    };

    fetchBestSellerProducts();
  }, []);

  return (
    <div className="container">
      {/* Banner Section */}
      <Banner />

      {/* Latest Collections Section */}
      <section className="w-full py-10">
        <Title
          title="Latest"
          title2="Collections"
          para="Discover our latest collections, featuring on-trend designs and timeless elegance. Each piece is crafted to ensure you make a stylish statement wherever you go."
        />
        {latestError ? (
          <p className="text-red-600 text-2xl mt-5">{latestError}</p>
        ) : latestLoading ? (
          <div className="flex items-center justify-center h-48">
            <Spinner className="h-24 w-24" />
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 mt-5">
            {latestProducts.map((product, index) => (
              <div key={index}>
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Best Sellers Section */}
      <section className="w-full py-10">
        <Title
          title="Best"
          title2="Sellers"
          para="Browse through our best-sellers, featuring customer favorites that have stood the test of time. Elevate your wardrobe with these popular picks."
        />
        {bestSellerError ? (
          <p className="text-red-600 text-2xl mt-5">{bestSellerError}</p>
        ) : bestSellerLoading ? (
          <div className="flex items-center justify-center h-48">
            <Spinner className="h-24 w-24" />
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 mt-5">
            {bestSellerProducts.map((product, index) =>
              index < 8 ? (
                <div key={index}>
                  <ProductCard product={product} />
                </div>
              ) : null
            )}
          </div>
        )}
      </section>

      {/* Policy Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 py-10">
        {policies.map((policy, index) => (
          <div key={index} className="flex flex-col justify-center items-center p-6">
            <policy.icon size={40} className="text-primary mb-4" />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">{policy.title}</h3>
            <p className="text-center text-gray-600">{policy.description}</p>
          </div>
        ))}
      </section>

      {/* Testimonials Section */}
      <section className="w-full py-10 bg-gray-100">
        <h2 className="text-center text-2xl font-bold mb-5">What Our Customers Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md">
              <p className="text-gray-600 italic mb-4">"{testimonial.text}"</p>
              <h4 className="text-lg font-semibold text-gray-800">{testimonial.name}</h4>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
