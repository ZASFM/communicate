import { VStack } from '@chakra-ui/react';
import { FormControl, FormLabel } from '@chakra-ui/form-control';
import { Input, InputGroup, InputRightElement, Button } from '@chakra-ui/react';
import { useState } from 'react';
import { useToast } from '@chakra-ui/react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
   const [credentials, setCredentials] = useState({
      email: "",
      password: "",
   })
   const [show, setShow] = useState(false);
   const toast=useToast();
   const navigate=useNavigate();

   const handleClick = () => {
      setShow(preVal => !preVal)
   }

   const handleChange = (e) => {
      const { value, name } = e.target;
      setCredentials(preVal => {
         return {
            ...preVal,
            [name]: value
         }
      })
   }

   const handleGuest = () => {
      setCredentials(preVal => {
         return {
            email: "guest@example.com",
            password: "123456"
         }
      })
   }

   const submitHandler = async(e) => {
      e.preventDefault();
      if(!credentials.email || !credentials.password){
         toast({
            title: 'Password is not correct',
            status: 'warning',
            duration: 5000,
            isClosable: true,
            position:"bottom"
          })
          return;  
      }
      try{
         const config={
            headers:{
               'Content-Type':'application/json'
            }
         }
         const {data}=await axios.post('http://localhost:5000/api/v1/user/login',{
           ...credentials  
         },config);
         toast({
            title: 'Login successful',
            status: 'success',
            duration: 5000,
            isClosable: true,
            position:"bottom"
          });
          localStorage.setItem('userinfo',JSON.stringify(data));
          navigate('/chats');
      }
      catch(err){ 
         console.log(err);
         toast({
            title: 'Error occurred.',
            description:'Could not login',
            status: 'error',
            duration: 5000,
            isClosable: true,
            position:"bottom"
          })
      }
   }
   return (
      <VStack spacing="5px">
         <FormControl id="email" isRequired>
            <FormLabel>Email</FormLabel>
            <Input
               placeholder='email'
               onChange={handleChange}
               name="email"
               value={credentials.email}
            />
         </FormControl>

         <FormControl id="password" isRequired>
            <FormLabel>Password</FormLabel>
            <InputGroup>
               <Input
                  type={show ? "text" : "password"}
                  placeholder='password'
                  onChange={handleChange}
                  name="password"
                  value={credentials.password}
               />
               <InputRightElement width="4.5rem">
                  <Button h="1.75rem" size="sm" onClick={handleClick}>
                     {show ? "Hide" : "Show"}
                  </Button>
               </InputRightElement>
            </InputGroup>
         </FormControl>

         <Button
            colorScheme="blue"
            width="100%"
            style={{ marginTop: 15 }}
            onClick={submitHandler}
         >
            Login
         </Button>
         <Button
            variant="solid"
            colorScheme="red"
            width="100%"
            onClick={handleGuest}
         >
            Login in as a guest
         </Button>
      </VStack>
   )
}

export default Login