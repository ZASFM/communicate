import { Container, Box, Text, Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'
import Signup from '../components/auth/Signup';
import Login from '../components/auth/Login';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate=useNavigate();
  
  useEffect(()=>{
    const userInfo=JSON.parse(localStorage.getItem('userinfo'));
    if(userInfo){
      navigate('chats/');
    }
  },[navigate])

  return (
    <Container maxW="xl" centerContent>
      <Box
        d="flex"
        justifyContent="center"
        p={3}
        bg={"white"}
        w="100%"
        m="40px 0 15px 0"
        borderRadius="lg"
        borderWidth="1px"
      >
        <Text fontSize="4xl" fontFamily="Work sans" color="black">
          Hi
        </Text>
      </Box>
      <Box bg="white" w="100%" p={4} borderRadius="lg" borderWidth="1px">
        <Tabs variant='soft-rounded' colorScheme='green'>
          <TabList mb="1em">
            <Tab width="50%">Login</Tab>
            <Tab width="50%">Signup</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Login/>
            </TabPanel>
            <TabPanel>
              <Signup/>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
}

export default HomePage;
