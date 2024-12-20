import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import moment from "moment";
import {
  addReview,
  deleteReview,
  editReview,
  getSingleProduct,
} from "../redux/product/productSlice";
import { Rating, Spinner } from "flowbite-react";
import toast from "react-hot-toast";
import { addToCart } from "../redux/user/userSlice";

const SingleProduct = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const reviewFormRef = useRef(null);
  const [activeSize, setActiveSize] = useState("");
  const [review, setReview] = useState({ comment: "", rating: 0 });
  const [editingReviewId, setEditingReviewId] = useState(null);
  const { currentUser } = useSelector((state) => state.user.user);
  const { singleProduct, loading, cart } = useSelector((state) => state.product);

  const handleChangeSize = (size) => setActiveSize(size);

  const handleReviewChange = (e) => {
    const { name, value } = e.target;
    setReview({ ...review, [name]: value });
  };

  const handleRatingChange = (rating) => setReview({ ...review, rating });

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!review.rating || !review.comment.trim()) {
      toast.error("Please provide both a rating and a comment.");
      return;
    }
    if (editingReviewId) {
      dispatch(editReview({ id: singleProduct._id, review, toast }));
    } else {
      dispatch(addReview({ id: singleProduct._id, review, toast }));
    }
    setReview({ comment: "", rating: 0 });
    setEditingReviewId(null);
  };

  const handleEditReview = (review) => {
    setEditingReviewId(review._id);
    setReview({ comment: review.comment, rating: review.rating });
    if (reviewFormRef.current) {
      reviewFormRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleAddToCart = (value) => {
    dispatch(addToCart(value));
    toast.success("Item successfully added to your cart!");
  };

  useEffect(() => {
    dispatch(getSingleProduct(id));
  }, [id, dispatch]);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center text-xl">
        <Spinner className="h-24 w-24" />
      </div>
    );
  }

  return (
    <div className="min-h-screen container mx-auto p-4 md:p-6 lg:p-8 space-y-24">
      <div className="flex flex-col md:flex-row gap-10 w-full">
        {/* Product Image */}
        <div className="flex justify-center items-center w-full md:w-1/2">
          <img
            src={singleProduct?.image}
            alt={singleProduct?.name}
            className="max-h-[500px] w-full object-contain lg:max-h-[700px] rounded-md"
          />
        </div>

        {/* Product Details */}
        <div className="flex flex-col gap-6 px-2 w-full md:w-1/2">
          <h1 className="font-semibold text-2xl md:text-3xl">
            {singleProduct?.name}
          </h1>

          {/* Product Rating */}
          <div className="flex items-center gap-2">
            <Rating>
              {[...Array(5)].map((_, index) => (
                <Rating.Star
                  key={index}
                  filled={index < Math.round(singleProduct?.rating)}
                />
              ))}
            </Rating>
            <p className="ml-2 text-sm font-medium text-gray-500">
              ({singleProduct?.reviews?.length} reviews)
            </p>
          </div>

          {/* Price */}
          <p className="font-bold text-3xl md:text-4xl text-black">
            ৳{singleProduct?.price}
          </p>

          {/* Product Description */}
          <p className="text-gray-500 font-medium md:text-lg">
            {singleProduct?.description}
          </p>

          {/* Select Size */}
          {singleProduct?.stock > 0 ? (
            <div className="space-y-4">
              <p className="md:text-lg font-medium">Select Size</p>
              <div className="flex flex-wrap gap-2">
                {singleProduct?.sizes?.map((size, index) =>
                  size.stock > 0 ? (
                    <button
                      onClick={() => handleChangeSize(size.size)}
                      key={index}
                      className={`md:text-xl p-4 rounded-md border-2 ${
                        size.size === activeSize
                          ? "border-gray-700 bg-gray-100"
                          : " hover:border-gray-700"
                      } shadow-md transition-all duration-200 ease-in-out flex items-center justify-center`}
                    >
                      {size.size === "default" ? "One Size" : size.size}
                    </button>
                  ) : null
                )}
              </div>
            </div>
          ) : (
            <p className="text-red-500 font-bold">Out of Stock</p>
          )}

          {/* Add to Cart Button */}
          <button
            onClick={() => {
              if (!activeSize) return;

              handleAddToCart({
                id: singleProduct?._id,
                name: singleProduct?.name,
                image: singleProduct?.image,
                price: singleProduct?.price,
                size: activeSize,
                quantity: 1,
              });
            }}
            className={`px-6 py-3 rounded-md text-white transition duration-200 ease-in-out ${
              activeSize
                ? "bg-teal-500 hover:opacity-75"
                : "bg-teal-700 cursor-not-allowed"
            }`}
          >
            {activeSize ? "Add to Cart" : "Select a Size"}
          </button>

          {/* Additional Info */}
          <div className="flex flex-col space-y-2 text-gray-500 md:text-md">
            <p>100% Original product.</p>
            <p>Cash on delivery is available on this product.</p>
            <p>Easy return and exchange policy within 7 days.</p>
          </div>
        </div>
      </div>

      {/* Review Section */}
      <div className="flex flex-col items-start">
        <h2 className="font-bold md:text-3xl mb-6">Customer Reviews</h2>

        {/* Review Form */}
        {currentUser ? (
          <form
            onSubmit={handleReviewSubmit}
            ref={reviewFormRef}
            className="w-full bg-gray-50 p-4 rounded-md shadow-md space-y-4"
          >
            <div className="flex flex-col gap-2">
              <label className="font-medium">Rating</label>
              <Rating>
                {[1, 2, 3, 4, 5].map((rate) => (
                  <Rating.Star
                    key={rate}
                    filled={review.rating >= rate}
                    onClick={() => handleRatingChange(rate)}
                    className="cursor-pointer"
                  />
                ))}
              </Rating>
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-medium">Comment</label>
              <textarea
                name="comment"
                value={review?.comment}
                onChange={handleReviewChange}
                placeholder="Share your thoughts on this product..."
                rows="4"
                className="w-full border border-gray-300 p-2 rounded-md"
                required
              />
            </div>

            <button
              type="submit"
              className="px-6 py-3 bg-teal-500 text-white rounded-md hover:opacity-75 transition-all"
            >
              {editingReviewId ? "Update Review" : "Submit Review"}
            </button>
          </form>
        ) : (
          <p className="text-lg">Please log in to leave a review.</p>
        )}

        {/* Reviews List */}
        <div className="mt-8 space-y-4">
          {singleProduct?.reviews?.map((review) => (
            <div key={review._id} className="p-4 rounded-md">
              <div className="flex gap-2 mb-2">
                <p className="font-bold">{review?.name}</p>
                <Rating>
                  {[...Array(5)].map((_, index) => (
                    <Rating.Star key={index} filled={index < review.rating} />
                  ))}
                </Rating>
                <p className="text-sm text-gray-500">
                  {moment(review.createdAt).fromNow()}
                </p>
              </div>
              <p className="text-gray-600 mb-2 max-w-xs sm:max-w-md">
                {review.comment}
              </p>

              {(currentUser?.isAdmin || currentUser?._id === review.userId) && (
                <div className="flex gap-2">
                  {currentUser?._id === review.userId && (
                    <button
                      onClick={() => handleEditReview(review)}
                      className="text-black rounded-md"
                    >
                      Edit
                    </button>
                  )}
                  <button
                    onClick={() =>
                      dispatch(
                        deleteReview({
                          id: singleProduct?._id,
                          id2: review?._id,
                          toast,
                        })
                      )
                    }
                    className="text-red-500 rounded-md"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SingleProduct;
