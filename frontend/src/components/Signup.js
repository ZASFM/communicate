import { VStack } from '@chakra-ui/react';
import { FormControl, FormLabel } from '@chakra-ui/form-control';
import { Input, InputGroup, InputRightElement, Button } from '@chakra-ui/react';
import { useState } from 'react';
const Signup = () => {
   const [crednetials, setCredentials] = useState({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      pic: {},
   })
   const [show, setShow] = useState(false);

   const handleClick = () => {
      setShow(preVal => !preVal)
   }

   const handleChange = (e) => {
      const { value, name, type, files } = e.target;
      setCredentials(preVal => {
         return {
            ...preVal,
            [name]: type === "file" ? e.target.files[0] : value
         }
      })
   }

   const submitHandler = (e) => {
      e.preventDefault();
      console.log(crednetials);
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
               onChange={handleChange}
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