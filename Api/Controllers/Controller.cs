using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.AspNetCore.Http;
using Microsoft.Azure.WebJobs.Extensions.SignalRService;
using System.IO;
using Newtonsoft.Json;
using Api.DataModels;
using System.Linq;
using Api.Repositories;

namespace Api.Controllers
{
    public class Controller : ServerlessHub
    {
        private readonly IMessageRepository messageRepository;

        public Controller(IMessageRepository messageRepository)
        {
            this.messageRepository = messageRepository;
        }

        [FunctionName("negotiate")]
        public async Task<IActionResult> GetSignalRInfo(
          [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "negotiate")] HttpRequest req,
          [SignalRConnectionInfo(HubName = "{headers.x-ms-signalr-group}")] SignalRConnectionInfo info)
        {
            return new OkObjectResult(info);
        }

        [FunctionName("PostMessages")]
        public async Task<IActionResult> PostMessage(
        [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "PostMessage/{chatName}")] HttpRequest req,
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

            await this.messageRepository.AddMessage(messageObject);

            return new OkResult();
        }

        [FunctionName("GetMessages")]
        public async Task<IActionResult> GetMessages(
        [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "GetMessages/{chatName}")] HttpRequest req, string chatName)
        {
            double.TryParse(req.Query["timeStamp"], out var timestamp);

            var messages = await this.messageRepository.GetMessages(chatName, timestamp);

            return new OkObjectResult(messages);
        }

        [FunctionName("FillRecentChats")]
        public async Task<IActionResult> FillRecentChats(
        [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "FillRecentChats")] HttpRequest req)
        {
            var chatNames = req.Query["chatName"].ToList();

            if (chatNames == null || chatNames.Count > 3 || !chatNames.Any())
            {
                return new BadRequestResult();
            }

            var response = await this.messageRepository.MessageSummaries(chatNames);


            return new OkObjectResult(response);
        }

        [FunctionName("CreateGroup")]
        public async Task<IActionResult> CreateGroup(
        [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "CreateGroup")] HttpRequest req)
        {
            var chat = await this.messageRepository.CreateNewChat();     

            return new OkObjectResult(chat);
        }

        [FunctionName("ChatExists")]
        public async Task<IActionResult> ChatExists(
        [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "ChatExists/{chatName}")] HttpRequest req,
        string chatName)
        {
            var response = this.messageRepository.ChatExists(chatName);

            return new OkObjectResult(response);
        }
    }
}
