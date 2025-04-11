import React, { useEffect } from 'react'
import { Button, Row, Col, ListGroup, Image, Card } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import CheckoutSteps from '../components/CheckoutSteps'
import { createOrder } from '../actions/orderActions'
import { ORDER_CREATE_RESET } from '../constants/orderConstants'
import { clearCart } from '../actions/cartActions'

function PlaceOrderScreen() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    
    const { order, success, error } = useSelector(state => state.orderCreate)
    const { cartItems, shippingAddress, paymentMethod } = useSelector(state => state.cart)

    // Calculate prices using useEffect to prevent side effects during render
    useEffect(() => {
        if (!paymentMethod) navigate('/payment')
    }, [paymentMethod, navigate])

    const calculatePrices = () => {
        const itemsPrice = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0)
        const shippingPrice = itemsPrice > 100 ? 0 : 10
        const taxPrice = 0.082 * itemsPrice
        const totalPrice = itemsPrice + shippingPrice + taxPrice
        
        return {
            itemsPrice: itemsPrice.toFixed(2),
            shippingPrice: shippingPrice.toFixed(2),
            taxPrice: taxPrice.toFixed(2),
            totalPrice: totalPrice.toFixed(2)
        }
    }

    const { itemsPrice, shippingPrice, taxPrice, totalPrice } = calculatePrices()

    useEffect(() => {
        if (success && order) {
            navigate(`/order/${order._id}`)
            dispatch({ type: ORDER_CREATE_RESET })
            dispatch(clearCart())
        }
    }, [success, navigate, dispatch, order])

    const placeOrderHandler = () => {
        dispatch(createOrder({
            orderItems: cartItems,
            shippingAddress,
            paymentMethod,
            itemsPrice,
            shippingPrice,
            taxPrice,
            totalPrice
        }))
    }

    return (
        <div>
            <CheckoutSteps step1 step2 step3 step4 />
            <Row>
                <Col md={8}>
                    <ListGroup variant='flush'>
                        <ListGroup.Item>
                            <h2>Shipping</h2>
                            <p>
                                <strong>Address:</strong> {shippingAddress.address}, {shippingAddress.city}, 
                                {shippingAddress.postalcode}, {shippingAddress.country}
                            </p>
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <h2>Payment Method</h2>
                            <p><strong>Method:</strong> {paymentMethod}</p>
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <h2>Order Items</h2>
                            {cartItems.length === 0 ? (
                                <Message variant='info'>Your cart is empty</Message>
                            ) : (
                                <ListGroup variant='flush'>
                                    {cartItems.map((item, index) => (
                                        <ListGroup.Item key={index}>
                                            <Row>
                                                <Col md={1}>
                                                    <Image src={item.image} alt={item.name} fluid rounded />
                                                </Col>
                                                <Col>
                                                    <Link to={`/product/${item.product}`}>{item.name}</Link>
                                                </Col>
                                                <Col md={4}>
                                                    {item.qty} × ${item.price} = ${(item.qty * item.price).toFixed(2)}
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
                        <ListGroup variant='flush'>
                            <ListGroup.Item>
                                <h2>Order Summary</h2>
                            </ListGroup.Item>
                            
                            <PriceRow label="Items" value={itemsPrice} />
                            <PriceRow label="Shipping" value={shippingPrice} />
                            <PriceRow label="Tax" value={taxPrice} />
                            <PriceRow label="Total" value={totalPrice} />

                            <ListGroup.Item>
                                {error && <Message variant='danger'>{error}</Message>}
                                <Button
                                    type="button"
                                    className="btn-block"
                                    disabled={cartItems.length === 0}
                                    onClick={placeOrderHandler}
                                >
                                    Place Order
                                </Button>
                            </ListGroup.Item>
                        </ListGroup>
                    </Card>
                </Col>
            </Row>
        </div>
    )
}

const PriceRow = ({ label, value }) => (
    <ListGroup.Item>
        <Row>
            <Col>{label}:</Col>
            <Col>${value}</Col>
        </Row>
    </ListGroup.Item>
)

export default PlaceOrderScreen