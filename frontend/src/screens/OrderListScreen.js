import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';
import { Table, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../components/loader';
import Message from '../components/Message';
import { listOrders } from '../actions/orderActions';

function OrderListScreen() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const orderList = useSelector((state) => state.orderList);
    const { loading, error, orders } = orderList;

    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin;

    useEffect(() => {
        if (userInfo?.isAdmin) {
            dispatch(listOrders());
        } else {
            navigate('/login');
        }
    }, [dispatch, navigate, userInfo]);

    return (
        <div className="container mt-4">
            <h1 className="mb-4">Orders</h1>
            {loading ? (
                <Loader />
            ) : error ? (
                <Message variant="danger">{error}</Message>
            ) : (
                <Table striped bordered hover responsive className="table-sm">
                    <thead className="table-dark">
                        <tr>
                            <th>ID</th>
                            <th>USER</th>
                            <th>DATE</th>
                            <th>TOTAL</th>
                            <th>PAID</th>
                            <th>DELIVERED</th>
                            <th>ACTIONS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders?.map((order) => (
                            <tr key={order._id}>
                                <td>{order._id}</td>
                                <td>{order.user?.name}</td>
                                <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                                <td>${order.totalPrice}</td>
                                <td className="text-center">
                                    {order.isPaid ? (
                                        new Date(order.paidAt).toLocaleDateString()
                                    ) : (
                                        <i className="fas fa-times text-danger" />
                                    )}
                                </td>
                                <td className="text-center">
                                    {order.isDelivered ? (
                                        new Date(order.deliveredAt).toLocaleDateString()
                                    ) : (
                                        <i className="fas fa-times text-danger" />
                                    )}
                                </td>
                                <td className="text-center">
                                    <LinkContainer to={`/order/${order._id}`}>
                                        <Button variant="info" size="sm">
                                            <i className="fas fa-edit" /> Details
                                        </Button>
                                    </LinkContainer>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}
        </div>
    );
}

export default OrderListScreen;