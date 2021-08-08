using Newtonsoft.Json;

namespace Api.DataModels
{
    class Chat
    {
        [JsonProperty("chatName")]
        public string ChatName { get; set; }
    }
}
