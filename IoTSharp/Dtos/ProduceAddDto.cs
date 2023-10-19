using IoTSharp.Contracts;
using IoTSharp.Data;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System;

namespace IoTSharp.Dtos
{
    public class ProduceAddDto
    {

        public Guid Id { get; set; }

        /// <summary>
        ///Device name
        /// </summary>
        public string Name { get; set; }

        /// <summary>
        /// ICON file full path
        /// </summary>
        public string Icon { get; set; }

        /// <summary>
        /// Gateway type handles related configurations based on unavailable gateways
        /// </summary>
        [EnumDataType(typeof(GatewayType))]
        public GatewayType GatewayType { get; set; } = GatewayType.Unknow;

        /// <summary>
        /// Gateway configuration information, if it is Unknown, it will not be used. If it is customized, this is a json string.
        /// If it is another corresponding gateway, then here is the corresponding configuration file name.
        /// </summary>
        public string GatewayConfiguration { get; set; } = string.Empty;
        /// <summary>
        /// Timeout seconds
        /// </summary>
        public int DefaultTimeout { get; set; } = 300;
        /// <summary>
        /// Tenant
        /// </summary>
        public Guid Tenant { get; set; }
        /// <summary>
        /// client
        /// </summary>
        public Guid Customer { get; set; }
        /// <summary>
        ///Default authentication type
        /// </summary>
        [EnumDataType(typeof(IdentityType))]
        public IdentityType DefaultIdentityType { get; set; } = IdentityType.AccessToken;
        /// <summary>
        /// describe
        /// </summary>
        public string Description { get; set; }
        /// <summary>
        ///Default device type
        /// </summary>
        public DeviceType DefaultDeviceType { get; set; }

    }
}
