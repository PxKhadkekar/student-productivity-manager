import { Task } from '@/store/useTaskStore';
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, useFieldArray } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Plus, Trash2 } from "lucide-react"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import RichTextEditor from './RichTextEditor'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { useEffect } from 'react';

const formSchema = z.object({
  title: z.string().min(2, { message: "Title must be at least 2 characters." }),
  description: z.string().optional(),
  priority: z.enum(["low", "medium", "high"]),
  startDate: z.string().optional(),
  dueDate: z.string().min(1, { message: "Due date is required" }),
  allDay: z.boolean().optional(),
  category: z.string(),
  tags: z.string().optional(),
  subtasks: z.array(z.object({
    title: z.string().min(1, "Cannot be empty"),
    completed: z.boolean()
  })).default([]),
})

interface TaskFormProps {
  initialData?: Task;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

export default function TaskForm({ initialData, onSubmit, onCancel }: TaskFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      priority: "medium",
      startDate: new Date().toISOString().split('T')[0],
      dueDate: new Date().toISOString().split('T')[0],
      allDay: false,
      category: "Uncategorized",
      tags: "",
      subtasks: [],
    },
  })

  const { fields, append, remove } = useFieldArray({
    name: "subtasks",
    control: form.control,
  })

  useEffect(() => {
    if (initialData) {
      form.reset({
        title: initialData.title,
        description: initialData.description || "",
        priority: initialData.priority,
        startDate: initialData.startDate ? new Date(initialData.startDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        dueDate: initialData.dueDate ? new Date(initialData.dueDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        allDay: initialData.allDay || false,
        category: initialData.category || "Uncategorized",
        tags: initialData.tags ? initialData.tags.join(', ') : "",
        subtasks: initialData.subtasks || [],
      });
    }
  }, [initialData, form]);

  const handleSubmitIntercept = (data: z.infer<typeof formSchema>) => {
    const parsedTags = data.tags 
      ? data.tags.split(',').map(t => t.trim()).filter(t => t.length > 0)
      : [];
      
    onSubmit({
      ...data,
      tags: parsedTags
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmitIntercept)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Task title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Uncategorized">Uncategorized</SelectItem>
                    <SelectItem value="Work">Work</SelectItem>
                    <SelectItem value="Personal">Personal</SelectItem>
                    <SelectItem value="Study">Study</SelectItem>
                    <SelectItem value="Health">Health</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="tags"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tags (comma-separated)</FormLabel>
                <FormControl>
                  <Input placeholder="urgent, frontend, bug" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <RichTextEditor content={field.value || ""} onChange={field.onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="priority"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Priority</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="allDay"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-2 mt-6">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>All Day Event</FormLabel>
                </div>
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium leading-none">Subtasks</label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-8 gap-1"
              onClick={() => append({ title: "", completed: false })}
            >
              <Plus className="h-3 w-3" />
              Add Subtask
            </Button>
          </div>
          
          {fields.map((field, index) => (
            <div key={field.id} className="flex items-start gap-2">
              <FormField
                control={form.control}
                name={`subtasks.${index}.title`}
                render={({ field: subField }) => (
                  <FormItem className="flex-1 w-full space-y-0 relative">
                    <FormControl>
                      <Input
                        placeholder={`Subtask ${index + 1}`}
                        className="pr-10"
                        {...subField}
                      />
                    </FormControl>
                    <FormMessage className="absolute -bottom-5" />
                  </FormItem>
                )}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-10 w-10 text-destructive hover:bg-destructive/10"
                onClick={() => remove(index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          {fields.length > 0 && <div className="h-4" />}
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
          <Button type="submit">Save Task</Button>
        </div>
      </form>
    </Form>
  )
}
