interface RadioOptionProps {
    name: string;
    value: string;
    label: string;
    checked: boolean;
    onChange: (value: string) => void;
}

function RadioOption({
    name,
    value,
    label,
    checked,
    onChange,
}: RadioOptionProps) {
    return (
        <label className="flex cursor-pointer items-center gap-2 text-sm text-text-secondary transition-colors duration-200 hover:text-primary">
            <input
                type="radio"
                name={name}
                value={value}
                checked={checked}
                onChange={(event) => onChange(event.target.value)}
                className="h-4 w-4 accent-primary focus:ring-2 focus:ring-primary"
            />

            <span>{label}</span>
        </label>
    );
}

export default RadioOption;