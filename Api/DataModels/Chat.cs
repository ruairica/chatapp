using Newtonsoft.Json;

namespace Api.DataModels
{
    public class Chat
    {
        [JsonProperty("chatName")]
        public string ChatName { get; set; }

        //TODO: Add chat Id
    }
}
