using System;
using System.Collections.Generic;
using System.Text;
using Newtonsoft.Json;

namespace Api.DataModels
{
    public class Message
    {
        [JsonProperty("id")]
        public string Id { get; set; }

        [JsonProperty("body")]
        public string Body { get; set; }

        [JsonProperty("nickName")]
        public string NickName { get; set; }

        [JsonProperty("chatName")]
        public string ChatName { get; set; }

        public DateTime TimeStamp { get; set; }
    }
}
