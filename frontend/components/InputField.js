import { Input } from './ui/input';
import { Label } from './ui/label';

const InputField = ({ label, name, placeholder, register, errors }) => {
    return (
        <div>
            {label && <Label htmlFor={name}>{label}</Label>}
            <Input
                id={name}
                type="text"
                placeholder={placeholder}
                {...register(name, { required: true })}
            />
            {errors[name] && (
                <p className="text-red-500">{`${label} is required`}</p>
            )}
        </div>
    );
};

export default InputField;
