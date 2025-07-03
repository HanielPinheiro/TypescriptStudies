import { Message } from '../ts/types'

type MessageListProps = {
  messages: Message[];
  currentUserId: string;
};

export const MessageList = ({ messages, currentUserId }: MessageListProps) => {
  return (
    <div className="space-y-4">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex ${
            message.senderId === currentUserId ? 'justify-end' : 'justify-start'
          }`}
        >
          <div
            className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
              message.senderId === currentUserId
                ? 'bg-indigo-600 text-white rounded-br-none'
                : 'bg-gray-700 text-white rounded-bl-none'
            }`}
          >
            <p>{message.text}</p>
            <p
              className={`text-xs mt-1 ${
                message.senderId === currentUserId ? 'text-indigo-200' : 'text-gray-400'
              }`}
            >
              {new Date(message.timestamp).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};