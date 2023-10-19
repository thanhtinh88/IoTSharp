using IoTSharp.Contracts;
using IoTSharp.Data;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace IoTSharp.Dtos
{
    /// <summary>
    /// Query historical telemetry data request structure
    /// </summary>
    public class TelemetryDataQueryDto
    {
        /// <summary>
        /// The key value to be obtained, if it is empty, it is all
        /// </summary>
        public string keys { get; set; } = string.Empty;
        /// <summary>
        /// Starting time
        /// </summary>
        public DateTime begin { get; set; }
        /// <summary>
        /// Deadline, default is now.
        /// </summary>
        public DateTime end { get; set; } = DateTime.UtcNow;
        /// <summary>
        /// Data section aggregation interval
        /// </summary>
        /// <example>1.03:14:56:166</example>
        /// <remarks>d.hh:mm:ss:FFF</remarks>
        [Newtonsoft.Json.JsonConverter(typeof(TimespanConverterNewtonsoft))]
        [Newtonsoft.Json.JsonProperty(TypeNameHandling = Newtonsoft.Json.TypeNameHandling.All)]
        [System.Text.Json.Serialization.JsonConverter(typeof(TimeSpanConverter))]
        public TimeSpan every { get; set; } = TimeSpan.Zero;
        /// <summary>
        /// Data section calculation method,
        /// </summary>
        public Aggregate aggregate { get; set; } = Aggregate.None;
    }

}
