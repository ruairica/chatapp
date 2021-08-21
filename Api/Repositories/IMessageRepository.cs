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
    }
}
