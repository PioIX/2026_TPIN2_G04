'use client'
import ChatItem from './ChatItem.js'
import { useState } from "react"


export default function ChatList({ onAgregar, onEliminar }) {
    const [chats, setChats] = useState([]);

    const items = [];

    for (let i = 0; i < chats.length; i++) {
        items.push(
            <ChatItem
                key={i}
                chat={chats[i]}
                indice={i}
                onEliminar={onEliminar}
            />
        );
    }
    const handleAgregar = () => {
        onAgregar(chats);
        setChats(""); // Limpias tu input
    }

    return (
        <div>
            <button
                onClick={handleAgregar} // con un CLICK se activa la función
            >Agregar chat</button>
            <ChatItem />
            {chats.length === 0 ? (
                <p>No tenés chats.</p>
            ) : (
                <ul>
                    {items}
                </ul>
            )}

        </div>
    )
}
