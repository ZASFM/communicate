import { VStack } from '@chakra-ui/react';
import { FormControl, FormLabel } from '@chakra-ui/form-control';
import { Input, InputGroup, InputRightElement, Button } from '@chakra-ui/react';
import { useState } from 'react';
import { useToast } from '@chakra-ui/react'
import axios from 'axios';
import {useNavigate} from 'react-router-dom';

const Signup = () => {
   const [credentials, setCredentials] = useState({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      pic:"",
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
            [name]:value
         }
      })
   }

   const handleImage=(pics)=>{
      if(pics===undefined){
         toast({
            title: 'Please select an image.',
            status: 'warning',
            duration: 5000,
            isClosable: true,
            position:"bottom"
          })
          return;
      }
      if(pics.type==="image/jpg" || pics.type==='image/png'){
         const data=new FormData();
         data.append('file',pics);
         data.append('upload_preset','chat app');
         data.append('cloud_name','di8lopecw');
         fetch('https://api.cloudinary.com/v1_1/di8lopecw/image/upload',{
            method:'POST',
            body:data,
         }).then((res)=>res.json())
           .then((data)=>setCredentials(preVal=>{
               return {
                  ...preVal,
                  pic:data.url.toString()
               }
           }))
           .catch(err=>console.log(err));
      }else{
         toast({
            title: 'Please select an image.',
            status: 'warning',
            duration: 5000,
            isClosable: true,
            position:"bottom"
          })
          return;
      }
   }

   const submitHandler = async(e) => {
      e.preventDefault();
      if(credentials.password!==credentials.confirmPassword){
         toast({
            title: 'Passwords do not match.',
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
         const {data}=await axios.post('http://localhost:5000/api/v1/user/signup',{
           ...credentials  
         },config);
         toast({
            title: 'Registration successful',
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
         <FormControl id="first-name" isRequired>
            <FormLabel>Name</FormLabel>
            <Input
               placeholder='name'
               onChange={handleChange}
               name="name"
            />
         </FormControl>

         <FormControl id="email" isRequired>
            <FormLabel>Email</FormLabel>
            <Input
               placeholder='email'
               onChange={handleChange}
               name="email"
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
               />
               <InputRightElement width="4.5rem">
                  <Button h="1.75rem" size="sm" onClick={handleClick}>
                     {show ? "Hide" : "Show"}
                  </Button>
               </InputRightElement>
            </InputGroup>
         </FormControl>

         <FormControl id="confirmPassword" isRequired>
            <FormLabel>Confirm Password</FormLabel>
            <InputGroup>
               <Input
                  type={show ? "text" : "password"}
                  placeholder='confirm password'
                  onChange={handleChange}
                  name="confirmPassword"
               />
               <InputRightElement width="4.5rem">
                  <Button h="1.75rem" size="sm" onClick={handleClick}>
                     {show ? "Hide" : "Show"}
                  </Button>
               </InputRightElement>
            </InputGroup>
         </FormControl>

         <FormControl id="pic">
            <FormLabel>Upload your Picture</FormLabel>
            <Input
               type="file"
               p={1.5}
               accept="image/*"
               onChange={(e)=>handleImage(e.target.files[0])}
               name="pic"
            />
         </FormControl>

         <Button
            colorScheme="blue"
            width="100%"
            style={{ marginTop: 15 }}
            onClick={submitHandler}
         >
            Sign Up
         </Button>
      </VStack>
   )
}

export default Signup