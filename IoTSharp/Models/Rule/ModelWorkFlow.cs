using System;
using System.Collections.Generic;

namespace IoTSharp.Models.Rule
{
    public class ModelWorkFlow
    {
        public string Xml { get; set; }

        public string Biz { get; set; }
    }



    public class ModelDiagram
    {
        public List<NodeObject> nodes { get; set; }

        public List<LineObject> lines { get; set; }

        public Guid RuleId { get; set; }
    }



    public class LineObject
    {
        public string sourceId { get; set; }
        public string targetId { get; set; }
        public string linename { get; set; }
        public string condition { get; set; }
        public string lineId { get; set; }
        public string linenamespace { get; set; }
    }

    public class NodeObject
    {
        public string nodeId { get; set; }
        /// <summary>
        /// Node grouping type (script, executor)
        /// </summary>

        public string nodetype { get; set; }
        /// <summary>
        /// Node content (script content for scripts, configuration for executors)
        /// </summary>
        public string content { get; set; }
        /// <summary>
        ///
        /// </summary>
        public string mata { get; set; }

        public string name { get; set; }
        public string nodenamespace { get; set; }
        public string top { get; set; }
        public string left { get; set; }

        public string icon { get; set; }
        public string nodeclass { get; set; }
    }
}