import { VStack } from '@chakra-ui/react';
import { FormControl, FormLabel } from '@chakra-ui/form-control';
import { Input, InputGroup, InputRightElement, Button } from '@chakra-ui/react';
import { useState } from 'react';

const Login = () => {
   const [credentials, setCredentials] = useState({
      email: "",
      password: "",
   })
   const [show, setShow] = useState(false);

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

   const submitHandler = (e) => {
      e.preventDefault();
      console.log(credentials);
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