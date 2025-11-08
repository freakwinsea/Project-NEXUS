import { Badge } from '@chakra-ui/react';

interface TaskConfidenceBadgeProps {
  value: number;
}

const getColorScheme = (value: number) => {
  if (value >= 80) return 'green';
  if (value >= 50) return 'yellow';
  return 'orange';
};

const TaskConfidenceBadge = ({ value }: TaskConfidenceBadgeProps) => {
  return (
    <Badge colorScheme={getColorScheme(value)} rounded="full" px={2} py={1} fontSize="0.75rem">
      {Math.round(value)}%
    </Badge>
  );
};

export default TaskConfidenceBadge;
