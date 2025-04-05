import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  useCreateFAQMutation,
  useUpdateFAQMutation,
} from '@/rtk/features/api/apiSlice';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

const FaqForm = ({ mode, faqId, defaultValues, onClose }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm({
    defaultValues: mode === 'edit' ? defaultValues : { isActive: true },
  });

  const [createFAQ] = useCreateFAQMutation();
  const [updateFAQ] = useUpdateFAQMutation();

  const onSubmit = async (data) => {
    try {
      if (mode === 'create') {
        await createFAQ(data).unwrap();
        toast.success('FAQ created successfully!');
      } else if (mode === 'edit') {
        await updateFAQ({ id: faqId, ...data }).unwrap();
        toast.success('FAQ updated successfully!');
      }
      reset();
      onClose(); // Close the modal after submission
    } catch (err) {
      console.error('Failed to submit FAQ:', err);
    }
  };

  const categories = ['general', 'payments', 'shipping', 'returns', 'account'];

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4"
    >
      {/* Question Field */}
      <div>
        <label
          htmlFor="question"
          className="block text-sm font-medium text-gray-700"
        >
          Question
        </label>
        <textarea
          id="question"
          {...register('question', { required: 'Question is required' })}
          className="w-full p-2 border border-gray-300 rounded-md"
          rows={3}
        />
        {errors.question && (
          <span className="text-sm text-red-500">
            {errors.question.message}
          </span>
        )}
      </div>

      {/* Answer Field */}
      <div>
        <label
          htmlFor="answer"
          className="block text-sm font-medium text-gray-700"
        >
          Answer
        </label>
        <textarea
          id="answer"
          {...register('answer', { required: 'Answer is required' })}
          className="w-full p-2 border border-gray-300 rounded-md"
          rows={5}
        />
        {errors.answer && (
          <span className="text-sm text-red-500">{errors.answer.message}</span>
        )}
      </div>

      {/* Category Field */}
      <div>
        <label
          htmlFor="category"
          className="block text-sm font-medium text-gray-700"
        >
          Category
        </label>
        <Select
          onValueChange={(value) => setValue('category', value)}
          defaultValue={watch('category') || 'general'}
        >
          <SelectTrigger className="w-full capitalize">
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem
                key={category}
                value={category}
                className="capitalize"
              >
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* isActive Field */}
      <div className="flex items-center">
        <Checkbox
          id="isActive"
          {...register('isActive')}
          onCheckedChange={(checked) => setValue('isActive', checked)}
          defaultChecked={watch('isActive')}
          className="mr-2"
        />
        <label
          htmlFor="isActive"
          className="text-sm font-medium text-gray-700"
        >
          Is Active
        </label>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full bg-blue-500 text-white py-2 px-4 rounded-md"
      >
        {mode === 'create' ? 'Create FAQ' : 'Update FAQ'}
      </button>
    </form>
  );
};

export default FaqForm;
