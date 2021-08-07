using System;
using System.Collections.Generic;
using System.Text;
using Newtonsoft.Json;

namespace Api.DataModels
{
    public class MessageResponse
    {
        [JsonProperty("id")]
        public string Id { get; set; }

        [JsonProperty("body")]
        public string Body { get; set; }

        [JsonProperty("nickName")]
        public string NickName { get; set; }

        [JsonProperty("chatName")]
        public string ChatName { get; set; }

        [JsonProperty("timeStamp")]
        public double TimeStamp { internal get; set; }

        [JsonProperty("messageTime")]
        public DateTime MessageTime => DateTime.FromOADate(TimeStamp);
    }
}
