import React, { useEffect, useRef, useState } from "react";
import { Modal, Spinner, Table } from "flowbite-react";
import { useDispatch, useSelector } from "react-redux";
import {
  changeStatus,
  deleteOrder,
  fetchOrders,
} from "../redux/order/orderSlice";
import { FaTrashAlt } from "react-icons/fa"; // For delete icon
import toast from "react-hot-toast";

const OrderList = () => {
  const { orders, allOrders, showmore, loading, error } = useSelector(
    (state) => state.order
  );
  const dispatch = useDispatch();
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("");
  const [status, setStatus] = useState("");
  const [singleOrderStatus, setSingleOrderStatus] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [latest, setLatest] = useState(true);
  const scrollPositionRef = useRef(null);
  const limit = 10;
  const values = {
    query,
    sort,
    status,
    limit,
  };

  useEffect(() => {
    scrollPositionRef.current = window.scrollY;
    dispatch(fetchOrders({ values }));
  }, [query, sort, status]);

  console.log(values);

  const handleModal = (products) => {
    setSelectedProducts(products); // Set the selected product
    setShowModal(true);
  };

  const handleLatestOrders = () => {
    scrollPositionRef.current = window.scrollY;
    if (latest) {
      setSort("latest");
      setLatest(!latest);
    } else {
      setSort("");
      setLatest(!latest);
    }
  };
  const handleShowmore = () => {
    scrollPositionRef.current = window.scrollY;
    values.startIndex = allOrders;
    console.log(values.startIndex);
    dispatch(fetchOrders({ values }));
  };
  useEffect(() => {
    if (scrollPositionRef.current !== null) {
      window.scrollTo(0, scrollPositionRef.current);
    }
  }, [orders]);
  console.log(singleOrderStatus);

  return (
    <div className="shadow-lg rounded-lg  bg-white min-h-screen mt-7">
      {/* Search and Filter Bar */}
      <div className="mb-6 flex flex-col md:flex-row justify-between items-center">
        <input
          type="text"
          placeholder="Search by order ID, user, or address..."
          className="px-4 py-2 border border-gray-300 rounded-lg mb-4 md:mb-0 md:mr-4 w-full md:w-1/3"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        <div className="flex items-center space-x-4">
          {/* Filter by Status */}
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg"
          >
            <option value="">All Orders</option>
            <option value="order placed">Order Placed</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
          </select>

          {/* Latest Orders Button */}
          <button
            onClick={handleLatestOrders}
            className="px-4 py-2 bg-teal-500 text-white rounded-lg shadow hover:bg-teal-600 transition duration-200"
          >
            {latest ? "Latest Orders" : "All Orders"}
          </button>
        </div>
      </div>

      {error ? (
        <p className="text-red-500">{error}</p>
      ) : loading ? (
        <div className="flex items-center justify-center ">
          <Spinner className="h-24 w-24" />
        </div>
      ) : (
        <div className=" overflow-x-auto ">
          <Table className=" divide-gray-200 shadow-sm">
            <Table.Head className="bg-gray-100">
              <Table.HeadCell className="text-left px-6 py-4 font-semibold text-gray-700">
                Order ID
              </Table.HeadCell>
              <Table.HeadCell className="text-left px-6 py-4 font-semibold text-gray-700">
                Products
              </Table.HeadCell>
              <Table.HeadCell className="text-left px-6 py-4 font-semibold text-gray-700">
                Users
              </Table.HeadCell>
              <Table.HeadCell className="text-left px-6 py-4 font-semibold text-gray-700">
                Price
              </Table.HeadCell>
              <Table.HeadCell className="text-left px-6 py-4 font-semibold text-gray-700">
                Address
              </Table.HeadCell>
              <Table.HeadCell className="text-left px-6 py-4 font-semibold text-gray-700">
                Status
              </Table.HeadCell>
              <Table.HeadCell className="text-left px-6 py-4 font-semibold text-gray-700">
                Date
              </Table.HeadCell>
              <Table.HeadCell className="text-left px-6 py-4 font-semibold text-gray-700">
                Delete
              </Table.HeadCell>
            </Table.Head>

            <Table.Body className="bg-white divide-y divide-gray-200">
              {orders?.map((order, index) => (
                <Table.Row
                  key={index}
                  className="hover:bg-gray-50 transition duration-200"
                >
                  <Table.Cell className="whitespace-nowrap px-6 py-4 font-semibold text-gray-900">
                    {order?.orderCode}
                  </Table.Cell>

                  <Table.Cell className="px-6 py-4">
                    <button
                      onClick={() => handleModal(order?.products)}
                      className="text-blue-600 hover:text-blue-800 transition duration-200 font-semibold"
                    >
                      View Products
                    </button>
                  </Table.Cell>

                  <Table.Cell className="px-6 py-4">
                    <div className="text-gray-900 font-medium">
                      {order?.name}
                    </div>
                    <div className="text-gray-500 text-sm">{order?.email}</div>
                    <div className="text-gray-500 ">0{order?.shippingAddress?.phone}</div>
                  </Table.Cell>

                  <Table.Cell className="px-6 py-4 text-gray-700">
                  ৳{order?.totalPrice?.toFixed(2)}
                  </Table.Cell>

                  <Table.Cell className="px-6 py-4 text-gray-700">
                    {order?.shippingAddress?.address}, 
                    {order?.shippingAddress?.city}
                  </Table.Cell>

                  <Table.Cell className="px-6 py-4">
                    {order.status === "delivered" ? (
                      <p className="px-3 py-2 border border-gray-300 rounded-md text-gray-700 focus:ring-2 focus:ring-blue-500 transition duration-200">
                        Delivered
                      </p>
                    ) : (
                      <select
                        value={order?.status}
                        onChange={(e) => {
                          const newStatus = e.target.value;
                          const values2 = {
                            status: newStatus,
                          };

                          console.log(newStatus);
                          dispatch(changeStatus({ values2, id: order._id }));
                        }}
                        className="px-3 py-2 border border-gray-300 rounded-md text-gray-700 focus:ring-2 focus:ring-blue-500 transition duration-200"
                      >
                        <option value="order placed">Order Placed</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                      </select>
                    )}
                  </Table.Cell>

                  <Table.Cell className="px-6 py-4">
                    {new Intl.DateTimeFormat("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "2-digit",
                    }).format(new Date(order.createdAt))}
                  </Table.Cell>

                  <Table.Cell className="px-6 py-4">
                    <button
                      onClick={() => {
                        dispatch(deleteOrder({ id: order._id, toast }));
                      }}
                      className="text-red-600 hover:text-red-800 transition duration-200"
                    >
                      <FaTrashAlt />
                    </button>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </div>
      )}

      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        size="md"
        popup
        className="rounded-lg shadow-lg "
      >
        <Modal.Header>
          <h2 className="text-xl font-semibold text-gray-800">
            Order Products
          </h2>
        </Modal.Header>
        <Modal.Body className="p-6 space-y-4">
          {selectedProducts?.map((product, index) => (
            <div
              key={index}
              className="flex gap-4 items-center border-b border-gray-200 pb-4"
            >
              <img
                src={product.productImage}
                alt={product.productName}
                className="h-24 w-24 object-contain rounded-lg shadow-md"
              />
              <div className="flex-grow">
                <p className="font-semibold text-gray-900">
                  {product.productName}
                </p>
                <div className="flex gap-6 text-sm mt-1 text-gray-700">
                  <p>
                    Size:{" "}
                    <span className="font-semibold text-gray-900">
                      {product.size === "default" ? "One Size" : product.size}
                    </span>
                  </p>
                  <p>
                    Quantity:{" "}
                    <span className="font-semibold text-gray-900">
                      {product.quantity}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </Modal.Body>
        <Modal.Footer className="flex justify-end">
          <button
            onClick={() => setShowModal(false)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition duration-200"
          >
            Close
          </button>
        </Modal.Footer>
      </Modal>

      {showmore && (
        <div className="mt-6 text-center">
          <button
            onClick={handleShowmore}
            className="bg-teal-500 text-white py-2 px-4 rounded-md hover:bg-teal-600 transition"
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
};

export default OrderList;
