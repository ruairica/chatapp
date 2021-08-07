using System;
using System.Collections.Generic;
using System.Text;

namespace Api.DataModels
{
    public class Message
    {
        public string Id { get; set; }

        public string Body { get; set; }

        public string NickName { get; set; }

        public string ChatName { get; set; }
    }
}
