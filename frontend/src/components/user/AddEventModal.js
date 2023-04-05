import { useDisclosure } from "@chakra-ui/hooks";
import {
   Modal,
   ModalOverlay,
   ModalContent,
   ModalHeader,
   ModalFooter,
   ModalBody,
   ModalCloseButton,
   Button,
   FormControl,
   Input,
   Box,
   Text,
   VStack,
   StackDivider
} from '@chakra-ui/react'
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { ChatContext } from "../../contexts/ChatContext";

const AddEventModal = ({ newEvent, setNewEvent, submitEvent,selectedChat, children }) => {
   const { isOpen, onOpen, onClose } = useDisclosure();

   return (
      <div
         className="calendar"
      >
         <span className="calendar_icon" onClick={onOpen}>{children}</span>
         <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
               <ModalHeader>Add an event</ModalHeader>
               <ModalCloseButton />
               <ModalBody>
                  <VStack
                     divider={<StackDivider borderColor='blackAlpha.300' />}
                     spacing={4}
                     align='stretch'
                  >
                     <Text
                     >
                        Showing calender for chat: {`${selectedChat.chatName}`}
                     </Text>
                     <FormControl
                        style={{
                           backgroundColor: 'white'
                        }}
                        padding="10px"
                        width="100%"
                     >
                        <Input
                           type="text"
                           onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                           placeholder="Add event title"
                           marginBottom="10px"
                           w="100%"
                        />
                        <Box
                           display="flex"
                           justifyContent="center"
                           alignItems="center"
                           gap="1px"
                           marginX="auto"
                           border="1px"
                           borderColor="blackAlpha.400"
                           marginBottom="10px"
                           borderRadius="5px"
                           w="100%"
                        >
                           <DatePicker
                              selected={newEvent.start}
                              onChange={(start) => setNewEvent({ 
                                 ...newEvent, 
                                 start: new Date(Date.parse(start)) 
                              })}
                              placeholderText="Start date"
                           />
                           <DatePicker
                              selected={newEvent.end}
                              onChange={(end) => setNewEvent({ 
                                 ...newEvent, 
                                 end: new Date(Date.parse(end)) 
                              })}
                              placeholderText="End date"
                           />
                        </Box>
                     </FormControl>
                  </VStack>
               </ModalBody>

               <ModalFooter>
                  <Button colorScheme='blue' mr={3} onClick={onClose}>
                     Close
                  </Button>
                  <Button
                     onClick={submitEvent}
                     colorScheme='teal'
                  >
                     Add
                  </Button>
               </ModalFooter>
            </ModalContent>
         </Modal>
      </div>
   )
}

export default AddEventModal;