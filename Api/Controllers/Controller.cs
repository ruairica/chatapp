using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Microsoft.Azure.WebJobs.Extensions.SignalRService;
using System.IO;
using System.Text.Json;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using Api.DataModels;
using Microsoft.Azure.Documents.Client;
using Microsoft.Azure.Documents.Linq;
using System.Linq;

namespace Api.Controllers
{
    public class Controller : ServerlessHub
    {
        [FunctionName("negotiate")]
        public async Task<IActionResult> GetSignalRInfo(
          [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "negotiate")] HttpRequest req,
          [SignalRConnectionInfo(HubName = "{headers.x-ms-signalr-group}")] SignalRConnectionInfo info)
        {
            //possibly do the check if exists check here instead.
            return new OkObjectResult(info);
        }

        [FunctionName("PostMessages")]
        public async Task<IActionResult> PostMessage(
        [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "PostMessage/{chatName}")] HttpRequest req,
        [CosmosDB(
                databaseName: "Messages",
                collectionName: "MessagesContainer",
                ConnectionStringSetting = "CosmoDB_ConnectionString",
                CreateIfNotExists = true)] IAsyncCollector<MessageRequest> documentOut,
        [SignalR(HubName = "{chatName}")] IAsyncCollector<SignalRMessage> signalRMessages)
        {
            var requestBody = await new StreamReader(req.Body).ReadToEndAsync();
            var messageObject = JsonConvert.DeserializeObject<MessageRequest>(requestBody);

            await signalRMessages.AddAsync(
                new SignalRMessage
                {
                    Target = "newMessage",
                    Arguments = new object[] { messageObject }
                });

            await documentOut.AddAsync(messageObject);

            return new OkResult();
        }

        [FunctionName("GetMessages")]
        public async Task<IActionResult> GetMessages(
        [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "GetMessages/{chatName}")] HttpRequest req,
        string chatName,
        [CosmosDB(
                databaseName: "Messages",
                collectionName: "MessagesContainer",
                ConnectionStringSetting = "CosmoDB_ConnectionString")] DocumentClient client)
        {
            Uri collectionUri = UriFactory.CreateDocumentCollectionUri("Messages", "MessagesContainer");

            var query = $"SELECT TOP 5 * FROM MessagesContainer c WHERE c.chatName = '{chatName.ToLower()}' ";

            if (double.TryParse(req.Query["timeStamp"], out var timestamp))
            {
                query += $"AND c.timeStamp < {timestamp} ORDER BY c.timeStamp DESC";
            }
            else
            {
                query += "ORDER BY c.timeStamp DESC";
            }

            var messages = client.CreateDocumentQuery<MessageResponse>(collectionUri, query).ToList();
            messages.Reverse();

            return new OkObjectResult(messages);
        }

        [FunctionName("CreateGroup")]
        public async Task<IActionResult> CreateGroup(
        [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "CreateGroup")] HttpRequest req,
        [CosmosDB(
                databaseName: "Messages",
                collectionName: "MessagesContainer",
                ConnectionStringSetting = "CosmoDB_ConnectionString",
                CreateIfNotExists = true)] IAsyncCollector<MessageRequest> documentOut)
        {
            var chatName = this.CreateChatName();
            // TODO: Add validation to ensure group does not already exist.

            var messageObject = new MessageRequest
            {
                NickName = string.Empty,
                ChatName = chatName,
                Body = $"This is the beginning of {chatName}"
            };

            await documentOut.AddAsync(messageObject);

            return new OkObjectResult(new Chat { ChatName = chatName });
        }

        [FunctionName("ChatExists")]
        public async Task<IActionResult> ChatExists(
        [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "ChatExists/{chatName}")] HttpRequest req,
        string chatName,
        [CosmosDB(
                databaseName: "Messages",
                collectionName: "MessagesContainer",
                ConnectionStringSetting = "CosmoDB_ConnectionString")] DocumentClient client)
        {
            
            Uri collectionUri = UriFactory.CreateDocumentCollectionUri("Messages", "MessagesContainer");

            // TODO: chat should only be active if its had a message in the last 24 hours, update UI so user knows this, and implement cron job to delete old chats.
            // var twentyFourHoursAgo = DateTime.UtcNow.AddDays(-1).ToOADate();
            // var response = client.CreateDocumentQuery<MessageResponse>(collectionUri, $"SELECT TOP 1 * FROM MessagesContainer c WHERE c.chatName = '{chatName.ToLower()}' AND c.timeStamp > {twentyFourHoursAgo}").ToList();


            var response = client.CreateDocumentQuery<MessageResponse>(collectionUri, $"SELECT TOP 1 * FROM MessagesContainer c WHERE c.chatName = '{chatName.ToLower()}'").ToList();

            return new OkObjectResult(response.Any());
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
