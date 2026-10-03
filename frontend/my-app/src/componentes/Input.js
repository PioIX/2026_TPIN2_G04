export default function Input({ type = "text", name, value, onChange, placeholder, ...props }) {
    return (
        <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            {...props}
        />
    );
}