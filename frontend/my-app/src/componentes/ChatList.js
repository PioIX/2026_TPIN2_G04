'use client'
import ChatItem from './ChatItem.js'

export default function ChatList( {chats} ) {
    const items = [];
    for (let i = 0; i < chats.length; i++) {
        items.push(
            <ChatItem 
                key={i} 
                chat={chats[i]} 
                indice={i} 
                // onEliminar={onEliminar} 
            />
        );
    }


    return(
        <div>
            <ChatItem/>
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
