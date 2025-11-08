import { useEffect } from 'react';
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Text,
  Textarea,
  VStack,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const schema = z.object({
  prompt: z
    .string()
    .min(10, 'Please enter at least 10 characters to describe your goal.'),
});

type PromptFormValues = z.infer<typeof schema>;

export interface PromptFormProps {
  onSubmit: (prompt: string) => void | Promise<void>;
  isSubmitting?: boolean;
  defaultPrompt?: string;
}

const suggestedPrompts = [
  'Build a knowledge base dashboard with search and tagging.',
  'Create onboarding flows for a SaaS analytics platform.',
  'Implement CI/CD for a monorepo with automated testing.',
];

const PromptForm = ({ onSubmit, isSubmitting, defaultPrompt }: PromptFormProps) => {
  const {
    register,
    handleSubmit,
    reset,
    setFocus,
    formState: { errors },
  } = useForm<PromptFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { prompt: defaultPrompt ?? '' },
  });

  useEffect(() => {
    setFocus('prompt');
  }, [setFocus]);

  useEffect(() => {
    if (typeof defaultPrompt === 'string') {
      reset({ prompt: defaultPrompt });
    }
  }, [defaultPrompt, reset]);

  const handleSuggestionClick = (prompt: string) => {
    reset({ prompt });
    onSubmit(prompt);
  };

  const submit = (values: PromptFormValues) => {
    onSubmit(values.prompt.trim());
  };

  return (
    <Box as="section" bg="slate.800" borderRadius="2xl" p={6} shadow="xl">
      <VStack as="form" spacing={6} align="stretch" onSubmit={handleSubmit(submit)}>
        <FormControl isInvalid={Boolean(errors.prompt)}>
          <FormLabel fontWeight="semibold" color="slate.200">
            Describe what you want to build
          </FormLabel>
          <Textarea
            placeholder="Generate a roadmap for..."
            resize="vertical"
            minH="140px"
            bg="slate.900"
            borderColor="slate.700"
            _hover={{ borderColor: 'slate.600' }}
            _focus={{ borderColor: 'brand.400', boxShadow: '0 0 0 1px var(--chakra-colors-brand-400)' }}
            {...register('prompt')}
          />
          <FormErrorMessage>{errors.prompt?.message}</FormErrorMessage>
        </FormControl>

        <Flex direction={{ base: 'column', md: 'row' }} gap={4} align="stretch">
          <Button type="submit" size="lg" flex={{ md: '1 0 auto' }} isLoading={isSubmitting} loadingText="Generating">
            Generate Tasks
          </Button>
        </Flex>

        <Box>
          <Text fontSize="sm" textTransform="uppercase" color="slate.400" mb={2} letterSpacing="0.08em">
            Quick suggestions
          </Text>
          <Flex gap={3} wrap="wrap">
            {suggestedPrompts.map((suggestion) => (
              <Button
                key={suggestion}
                size="sm"
                variant="outline"
                colorScheme="whiteAlpha"
                onClick={() => handleSuggestionClick(suggestion)}
                disabled={isSubmitting}
              >
                {suggestion}
              </Button>
            ))}
          </Flex>
        </Box>
      </VStack>
    </Box>
  );
};

export default PromptForm;
