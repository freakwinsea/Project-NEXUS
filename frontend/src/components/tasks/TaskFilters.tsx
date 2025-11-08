import {
  Box,
  Button,
  Grid,
  GridItem,
  HStack,
  Icon,
  Input,
  Select,
  Stat,
  StatHelpText,
  StatLabel,
  StatNumber,
  Text,
} from '@chakra-ui/react';
import { FiBarChart2 } from 'react-icons/fi';
import { TaskCategory, TaskStatus } from '~shared/types';

export type StatusFilter = TaskStatus | 'all';
export type CategoryFilter = TaskCategory | 'all';

export interface TaskMetrics {
  confidenceAverage: number;
  byStatus: Record<string, number>;
}

export interface TaskFiltersProps {
  status: StatusFilter;
  category: CategoryFilter;
  search: string;
  metrics: TaskMetrics | null;
  onStatusChange: (status: StatusFilter) => void;
  onCategoryChange: (category: CategoryFilter) => void;
  onSearchChange: (value: string) => void;
  onReset: () => void;
}

const TaskFilters = ({
  status,
  category,
  search,
  metrics,
  onStatusChange,
  onCategoryChange,
  onSearchChange,
  onReset,
}: TaskFiltersProps) => {
  return (
    <Box bg="slate.800" borderRadius="2xl" p={6} borderWidth="1px" borderColor="slate.700">
      <Grid gap={6} templateColumns={{ base: '1fr', md: 'repeat(4, minmax(0, 1fr))' }} alignItems="end">
        <GridItem colSpan={1}>
          <Text fontSize="sm" textTransform="uppercase" color="slate.400" mb={2} letterSpacing="0.08em">
            Status
          </Text>
          <Select value={status} onChange={(event) => onStatusChange(event.target.value as StatusFilter)}>
            <option value="all">All statuses</option>
            {Object.values(TaskStatus).map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </Select>
        </GridItem>
        <GridItem colSpan={1}>
          <Text fontSize="sm" textTransform="uppercase" color="slate.400" mb={2} letterSpacing="0.08em">
            Category
          </Text>
          <Select value={category} onChange={(event) => onCategoryChange(event.target.value as CategoryFilter)}>
            <option value="all">All categories</option>
            {Object.values(TaskCategory).map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </Select>
        </GridItem>
        <GridItem colSpan={{ base: 1, md: 2 }}>
          <Text fontSize="sm" textTransform="uppercase" color="slate.400" mb={2} letterSpacing="0.08em">
            Search
          </Text>
          <Input
            placeholder="Search tasks by title or description"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
          />
        </GridItem>
      </Grid>
      <HStack mt={6} justify="space-between" align="center">
        <Button variant="ghost" onClick={onReset} colorScheme="whiteAlpha">
          Reset filters
        </Button>
        {metrics && (
          <HStack spacing={6} align="center">
            <Stat>
              <StatLabel display="flex" alignItems="center" gap={2} color="slate.300">
                <Icon as={FiBarChart2} /> Confidence
              </StatLabel>
              <StatNumber color="slate.100">{Math.round(metrics.confidenceAverage)}%</StatNumber>
              <StatHelpText color="slate.400">Average across visible tasks</StatHelpText>
            </Stat>
            <Stat>
              <StatLabel color="slate.300">Status spread</StatLabel>
              <StatHelpText color="slate.400">
                {Object.entries(metrics.byStatus)
                  .map(([key, value]) => `${key}: ${value}`)
                  .join(' · ')}
              </StatHelpText>
            </Stat>
          </HStack>
        )}
      </HStack>
    </Box>
  );
};

export default TaskFilters;
