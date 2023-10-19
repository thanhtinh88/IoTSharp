using System;
using IoTSharp.Contracts;
using IoTSharp.Data;

namespace IoTSharp.Dtos
{
    public class DeviceRuleDto
    {
        public Guid Id { get; set; }

        /// <summary>
        ///Device name
        /// </summary>
        public string Name { get; set; }

        /// <summary>
        /// Equipment type
        /// </summary>
        public DeviceType DeviceType { get; set; }


        /// <summary>
        /// Timeout seconds
        /// </summary>
        public int Timeout { get; set; }



        public int EnableTrace { get; set; }


    }
}
