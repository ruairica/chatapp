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
    public class HelloWorldController : ServerlessHub
    {
        private readonly string cosmoDB_ConnectionString;

        public HelloWorldController()
        {
            this.cosmoDB_ConnectionString = Environment.GetEnvironmentVariable("CosmoDB_ConnectionString");
        }

        [FunctionName("negotiate")]
        public async Task<IActionResult> GetSignalRInfo(
          [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "negotiate")] HttpRequest req,
          [SignalRConnectionInfo(HubName = "{headers.x-ms-signalr-group}")] SignalRConnectionInfo info)
        {
            return new OkObjectResult(info);
        }


        [FunctionName("message")]
        public async Task<IActionResult> SendMessage(
            [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "message")] HttpRequest req,
            [SignalR(HubName = "{headers.x-ms-signalr-group}")] IAsyncCollector<SignalRMessage> signalRMessages)
        {

            // will be reading this in as an object just // use 
            var requestBody = await new StreamReader(req.Body).ReadToEndAsync();

            var messageObject = JsonConvert.DeserializeObject<DataModels.Message>(requestBody);

            await signalRMessages.AddAsync(  
                new SignalRMessage
                {
                    Target = "newMessage",
                    Arguments = new object[] { messageObject }
                });

            return new OkResult();
        }

        [FunctionName("GetMessage")]
        public async Task<IActionResult> GetMessage(
        [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "GetMessage")] HttpRequest req,
            [CosmosDB(
                databaseName: "Messages",
                collectionName: "MessagesContainer",
                ConnectionStringSetting = "CosmoDB_ConnectionString",
                Id = "1",
                PartitionKey = "abcd")] List<Message> message)
        {

            // will be reading this in as an object just // use 
            //var requestBody = await new StreamReader(req.Body).ReadToEndAsync();
            //var messageObject = JsonConvert.DeserializeObject<DataModels.Message>(requestBody);  Id = "ab085072-e062-4e0f-8bf9-c15966e8a2d9",


            return new OkObjectResult(message);
        }

        [FunctionName("PostMessages")]
        public async Task<IActionResult> PostMessage(
        [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "PostMessage")] HttpRequest req,
        [CosmosDB(
                databaseName: "Messages",
                collectionName: "MessagesContainer",
                ConnectionStringSetting = "CosmoDB_ConnectionString",
                CreateIfNotExists = true)] IAsyncCollector<Message> documentOut)
        {

            // will be reading this in as an object just // use 
            //var requestBody = await new StreamReader(req.Body).ReadToEndAsync();
            //var messageObject = JsonConvert.DeserializeObject<DataModels.Message>(requestBody);
            var messageObject = new Message
            { 
                NickName = "hi there",
                ChatName = "abcd",
                Body = "heres the message",
                TimeStamp = DateTime.UtcNow
            };

            await documentOut.AddAsync(messageObject);


            return new OkResult();
        }

        [FunctionName("GetMessages")]
        public async Task<IActionResult> GetMessages(
        [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "GetMessages/{chatName}")] HttpRequest req,
        [CosmosDB(
                databaseName: "Messages",
                collectionName: "MessagesContainer",
                ConnectionStringSetting = "CosmoDB_ConnectionString")] DocumentClient client)
        {
            Uri collectionUri = UriFactory.CreateDocumentCollectionUri("Messages", "MessagesContainer");

            var response =  client.CreateDocumentQuery<Message>(collectionUri, "SELECT * FROM MessagesContainer c WHERE c.chatName = 'abcd'").ToList();

            return new OkObjectResult(true);
        }


    }
}
