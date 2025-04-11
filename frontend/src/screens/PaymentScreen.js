import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Form, Button, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import FormContainer from "../components/FormContainer";
import { savePaymentMethod } from "../actions/cartActions";
import gpayLogo from "./gpay.png"; // Make sure to have the image in your assets folder
import CheckoutSteps from "../components/CheckoutSteps";
function PaymentScreen() {
  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const [paymentMethod, setPaymentMethod] = useState("Gpay");
  const [message, setMessage] = useState(null);

  useEffect(() => {
    if (!shippingAddress.address) {
      navigate("/shipping");
    }
  }, [navigate, shippingAddress]);

  const submitHandler = (e) => {
    e.preventDefault();
    if (!paymentMethod) {
      setMessage("Please select a payment method");
    } else {
      dispatch(savePaymentMethod(paymentMethod));
      navigate("/placeorder");
    }
  };

  return (
    <FormContainer>
      <CheckoutSteps step1 step2 step3 />
      <h1>Payment Method</h1>
      {message && <Message variant="danger">{message}</Message>}
      
      <Form onSubmit={submitHandler}>
        <Form.Group>
          <Form.Label as="legend" className="my-3">Select Payment Method</Form.Label>
          <Col>
            <Form.Check
              type="radio"
              label={
                <>
                  <img
                    src={gpayLogo}
                    alt="Google Pay"
                    style={{ width: "60px", marginRight: "10px" }}
                  />
                  Google Pay
                </>
              }
              id="Gpay"
              name="paymentMethod"
              value="Gpay"
              checked={paymentMethod === "Gpay"}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="my-2"
            />
            
            <Form.Check
              type="radio"
              label={
                <>
                  <i className="fab fa-cc-paypal" style={{ fontSize: "1.5rem", marginRight: "10px" }}></i>
                  PayPal or Credit Card
                </>
              }
              id="Paypal"
              name="paymentMethod"
              value="PayPal"
              checked={paymentMethod === "PayPal"}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="my-2"
            />
          </Col>
        </Form.Group>

        <Button type="submit" variant="primary" className="mt-4">
          Continue to Order Review
        </Button>
      </Form>
    </FormContainer>
  );
}

export default PaymentScreen;