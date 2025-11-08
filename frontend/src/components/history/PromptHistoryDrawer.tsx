import {
  Badge,
  Box,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  HStack,
  Icon,
  IconButton,
  Stack,
  Text,
  Tooltip,
  useColorModeValue,
} from '@chakra-ui/react';
import { FiClock, FiRefreshCcw, FiTrash2 } from 'react-icons/fi';
import { PromptHistoryItem } from '../../hooks/useTaskGeneration';
import { Task } from '~shared/types';

export interface PromptHistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: PromptHistoryItem[];
  onRestore: (prompt: string) => void;
  onClear: () => void;
}

const renderStatusBadge = (item: PromptHistoryItem) => {
  const statusColors: Record<PromptHistoryItem['status'], string> = {
    success: 'green',
    error: 'red',
    pending: 'yellow',
  };

  const labels: Record<PromptHistoryItem['status'], string> = {
    success: 'Completed',
    error: 'Failed',
    pending: 'In Progress',
  };

  return (
    <Badge colorScheme={statusColors[item.status]} rounded="full" px={2} py={1} textTransform="none">
      {labels[item.status]}
    </Badge>
  );
};

const TaskSummary = ({ tasks }: { tasks?: Task[] }) => {
  if (!tasks?.length) return null;
  return (
    <Text fontSize="sm" color="slate.300">
      Generated {tasks.length} tasks · Avg confidence{' '}
      {Math.round(tasks.reduce((sum, task) => sum + task.confidence, 0) / tasks.length)}%
    </Text>
  );
};

const PromptHistoryDrawer = ({ isOpen, onClose, items, onRestore, onClear }: PromptHistoryDrawerProps) => {
  const bg = useColorModeValue('white', 'slate.800');

  return (
    <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="md">
      <DrawerOverlay />
      <DrawerContent bg={bg} data-testid="prompt-history">
        <DrawerCloseButton />
        <DrawerHeader borderBottomWidth="1px">
          Recent prompts
        </DrawerHeader>

        <DrawerBody>
          <Stack spacing={4}>
            {items.length === 0 && (
              <Text color="slate.400">Run your first generation to see history here.</Text>
            )}
            {items.map((item) => (
              <Box key={item.id} borderWidth="1px" borderRadius="lg" p={4} bg="slate.900">
                <HStack justify="space-between" align="start" mb={2} spacing={4}>
                  <HStack spacing={2} color="slate.300">
                    <Icon as={FiClock} />
                    <Text fontSize="sm">{new Date(item.createdAt).toLocaleString()}</Text>
                  </HStack>
                  {renderStatusBadge(item)}
                </HStack>
                <Text fontWeight="semibold" color="slate.100" mb={2}>
                  {item.prompt}
                </Text>
                {item.errorMessage && (
                  <Text fontSize="sm" color="red.300">
                    {item.errorMessage}
                  </Text>
                )}
                <TaskSummary tasks={item.tasks} />
                <HStack mt={4} spacing={2}>
                  <Tooltip label="Regenerate" placement="top">
                    <IconButton
                      aria-label="Regenerate prompt"
                      icon={<FiRefreshCcw />}
                      size="sm"
                      onClick={() => onRestore(item.prompt)}
                    />
                  </Tooltip>
                </HStack>
              </Box>
            ))}
          </Stack>
        </DrawerBody>

        <DrawerFooter borderTopWidth="1px">
          <Tooltip label="Clear history">
            <IconButton aria-label="Clear history" icon={<FiTrash2 />} variant="ghost" onClick={onClear} />
          </Tooltip>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default PromptHistoryDrawer;
