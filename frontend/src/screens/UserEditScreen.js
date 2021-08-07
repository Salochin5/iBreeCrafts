import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import Loader from "../components/Loader";
import FormContainer from "../components/FormContainer";
import { getUserDetails, updateUser } from "../actions/userActions";
import { USER_UPDATE_RESET } from "../constants/userConstants";

const UserEditScreen = ({ match, history }) => {
 const userId = match.params.id;

 const [name, setName] = useState("");
 const [email, setEmail] = useState("");
 const [isAdmin, setIsAdmin] = useState(false);
 const [password, setPassword] = useState("");
 const [confirmPassword, setConfirmPassword] = useState("");

 const dispatch = useDispatch();

 const userDetails = useSelector((state) => state.userDetails);
 const { loading, error, user } = userDetails;

 const userUpdate = useSelector((state) => state.userUpdate);
 const {
  loading: loadingUpdate,
  error: errorUpdate,
  success: successUpdate,
 } = userUpdate;

 useEffect(() => {
  if (successUpdate) {
   dispatch({ type: USER_UPDATE_RESET });
   history.push("/admin/userlist");
  } else {
   if (!user.name || user._id !== userId) {
    dispatch(getUserDetails(userId));
   } else {
    setName(user.name);
    setEmail(user.email);
    setPassword(user.password);
    setIsAdmin(user.isAdmin);
   }
  }
 }, [dispatch, history, userId, user, successUpdate]);

 const submitHandler = (e) => {
  e.preventDefault();
  dispatch(updateUser({ _id: userId, name, email, isAdmin }));
 };

 return (
  <>
   <Link to='/admin/userlist' className='btn btn-light my-3'>
    Go Back
   </Link>
   <FormContainer>
    <h1>EDIT USER</h1>
    {loadingUpdate && <Loader />}
    {errorUpdate && <Message variant='danger'>{errorUpdate}</Message>}
    {loading ? (
     <Loader />
    ) : error ? (
     <Message variant='danger'>{error}</Message>
    ) : (
     <Form onSubmit={submitHandler}>
      <Form.Group controlId='name'>
       <Form.Label>Name</Form.Label>
       <Form.Control
        type='name'
        placeholder='Enter name'
        value={name}
        onChange={(e) => setName(e.target.value)}
       ></Form.Control>
      </Form.Group>
      <Form.Group controlId='email'>
       <Form.Label>Email Address</Form.Label>
       <Form.Control
        type='email'
        placeholder='Enter email'
        value={email}
        onChange={(e) => setEmail(e.target.value)}
       ></Form.Control>
      </Form.Group>

      <Form.Group controlId='password'>
       <Form.Label>Password</Form.Label>
       <Form.Control
        type='password'
        placeholder='Enter password'
        value={password}
        onChange={(e) => setPassword(e.target.value)}
       ></Form.Control>
      </Form.Group>

      <Form.Group controlId='confirmpassword'>
       <Form.Label>Confirm assword</Form.Label>
       <Form.Control
        type='password'
        placeholder='Confirm password'
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
       ></Form.Control>
      </Form.Group>

      <Form.Group controlId='isadmin'>
       <Form.Check
        type='checkbox'
        label='Set as +Admin'
        checked={isAdmin}
        onChange={(e) => setIsAdmin(e.target.checked)}
       ></Form.Check>
      </Form.Group>

      <Button type='submit' variant='primary'>
       Update
      </Button>
     </Form>
    )}
   </FormContainer>
  </>
 );
};

export default UserEditScreen;