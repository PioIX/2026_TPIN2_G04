'use client'
import ChatItem from './ChatItem.js'
import { useState } from "react"

export default function ChatList({ chats = [], onAgregar, onEliminar }) {
    const [nuevoContacto, setNuevoContacto] = useState("");

    const handleAgregar = () => {
        if (nuevoContacto.trim() === "") return; // Si está vacío no hace nada
        onAgregar(nuevoContacto);
        setNuevoContacto(""); // Limpias el input
    }

    return (
        <div>
            {/* Input para escribir el nombre del nuevo chat */}
            <input 
                type="text" 
                value={nuevoContacto} 
                onChange={(e) => setNuevoContacto(e.target.value)} 
                placeholder="Número de telefono a agendar..."
            />
            <button onClick={handleAgregar}>Agregar chat</button>

            {chats.length === 0 ? (
                <p>No tenés chats.</p>
            ) : (
                <ul>
                    {chats.map((chat) => (
                        <ChatItem
                            key={chat.id}
                            chat={chat}
                            onEliminar={onEliminar}
                        />
                    ))}
                </ul>
            )}
        </div>
    )
}