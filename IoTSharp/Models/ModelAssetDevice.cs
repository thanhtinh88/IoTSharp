using System;
using IoTSharp.Contracts;
using IoTSharp.Data;
using IoTSharp.Dtos;
using MongoDB.Bson.Serialization.Serializers;

namespace IoTSharp.Models
{
    public class ModelAssetDevice
    {
        public Guid AssetId { get; set; }


        public Guid Deviceid { get; set; }


        public string Devicename { get; set; }
        public ModelAssetAttrItem[] Attrs { get; set; }

        public ModelAssetAttrItem[] Temps { get; set; }
    }


    public class ModelAddAssetDevice
    {

        /// <summary>
        /// AssetId
        /// </summary>
        public Guid AssetId { get; set; }
        /// <summary>
        /// Device ID to import
        /// </summary>

        public Guid Deviceid { get; set; }

        /// <summary>
        /// List of device attribute data to be imported
        /// </summary>
        public ModelAddAssetDeviceItem[] Attrs { get; set; }


        /// <summary>
        /// List of device telemetry data to import
        /// </summary>
        public ModelAddAssetDeviceItem[] Temps { get; set; }




        public class ModelAddAssetDeviceItem
        {
            /// <summary>
            /// Description of the property or telemetry
            /// </summary>
            public string Description { get; set; }


            /// <summary>
            /// KeyName of the property or telemetry
            /// </summary>
            public string keyName { get; set; }

            /// <summary>
            /// data side
            /// </summary>
            public DataCatalog dataSide { get; set; }


            /// <summary>
            /// Alias for the property or telemetry KeyName
            /// </summary>
            public string Name { get; set; }
        }

    }



    public class ModelEditAssetAttrItem
    {
        /// <summary>
        ///  The id of the association
        /// </summary>
        public Guid Id { get; set; }

        /// <summary>
        ///  Description of the property or telemetry
        /// </summary>
        public string Description { get; set; }

        /// <summary>
        ///  Alias for the property or telemetry KeyName
        /// </summary>
        public string Name { get; set; }
    }

    public class ModelAssetAttrItem
    {
        /// <summary>
        /// The id of the association
        /// </summary>
        public Guid Id { get; set; }

        /// <summary>
        /// Description of properties or telemetry
        /// </summary>
        public string Description { get; set; }

        /// <summary>
        /// KeyName of property or telemetry
        /// </summary>
        public string keyName { get; set; }


        /// <summary>
        /// Attribute or telemetry data side
        /// </summary>
        public DataCatalog dataSide { get; set; }


        /// <summary>
        /// Aliases for properties or telemetry
        /// </summary>
        public string Name { get; set; }

    }

    public class AssetDeviceItem
    {
        /// <summary>
        ///Device name
        /// </summary>
        public string Name { get; set; }
        /// <summary>
        ///DeviceId
        /// </summary>
        public Guid Id { get; set; }

        /// <summary>
        /// Equipment type
        /// </summary>
        public DeviceType DeviceType { get; set; }


        /// <summary>
        /// time out
        /// </summary>

        public int Timeout { get; set; }
        /// <summary>
        /// Device authentication method
        /// </summary>
        public DeviceIdentity DeviceIdentity { get; set; }
        /// <summary>
        ///Attribute data
        /// </summary>
        public ModelAssetAttrItem[] Attrs { get; set; }
        /// <summary>
        /// Telemetry data
        /// </summary>
        public ModelAssetAttrItem[] Temps { get; set; }
    }

}
