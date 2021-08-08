import React, { useState } from "react";
import { Form, FormControl } from "react-bootstrap";

const SearchBox = ({ history }) => {
 const [keyword, setKeyword] = useState("");

 const submitHandler = (e) => {
  e.preventDefault();
  if (keyword.trim()) {
   history.push(`/search/${keyword}`);
  } else {
   history.push("/");
  }
 };

 return (
  <Form
   onSubmit={submitHandler}
   className='d-sm-flex'
   style={{ position: "absolute", left: "50%" }}
  >
   <FormControl
    type='text'
    name='q'
    onChange={(e) => setKeyword(e.target.value)}
    placeholder='Search Products...'
    className=''
    style={{ borderRadius: "5%", marginRight: "15px" }}
   ></FormControl>
   <button type='submit' className='btn btn-outline-success my-2 my-sm-0'>
    Search
   </button>
  </Form>
 );
};

export default SearchBox;
