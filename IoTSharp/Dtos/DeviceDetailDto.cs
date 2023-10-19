using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using IoTSharp.Contracts;
using IoTSharp.Data;

namespace IoTSharp.Dtos
{
    public class DeviceDetailDto
    {
        public Guid Id { get; set; } = Guid.NewGuid();
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
        /// <summary>
        /// Owner
        /// </summary>
        public Gateway Owner { get; set; }


        public IdentityType IdentityType { get; set; }


        public string IdentityValue { get; set; }
        public string IdentityId { get; set; }
        /// <summary>
        /// Is it active?
        /// </summary>
        public bool Active { get; set; }
        /// <summary>
        /// Last activity
        /// </summary>
        public DateTime? LastActivityDateTime { get; set; }
        public string TenantName { get; set; }
        public string CustomerName { get; set; }
        public Guid TenantId { get; set; }
        public Guid CustomerId { get; set; }
    }
}
