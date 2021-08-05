import React, { useEffect } from "react";
import {
 Button,
 Row,
 Col,
 ListGroup,
 Image,
 Card,
 ListGroupItem,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import CheckoutSteps from "../components/CheckoutSteps";
import { Link } from "react-router-dom";
import { createOrder } from "../actions/orderActions";

const PlaceOrderScreen = ({ history }) => {
 const dispatch = useDispatch();

 const cart = useSelector((state) => state.cart);

 //  Calculate prices
 const addDecimals = (num) => {
  return (Math.round(num * 100) / 100).toFixed(2);
 };

 cart.itemsPrice = addDecimals(
  cart.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0)
 );
 cart.shippingPrice = addDecimals(cart.itemsPrice > 100 ? 0 : 100);
 cart.taxPrice = addDecimals(Number((0.15 * cart.itemsPrice).toFixed(2)));
 cart.totalPrice = (
  Number(cart.itemsPrice) +
  Number(cart.shippingPrice) +
  Number(cart.taxPrice)
 ).toFixed(2);

 const orderCreate = useSelector((state) => state.orderCreate);
 const { order, success, error } = orderCreate;

 useEffect(() => {
  if (success) {
   history.push(`/order/${order._id}`);
  }
  // eslint-disable-next-line
 }, [history, success]);

 const placeOrderHandler = () => {
  dispatch(
   createOrder({
    orderItems: cart.cartItems,
    shippingAddress: cart.shippingAddress,
    paymentMethod: cart.paymentMethod,
    itemsPrice: cart.itemsPrice,
    shippingPrice: cart.shippingPrice,
    taxPrice: cart.taxPrice,
    totalPrice: cart.totalPrice,
   })
  );
 };

 return (
  <>
   <CheckoutSteps step1 step2 step3 step4 />
   <Row>
    <Col md={8}>
     <ListGroup variant='flush'>
      <ListGroupItem>
       <h2>SHIPPING</h2>
       <p>
        <strong>ADDRESS : </strong>
        {cart.shippingAddress.address},{cart.shippingAddress.city},
        {cart.shippingAddress.postalCode},{cart.shippingAddress.country},
       </p>
      </ListGroupItem>

      <ListGroupItem>
       <h2>PAYMENT METHOD</h2>
       <strong>METHOD : </strong>
       {cart.paymentMethod}
      </ListGroupItem>

      <ListGroupItem>
       <h2>ORDER ITEMS</h2>
       {cart.cartItems.length === 0 ? (
        <Message>Your cart is empty</Message>
       ) : (
        <ListGroup variant='flush'>
         {cart.cartItems.map((item, index) => (
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
         <Col>${cart.itemsPrice}</Col>
        </Row>
       </ListGroupItem>

       <ListGroupItem>
        <Row>
         <Col>SHIPPING</Col>
         <Col>${cart.shippingPrice}</Col>
        </Row>
       </ListGroupItem>
       <ListGroupItem>
        <Row>
         <Col>TAX</Col>
         <Col>${cart.taxPrice}</Col>
        </Row>
       </ListGroupItem>
       <ListGroupItem>
        <Row>
         <Col>TOTAL</Col>
         <Col>${cart.totalPrice}</Col>
        </Row>
       </ListGroupItem>
       <ListGroupItem>
        {error && <Message variant='danger'>{error}</Message>}
       </ListGroupItem>
       <ListGroupItem>
        <Button
         type='button'
         className='btn-block'
         disabled={cart.cartItems === 0}
         onClick={placeOrderHandler}
        >
         Place Order
        </Button>
       </ListGroupItem>
      </ListGroup>
     </Card>
    </Col>
   </Row>
  </>
 );
};

export default PlaceOrderScreen;
