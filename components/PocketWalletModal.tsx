import {
  Button,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  VStack,
} from '@chakra-ui/react';
import { formatUnits } from 'viem';

import { usePocketWallet } from '@/contexts/PocketWallet';

import { HashDisplay } from './HashDisplay';

export const PocketWalletModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  const { poktAddress, poktNetwork, poktBalance, resetPoktWallet } =
    usePocketWallet();

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <HStack align="center" justify="center">
            <Text>Pocket Wallet</Text>
          </HStack>
          <ModalCloseButton />
        </ModalHeader>
        <ModalBody>
          <VStack spacing="4" pb="4">
            <HashDisplay chainId={poktNetwork}>{poktAddress}</HashDisplay>
            <Text>
              Network:{' '}
              <Text as="span" fontWeight="bold">
                {poktNetwork}
              </Text>
            </Text>
            <HStack>
              <Text>
                Balance:{' '}
                <Text as="span" fontWeight="bold">
                  {formatUnits(poktBalance, 6)} POKT
                </Text>
              </Text>
            </HStack>
            <Button
              colorScheme="blue"
              onClick={() => {
                resetPoktWallet();
                onClose();
              }}
            >
              Disconnect
            </Button>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
