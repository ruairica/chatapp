using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Api.DataModels;
using Microsoft.Azure.Cosmos;
using Microsoft.Azure.Cosmos.Linq;

namespace Api.Repositories
{
    public class MessagesRepository: IMessageRepository
    {
        private readonly CosmosClient cosmosClient;
        private Database database;
        private Container container;

        public MessagesRepository(CosmosClient cosmosClient)
        {
            this.cosmosClient = cosmosClient;
            this.database = this.cosmosClient.GetDatabase("Messages");
            this.container = this.database.GetContainer("MessagesContainer");
        }

        public async Task<Chat> CreateNewChat()
        {
            var chatName = CreateChatName();
            while(this.ChatExists(chatName))
            {
                chatName = CreateChatName();
            }

            // TODO: Add validation to ensure group does not already exist.
            var messageObject = new MessageRequest
            {
                NickName = string.Empty,
                ChatName = chatName,
                Body = $"This is the beginning of {chatName.ToLower()}"
            };

            await this.AddMessage(messageObject);

            return (new Chat() {ChatName = messageObject.ChatName });
        }

        public async Task<List<MessageResponse>> MessageSummaries(List<string> chatNames)
        {
            var result = new List<MessageResponse>();
            var items = new List<MessageResponse>();

            var validChatNames = chatNames.Where(x => this.ChatExists(x)).ToList();

            using (var setIterator = container.GetItemLinqQueryable<MessageResponse>()
                     .Where(c => validChatNames.Contains(c.ChatName)).OrderByDescending(c => c.TimeStamp)
                     .ToFeedIterator())
            {
                while (setIterator.HasMoreResults)
                {
                    foreach (var item in await setIterator.ReadNextAsync())
                    {
                        items.Add(item);
                    }
                }
            }

            result = items.GroupBy(x => x.ChatName).Select(m => m.FirstOrDefault() != default ? new MessageResponse
            {
                NickName = m.First().NickName,
                Body = m.First().Body.Length > 27 ? m.First().Body.Substring(0, 27) + "..." : m.First().Body,
                ChatName = m.First().ChatName,
                TimeStamp = m.First().TimeStamp
            } : null).ToList();

            return result;
        }

        public async Task<List<MessageResponse>> GetMessages(string chatName, double timeStamp)
        {
            var items = new List<MessageResponse>();

            using (var setIterator = container.GetItemLinqQueryable<MessageResponse>()
                     .Where(c => c.ChatName == chatName && c.TimeStamp < (timeStamp == default ? double.MaxValue : timeStamp)).OrderByDescending(c => c.TimeStamp).Take(10)
                     .ToFeedIterator())
            {
                while (setIterator.HasMoreResults)
                {
                    foreach (var item in await setIterator.ReadNextAsync())
                    {
                        items.Add(item);
                    }
                }
            }

            items.Reverse();

            return items;
        }

        public async Task AddMessage(MessageRequest messageRequest)
        {
            messageRequest.Id = Guid.NewGuid().ToString();
            await this.container.CreateItemAsync(messageRequest, new PartitionKey(messageRequest.ChatName));
        }

        public bool ChatExists(string chatName)
        {
            var twentyFourHoursAgo = DateTime.UtcNow.AddDays(-1).ToOADate();

            var result = this.container.GetItemLinqQueryable<MessageResponse>(true)
                .Where(c => c.ChatName.ToLower() == chatName && c.TimeStamp > twentyFourHoursAgo).OrderByDescending(x => x.TimeStamp).AsEnumerable().FirstOrDefault();

            return result != default;
        }


        private static string CreateChatName()
        {
            var chatName = "1";
            while (!char.IsLetter(chatName.First()))
            {
                chatName = RandomString();
            }

            return chatName.ToLower();
        }

        public static string RandomString()
        {
            var random = new Random();
            const string chars = "abcdefghijklmnopqrstuvwxyz0123456789";
            return new string(Enumerable.Repeat(chars, 4)
              .Select(s => s[random.Next(s.Length)]).ToArray());
        }
    }
}
