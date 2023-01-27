import { useDisclosure } from "@chakra-ui/hooks";
import { ViewIcon } from "@chakra-ui/icons";
import { Button, IconButton, Image, Text } from "@chakra-ui/react";
import {
   Modal,
   ModalOverlay,
   ModalContent,
   ModalHeader,
   ModalFooter,
   ModalBody,
   ModalCloseButton,
} from '@chakra-ui/react'

const ProfileModal = ({ user, children }) => {
   const { isOpen, onOpen, onClose } = useDisclosure();
   return (
      <>
         {children ?
            (<span onClick={onOpen}>{children}</span>) :
            (<IconButton
               display={{ base: 'flex' }}
               icon={<ViewIcon />}
               onClick={onOpen}
            />)
         }
         <Modal size="lg" isOpen={isOpen} onClose={onClose} isCentered>
            <ModalOverlay />
            <ModalContent height="450px">
               <ModalHeader
                  fontSize="40px"
                  fontFamily="Work sans"
                  d="flex"
                  justifyContent="center"
               >{user.name}</ModalHeader>
               <ModalCloseButton />
               <ModalBody
                  display="flex"
                  flexDir="column"
                  justifyContent="space-between"
                  alignItems="center"
               >
                  <Image
                     borderRadius="full"
                     boxSize="150px"
                     src={user.pic}
                     alt={user.name}
                  />
                  <Text
                     fontSize={{ base: "28px", md: "30px" }}
                     fontFamily="Work sans"
                  >
                     Email: {user.email}
                  </Text>
               </ModalBody>
               <ModalFooter>
                  <Button colorScheme='blue' mr={3} onClick={onClose}>
                     Close
                  </Button>
               </ModalFooter>
            </ModalContent>
         </Modal>
      </>
   )
}

export default ProfileModal;