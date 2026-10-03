'use client'

import ChatList from "@/componentes/ChatList"
import { useState } from "react"

export default function PageChats() {
    const [chats, setChats] = useState("");

    return(
        <div>
            <ChatList
                chats={chats} 
            />
        </div>
    )
}