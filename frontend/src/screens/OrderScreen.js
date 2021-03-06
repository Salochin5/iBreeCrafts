import React, { useState, useEffect } from "react";
import axios from "axios";
import { PayPalButton } from "react-paypal-button-v2";
import {
 Row,
 Col,
 ListGroup,
 Image,
 Card,
 ListGroupItem,
 Button,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { Link } from "react-router-dom";
import {
 getOrderDetails,
 payOrder,
 deliverOrder,
} from "../actions/orderActions";
import {
 ORDER_PAY_RESET,
 ORDER_DELIVER_RESET,
} from "../constants/orderConstants";

const OrderScreen = ({ match, history }) => {
 const orderId = match.params.id;

 const [sdkReady, setSdkReady] = useState(false);

 const dispatch = useDispatch();

 const orderDetails = useSelector((state) => state.orderDetails);
 const { order, loading, error } = orderDetails;

 const userLogin = useSelector((state) => state.userLogin);
 const { userInfo } = userLogin;

 const orderPay = useSelector((state) => state.orderPay);
 const { loading: loadingPay, success: successPay } = orderPay;

 const orderDeliver = useSelector((state) => state.orderDeliver);
 const { loading: loadingDeliver, success: successDeliver } = orderDeliver;

 if (!loading) {
  //  Calculate prices
  const addDecimals = (num) => {
   return (Math.round(num * 100) / 100).toFixed(2);
  };

  order.itemsPrice = addDecimals(
   order.orderItems.reduce((acc, item) => acc + item.price * item.qty, 0)
  );
 }

 useEffect(() => {
  if (!userInfo) {
   history.push("/login");
  }

  const addPayPalScript = async () => {
   const { data: clientId } = await axios.get("/api/config/paypal");
   const script = document.createElement("script");
   script.type = "text/javascript";
   script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}`;
   script.async = true;
   script.onload = () => {
    setSdkReady(true);
   };
   document.body.appendChild(script);
  };

  if (!order || order._id !== orderId) {
   dispatch(getOrderDetails(orderId));
  }

  if (!order || successPay || successDeliver) {
   dispatch({ type: ORDER_PAY_RESET });
   dispatch({ type: ORDER_DELIVER_RESET });
   dispatch(getOrderDetails(orderId));
  } else if (!order.isPaid) {
   if (!window.paypal) {
    addPayPalScript();
   } else {
    setSdkReady(true);
   }
  }
 }, [dispatch, orderId, successPay, successDeliver, order, history, userInfo]);

 const successPaymentHandler = (paymentResult) => {
  console.log(paymentResult);
  dispatch(payOrder(orderId, paymentResult));
 };

 const deliverHandler = () => {
  dispatch(deliverOrder(order));
 };

 return loading ? (
  <Loader />
 ) : error ? (
  <Message variant='danger'>{error}</Message>
 ) : (
  <>
   <h1>ORDER : {order._id}</h1>
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
       {order.orderItems.length === 0 ? (
        <Message>Order is empty</Message>
       ) : (
        <ListGroup variant='flush'>
         {order.orderItems.map((item, index) => (
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
       {!order.isPaid && (
        <ListGroupItem>
         {loadingPay && <Loader />}
         {!sdkReady ? (
          <Loader />
         ) : (
          <PayPalButton
           amount={order.totalPrice}
           onSuccess={successPaymentHandler}
          />
         )}
        </ListGroupItem>
       )}
       {loadingDeliver && <Loader />}
       {userInfo && userInfo.isAdmin && order.isPaid && !order.isDelivered && (
        <ListGroupItem>
         <Button
          type='button'
          className='btn btn-block my-2'
          onClick={deliverHandler}
         >
          Mark As Delivered
         </Button>
        </ListGroupItem>
       )}
      </ListGroup>
     </Card>
    </Col>
   </Row>
  </>
 );
};

export default OrderScreen;
