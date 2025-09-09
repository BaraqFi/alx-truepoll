'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { PlusCircle, Trash2, Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Card, CardContent } from '@/components/ui/card';
import { createPoll } from '@/lib/actions/polls';

const formSchema = z.object({
  title: z.string().min(5, {
    message: 'Title must be at least 5 characters.',
  }),
  description: z.string().optional(),
  isMultipleChoice: z.boolean(),
  isPublic: z.boolean(),
  options: z.array(
    z.object({
      text: z.string().min(1, { message: 'Option text is required' }),
    })
  ).min(2, { message: 'At least 2 options are required' }),
});

type FormValues = z.infer<typeof formSchema>;

interface CreatePollFormProps {
  userId: string;
}

export function CreatePollForm({ userId }: CreatePollFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      isMultipleChoice: false,
      isPublic: true,
      options: [
        { text: '' },
        { text: '' },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "options",
  });

  async function onSubmit(data: FormValues) {
    setIsSubmitting(true);
    
    try {
      // Map options to include position
      const formattedOptions = data.options.map((option, index) => ({
        text: option.text.trim(),
        position: index,
      }));

      const result = await createPoll(
        {
          ...data,
          options: formattedOptions,
        },
        userId
      );

      if (result.success) {
        toast.success('Poll created successfully!');
        router.push(`/polls/${result.pollId}`);
      } else {
        toast.error(`Failed to create poll: ${result.error}`);
      }
    } catch (error) {
      console.error('Error creating poll:', error);
      toast.error('An unexpected error occurred while creating the poll');
    } finally {
      setIsSubmitting(false);
    }
  }

  const addOption = () => {
    if (fields.length < 10) { // Limit to 10 options
      append({ text: '' });
    } else {
      toast.error('Maximum 10 options allowed');
    }
  };

  const removeOption = (index: number) => {
    if (fields.length > 2) { // Keep at least 2 options
      remove(index);
    } else {
      toast.error('At least 2 options are required');
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Poll Question</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="What's your favorite programming language?" 
                        {...field} 
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description (Optional)</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Add some context to your question..." 
                        {...field} 
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-4">
                <div className="text-lg font-medium">Poll Options</div>
                {fields.map((field, index) => (
                  <div key={field.id} className="flex items-center gap-2">
                    <FormField
                      control={form.control}
                      name={`options.${index}.text`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormControl>
                            <Input 
                              placeholder={`Option ${index + 1}`} 
                              {...field} 
                              disabled={isSubmitting}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {fields.length > 2 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeOption(index)}
                        disabled={isSubmitting}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  onClick={addOption}
                  disabled={isSubmitting || fields.length >= 10}
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Option
                </Button>
              </div>

              <div className="flex flex-col gap-4">
                <FormField
                  control={form.control}
                  name="isMultipleChoice"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Multiple Choice</FormLabel>
                        <FormDescription>
                          Allow voters to select multiple options
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          disabled={isSubmitting}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="isPublic"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Public Poll</FormLabel>
                        <FormDescription>
                          Make this poll visible to everyone
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          disabled={isSubmitting}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Creating...
              </>
            ) : (
              'Create Poll'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}