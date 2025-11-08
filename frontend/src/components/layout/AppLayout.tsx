import { ReactNode, useState } from 'react';
import { Box, Flex } from '@chakra-ui/react';
import Header from './Header';
import PromptHistoryDrawer from '../history/PromptHistoryDrawer';
import { PromptHistoryItem } from '../../hooks/useTaskGeneration';

export interface AppLayoutProps {
  children: ReactNode;
  historyItems?: PromptHistoryItem[];
  onRestorePrompt?: (prompt: string) => void;
  onClearHistory?: () => void;
}

const AppLayout = ({ children, historyItems = [], onRestorePrompt, onClearHistory }: AppLayoutProps) => {
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  return (
    <Flex direction="column" minH="100vh" bgGradient="linear(to-br, slate.900, slate.800)">
      <Header onOpenHistory={() => setIsHistoryOpen(true)} />
      <Box as="main" flex="1" px={{ base: 4, md: 10 }} py={10}>
        {children}
      </Box>
      <PromptHistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        items={historyItems}
        onRestore={(prompt) => {
          onRestorePrompt?.(prompt);
          setIsHistoryOpen(false);
        }}
        onClear={() => onClearHistory?.()}
      />
    </Flex>
  );
};

export default AppLayout;
