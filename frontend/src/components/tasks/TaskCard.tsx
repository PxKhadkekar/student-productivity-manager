import { Task } from '@/store/useTaskStore';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { format } from 'date-fns';
import { Edit, Trash2, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onToggleComplete: (id: string, completed: boolean) => void;
}

const priorityColors = {
  low: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  high: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
};

export default function TaskCard({ task, onEdit, onDelete, onToggleComplete }: TaskCardProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="w-full relative group"
    >
      <Card className={`transition-all duration-300 rounded-2xl shadow-sm hover:shadow-md border-muted bg-card/80 backdrop-blur-md ${task.completed ? 'opacity-60 saturate-50' : ''}`}>
      <CardHeader className="pb-2 flex flex-row items-start justify-between">
        <div className="flex gap-3">
          <Checkbox 
            checked={task.completed} 
            onCheckedChange={(checked) => onToggleComplete(task.id, checked as boolean)}
            className="mt-1"
          />
          <div className="space-y-1">
            <CardTitle className={`text-lg ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
              {task.title}
            </CardTitle>
            <p className="text-sm text-muted-foreground line-clamp-2">{task.description}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="flex flex-wrap gap-2 text-sm mt-2">
          {task.category && task.category !== "Uncategorized" && (
            <Badge className="bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/40 dark:text-purple-300 dark:border-purple-800">
              {task.category}
            </Badge>
          )}
          <Badge variant="outline" className={priorityColors[task.priority]}>
            {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} Priority
          </Badge>
          {task.tags && task.tags.map(tag => (
            <Badge key={tag} variant="outline" className="text-gray-500 bg-gray-50 dark:bg-gray-800 dark:text-gray-400">
              #{tag}
            </Badge>
          ))}
          {task.dueDate && (
            <Badge variant="secondary">
              Due: {format(new Date(task.dueDate), 'MMM dd, yyyy')}
            </Badge>
          )}
          {task.timeSpent !== undefined && task.timeSpent > 0 && (
            <Badge variant="outline" className="text-blue-600 border-blue-200 bg-blue-50 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800">
              <Clock className="w-3 h-3 mr-1" />
              {task.timeSpent >= 3600
                ? `${Math.floor(task.timeSpent / 3600)}h ${Math.floor((task.timeSpent % 3600) / 60)}m`
                : `${Math.floor(task.timeSpent / 60)}m`}
            </Badge>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-2 pt-2 border-t">
        <Button variant="ghost" size="icon" onClick={() => onEdit(task)}>
          <Edit className="w-4 h-4 text-blue-500" />
        </Button>
        <Button variant="ghost" size="icon" onClick={() => onDelete(task.id)}>
          <Trash2 className="w-4 h-4 text-red-500" />
        </Button>
      </CardFooter>
    </Card>
    </motion.div>
  );
}
