import {
  Avatar,
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  IconButton,
  Text,
  useColorMode,
  useColorModeValue,
} from '@chakra-ui/react';
import { FiClock, FiMoon, FiSun } from 'react-icons/fi';

export interface HeaderProps {
  onOpenHistory: () => void;
}

const Header = ({ onOpenHistory }: HeaderProps) => {
  const { colorMode, toggleColorMode } = useColorMode();
  const headerBg = useColorModeValue('whiteAlpha.100', 'rgba(15, 23, 42, 0.8)');

  return (
    <Flex
      as="header"
      align="center"
      justify="space-between"
      p={6}
      borderBottomWidth="1px"
      borderColor="slate.800"
      bg={headerBg}
      backdropFilter="blur(14px)"
      position="sticky"
      top={0}
      zIndex={10}
    >
      <Box>
        <Heading size="lg" color="slate.100">
          Project NEXUS
        </Heading>
        <Text color="slate.400">Autonomous development assistant</Text>
      </Box>
      <HStack spacing={4}>
        <Button leftIcon={<FiClock />} variant="outline" onClick={onOpenHistory}>
          History
        </Button>
        <IconButton
          aria-label="Toggle color mode"
          icon={colorMode === 'dark' ? <FiSun /> : <FiMoon />}
          onClick={toggleColorMode}
          variant="ghost"
        />
        <Avatar size="sm" name="NEXUS" bg="brand.500" color="white" />
      </HStack>
    </Flex>
  );
};

export default Header;
