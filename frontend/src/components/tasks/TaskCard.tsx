import {
  Badge,
  Box,
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardHeader,
  HStack,
  Heading,
  Text,
  Tooltip,
} from '@chakra-ui/react';
import TaskConfidenceBadge from './TaskConfidenceBadge';
import { Task, TaskStatus, TaskCategory } from '~shared/types';

export interface TaskCardProps {
  task: Task;
  onStatusChange: (taskId: string, status: TaskStatus) => void;
}

const statusActions: { label: string; status: TaskStatus; description: string }[] = [
  { label: 'Start', status: TaskStatus.InProgress, description: 'Mark task as in progress' },
  { label: 'Complete', status: TaskStatus.Completed, description: 'Mark task as completed' },
  { label: 'Approve', status: TaskStatus.Pending, description: 'Return task to pending' },
  { label: 'Needs review', status: TaskStatus.AwaitingApproval, description: 'Flag for approval' },
];

const categoryColors: Record<TaskCategory, string> = {
  [TaskCategory.Frontend]: 'purple',
  [TaskCategory.Backend]: 'orange',
  [TaskCategory.Database]: 'pink',
  [TaskCategory.Authentication]: 'yellow',
  [TaskCategory.Deployment]: 'blue',
  [TaskCategory.Testing]: 'green',
  [TaskCategory.General]: 'teal',
};

const TaskCard = ({ task, onStatusChange }: TaskCardProps) => {
  return (
    <Card bg="slate.900" borderColor="slate.800" borderWidth="1px" shadow="xl" data-testid="task-card">
      <CardHeader pb={2}>
        <Heading size="md" color="slate.100">
          {task.title}
        </Heading>
        <HStack mt={3} spacing={3} align="center">
          <Badge colorScheme={categoryColors[task.category]}>{task.category}</Badge>
          <TaskConfidenceBadge value={task.confidence} />
        </HStack>
      </CardHeader>
      <CardBody pt={0} display="flex" flexDirection="column" gap={4}>
        <Text color="slate.200">{task.description}</Text>
        <Box>
          <Text fontSize="sm" color="slate.400" textTransform="uppercase" letterSpacing="0.08em" mb={2}>
            Status
          </Text>
          <Badge colorScheme="brand" variant="solid">
            {task.status}
          </Badge>
        </Box>
        <ButtonGroup size="sm" spacing={2} flexWrap="wrap">
          {statusActions.map((action) => (
            <Tooltip key={action.status} label={action.description}>
              <Button
                onClick={() => onStatusChange(task.id, action.status)}
                variant={task.status === action.status ? 'solid' : 'outline'}
                colorScheme={task.status === action.status ? 'brand' : undefined}
              >
                {action.label}
              </Button>
            </Tooltip>
          ))}
        </ButtonGroup>
      </CardBody>
    </Card>
  );
};

export default TaskCard;
