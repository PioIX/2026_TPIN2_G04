'use client'

import ChatList from "@/componentes/ChatList"
import { useState } from "react"

export default function PageChats({ chats, onAgregar, onEliminar }) {

    // page.js
    const handleAgregarChat = (nombreDelNuevoChat) => {
        // Modifica la lista agregando el nuevo chat
        setChats([...chats, { id: Date.now(), nombre: nombreDelNuevoChat }]);
    };

    return (
        <div>
            <ChatList
                chats={chats}
                onAgregar={handleAgregarChat} 
            />
        </div>
    )
}