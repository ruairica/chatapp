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

namespace Api.Controllers    
{
    public class HelloWorldController : ServerlessHub
    {

        [FunctionName("HelloWorldFunction")]
        public async Task<IActionResult> HelloWorldFunction(
            [HttpTrigger(AuthorizationLevel.Function, "get", Route = "HelloWorld")] HttpRequest req,
            ILogger log)
        {
            // this.Groups.AddToGroupAsync(this.);
            log.LogInformation("I'm in the the function!");
            return new OkObjectResult(true);
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
    }
}
