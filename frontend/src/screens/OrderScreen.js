import React, { useEffect } from "react";
import {
 Row,
 Col,
 ListGroup,
 Image,
 Card,
 ListGroupItem,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { Link } from "react-router-dom";
import { getOrderDetails } from "../actions/orderActions";

const OrderScreen = ({ match }) => {
 const orderId = match.params.id;

 const dispatch = useDispatch();

 const orderDetails = useSelector((state) => state.orderDetails);
 const { order, loading, error } = orderDetails;
 if (!loading) {
  //  Calculate prices
  const addDecimals = (num) => {
   return (Math.round(num * 100) / 100).toFixed(2);
  };

  order.itemsPrice = addDecimals(
   order.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0)
  );
 }

 useEffect(() => {
  dispatch(getOrderDetails(orderId));
 }, []);

 return loading ? (
  <Loader />
 ) : error ? (
  <Message variant='danger'>{error}</Message>
 ) : (
  <>
   <h1>Order {order._id}</h1>
   <Row>
    <Col md={8}>
     <ListGroup variant='flush'>
      <ListGroupItem>
       <h2>SHIPPING</h2>
       <p>
        <strong>NAME : </strong> {order.user.name}
       </p>
       <p>
        <strong>EMAIL : </strong>{" "}
        <a href={`mailto:${order.user.email}`}>{order.user.email}</a>
       </p>
       <p>
        <strong>ADDRESS : </strong>
        {order.shippingAddress.address},{order.shippingAddress.city},
        {order.shippingAddress.postalCode},{order.shippingAddress.country},
       </p>
       {order.isDelivered ? (
        <Message variant='success'>Delivered on : {order.deliveredAt}</Message>
       ) : (
        <Message variant='danger'>Not Delivered</Message>
       )}
      </ListGroupItem>

      <ListGroupItem>
       <h2>PAYMENT METHOD</h2>
       <p>
        <strong>METHOD : </strong>
        {order.paymentMethod}
       </p>
       {order.isPaid ? (
        <Message variant='success'>Paid on : {order.paidAt}</Message>
       ) : (
        <Message variant='danger'>Not Paid</Message>
       )}
      </ListGroupItem>

      <ListGroupItem>
       <h2>ORDER ITEMS</h2>
       {order.order.Items.length === 0 ? (
        <Message>Order is empty</Message>
       ) : (
        <ListGroup variant='flush'>
         {order.order.Items.map((item, index) => (
          <ListGroupItem key={index}>
           <Row>
            <Col md={1}>
             <Image src={item.image} alt={item.name} fluid rounded />
            </Col>
            <Col>
             <Link to={`/product/${item.product}`}>{item.name}</Link>
            </Col>
            <Col md={4}>
             {item.qty} X ${item.price} = ${item.qty * item.price}
            </Col>
           </Row>
          </ListGroupItem>
         ))}
        </ListGroup>
       )}
      </ListGroupItem>
     </ListGroup>
    </Col>
    <Col md={4}>
     <Card>
      <ListGroup variant='flush'>
       <ListGroupItem>
        <h2>ORDER SUMMARY</h2>
       </ListGroupItem>
       <ListGroupItem>
        <Row>
         <Col>ITEMS</Col>
         <Col>${order.itemsPrice}</Col>
        </Row>
       </ListGroupItem>

       <ListGroupItem>
        <Row>
         <Col>SHIPPING</Col>
         <Col>${order.shippingPrice}</Col>
        </Row>
       </ListGroupItem>
       <ListGroupItem>
        <Row>
         <Col>TAX</Col>
         <Col>${order.taxPrice}</Col>
        </Row>
       </ListGroupItem>
       <ListGroupItem>
        <Row>
         <Col>TOTAL</Col>
         <Col>${order.totalPrice}</Col>
        </Row>
       </ListGroupItem>
      </ListGroup>
     </Card>
    </Col>
   </Row>
  </>
 );
};

export default OrderScreen;
