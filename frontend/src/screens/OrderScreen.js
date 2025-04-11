import React, { useEffect, useState } from "react";
import { Row, Col, ListGroup, Image, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from 'react-router-dom';
import Message from "../components/Message";
import { getOrderDetails, payOrder ,deliverOrder} from "../actions/orderActions";
import Loader from "../components/loader";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { ORDER_PAY_RESET,ORDER_DELIVER_RESET } from "../constants/orderConstants";
function OrderScreen() {
  const { id: orderId } = useParams();
  const dispatch = useDispatch();
  const [sdkReady, setSdkReady] = useState(true); // Simplified initialization

  const orderDetails = useSelector((state) => state.orderDetails);
  const { order = {}, loading, error } = orderDetails;
  
  const orderPay = useSelector((state) => state.orderPay);
  const { loading: loadingPay, success: successPay } = orderPay; // Fixed variable name

  const successPaymentHandler = (paymentResult) => {
    dispatch(payOrder(order._id, paymentResult));
  };

  // Price calculations
  const calculatePrices = () => {
    const itemsPrice = order?.orderItems?.reduce(
      (acc, item) => acc + item.price * item.qty,
      0
    ) || 0;

    const shippingPrice = itemsPrice > 100 ? 0 : 10;
    const taxPrice = 0.082 * itemsPrice;
    const totalPrice = itemsPrice + shippingPrice + taxPrice;

    return {
      itemsPrice: itemsPrice.toFixed(2),
      shippingPrice: shippingPrice.toFixed(2),
      taxPrice: taxPrice.toFixed(2),
      totalPrice: totalPrice.toFixed(2)
    };
  };

  const { itemsPrice, shippingPrice, taxPrice, totalPrice } = calculatePrices();

  useEffect(() => {
    const abortController = new AbortController();

    if (!order._id || successPay || order._id !== orderId) {
      dispatch(getOrderDetails(orderId, abortController.signal));
    }

    return () => abortController.abort();
  }, [dispatch, orderId, successPay, order._id]);

  return loading ? (
    <Loader />
  ) : error ? (
    <Message variant="danger">{error}</Message>
  ) : (
    <PayPalScriptProvider 
      options={{ 
        "client-id": "AY8ryCaodNXw5EUaR7nkgerYE_6uJH1WuTZZ9IUKuCS0Vlqg7-7qSIZaVZa7mkjYWFo2q67fcA2ZMEti",
        currency: "USD"
      }}
    >
      <div>
        <h1>Order: {order?._id}</h1>
        <Row>
        <Col md={8}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h2>Shipping</h2>
              <p>
                <strong>Name: </strong> {order.user?.name}
              </p>
              <p>
                <strong>Email: </strong>
                <a href={`mailto:${order.user?.email}`}>{order.user?.email}</a>
              </p>
              <p>
                <strong>Shipping: </strong>
                {order.shippingaddress?.address}, {order.shippingaddress?.city}{" "}
                {order.shippingaddress?.postalCode},{" "}
                {order.shippingaddress?.country}
              </p>
              {order.isDelivered ? (
                    <Message variant="success">
                        Delivered on {order.DeliveredAt}
                    </Message>
                ) : (
                    <Message variant="danger">Not deliver</Message>
                )}
            </ListGroup.Item>
            <ListGroup.Item>
                <h2>Payment Method</h2>
                <p>
                    <strong>Method: </strong>
                    {order.paymentMethod}
                </p>
                {order.isPaid ? (
                    <Message variant="success">
                        Paid on {order.paidAt}
                    </Message>
                ) : (
                    <Message variant="danger">Not Paid</Message>
                )}
            </ListGroup.Item>
            <ListGroup.Item>
              <h2>Order Items</h2>
              {order.orderitems.length === 0 ? (
                <Message variant="info">Order is empty</Message>
              ) : (
                <ListGroup variant="flush">
                  {order.orderitems.map((item, index) => (
                    <ListGroup.Item key={index}>
                      <Row>
                        <Col md={1}>
                          <Image
                            src={item.image}
                            alt={item.name}
                            fluid
                            rounded
                          />
                        </Col>
                        <Col>
                          <Link to={`/product/${item.product}`}>
                            {item.name}
                          </Link>
                        </Col>
                        <Col md={4}>
                          {item.qty} X ${item.price} = $
                          {(item.qty * item.price).toFixed(2)}
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </ListGroup.Item>
          </ListGroup>
        </Col>

        <Col md={4}>
          <Card>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <h2>Order Summary</h2>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Items:</Col>
                  <Col>${itemsPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Shipping:</Col>
                  <Col>${Number(order.shippingPrice || 0).toFixed(2)}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Tax:</Col>
                  <Col>${Number(order.taxPrice || 0).toFixed(2)}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Total:</Col>
                  <Col>${Number(order.totalPrice || 0).toFixed(2)}</Col>
                </Row>
              </ListGroup.Item>
              {!order.isPaid && (
                <ListGroup.Item>
                  {loadingPay && <Loader />}
                  {!sdkReady ? (
                    <Loader />
                  ) : (
                    <PayPalButtons
                      amount={order.totalPrice}
                      onSuccess={successPaymentHandler}
                    />
                  )}
                </ListGroup.Item>
              )}
              {loading && <Loader />}
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </div>
    </PayPalScriptProvider>
  );
}

export default OrderScreen;
