﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using IoTSharp.Contracts;
using IoTSharp.Data;

namespace IoTSharp.Controllers
{
    public class DeviceAttributeDto
    {
        public Guid DeviceId { get; set; }
        public string KeyName { get; set; }

        public DateTime DateTime { get; set; }

        /// <summary>
        /// Data side
        /// </summary>
        public DataSide DataSide { get; set; }

        /// <summary>
        /// type of data
        /// </summary>
        public DataType DataType { get; set; }

        public bool? Value_Boolean { get; set; }
        public string Value_String { get; set; }
        public long? Value_Long { get; set; }
        public DateTime? Value_DateTime { get; set; }
        public double? Value_Double { get; set; }
        public string Value_Json { get; set; }
        public string Value_XML { get; set; }
        public byte[] Value_Binary { get; set; }

        public DataCatalog Catalog { get; set; }
        

    }
}
