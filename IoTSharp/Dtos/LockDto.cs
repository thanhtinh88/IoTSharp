using System;
using IoTSharp.Contracts;

namespace IoTSharp.Dtos
{
    public class LockDto
    {
        /// <summary>
        /// User ID
        /// </summary>
        public Guid Id { get; set; }
        /// <summary>
        /// User lock operation
        /// </summary>
        public LockOpt Opt { get; set; }
    }
}