using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using Api.DataModels;

namespace Api.Repositories
{
    public interface IMessageRepository
    {
        Task<Chat> CreateNewChat();

        bool ChatExists(string chatName);

        Task<List<MessageResponse>> MessageSummaries(List<string> chatNames);

        Task<List<MessageResponse>> GetMessages(string chatName, double timeStamp);

        Task AddMessage(MessageRequest messageRequest);
    }
}
