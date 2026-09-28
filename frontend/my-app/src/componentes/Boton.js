"use client"

export default function Boton({text}){
    const onClick=()=>{
        //enviar a algun lado
    };
    return(
        <button onClick={onClick}>
            {text}
        </button>
);
}