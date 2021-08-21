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
            var chatName = this.CreateChatName();

            // TODO: Add validation to ensure group does not already exist.
            var messageObject = new MessageRequest
            {
                Id = Guid.NewGuid().ToString(),
                NickName = string.Empty,
                ChatName = chatName,
                Body = $"This is the beginning of {chatName}"
            };

            await this.container.CreateItemAsync(messageObject, new PartitionKey(messageObject.ChatName));

            return (new Chat() {ChatName = messageObject.ChatName });
        }

        public bool ChatExists(string chatName)
        {
            // TODO: chat should only be active if its had a message in the last 24 hours, update UI so user knows this, and implement cron job to delete old chats.
            // Similarly FillRecentChats should have a 24 hour check aswell.
            // var twentyFourHoursAgo = DateTime.UtcNow.AddDays(-1).ToOADate();
            // var response = client.CreateDocumentQuery<MessageResponse>(collectionUri, $"SELECT TOP 1 * FROM MessagesContainer c WHERE c.chatName = '{chatName.ToLower()}' AND c.timeStamp > {twentyFourHoursAgo}").ToList();


            var result = this.container.GetItemLinqQueryable<MessageResponse>(true)
                .Where(c => c.ChatName.ToLower() == chatName).AsEnumerable().FirstOrDefault();

            return result == default ? false : true;

        }


        private string CreateChatName()
        {
            var chatName = "1";
            while (!char.IsLetter(chatName.First()))
            {
                chatName = Convert.ToBase64String(Guid.NewGuid().ToByteArray()).Substring(0, 4);
            }

            return chatName.ToLower();
        }
    }
}
