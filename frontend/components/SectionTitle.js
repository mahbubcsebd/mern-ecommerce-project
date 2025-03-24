import { cn } from '@/lib/utils';

const SectionTitle = ({ children, className }) => {
    return <h2 className={cn("text-2xl font-semibold text-gray-900", className)}>{children}</h2>;
};

export default SectionTitle