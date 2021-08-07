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

        [FunctionName("GetMessages")]
        public async Task<IActionResult> GetMessages(
        [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "GetMessages")] HttpRequest req,
            [CosmosDB(
                databaseName: "Messages",
                collectionName: "MessagesContainer",
                ConnectionStringSetting = "CosmoDB_ConnectionString",
                Id = "1",
                PartitionKey = "abcd")] DataModels.Message message)
        {

            // will be reading this in as an object just // use 
            //var requestBody = await new StreamReader(req.Body).ReadToEndAsync();
            //var messageObject = JsonConvert.DeserializeObject<DataModels.Message>(requestBody);


            return new OkObjectResult(message);
        }

        [FunctionName("PostMessages")]
        public async Task<IActionResult> PostMessage(
        [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "PostMessage")] HttpRequest req,
        [CosmosDB(
                databaseName: "Messages",
                collectionName: "MessagesContainer",
                ConnectionStringSetting = "CosmoDB_ConnectionString")] IAsyncCollector<DataModels.Message> documentOut)
        {

            // will be reading this in as an object just // use 
            //var requestBody = await new StreamReader(req.Body).ReadToEndAsync();
            //var messageObject = JsonConvert.DeserializeObject<DataModels.Message>(requestBody);
            var messageObject = new DataModels.Message
            { 
                Id = Guid.NewGuid().ToString(),
                NickName = "fromCode",
                ChatName = "abcd",
                Body = "heres the message",
            };

            await documentOut.AddAsync(messageObject);


            return new OkResult();
        }


    }
}
