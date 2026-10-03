

export default function Boton({ text, type = "button", onClick }) {
    return (
        <button type={type} onClick={onClick}>
            {text}
        </button>
    );
}