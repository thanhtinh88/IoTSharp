using System;
using IoTSharp.Contracts;

namespace IoTSharp.Dtos
{
    public class ProduceDictionaryEditDto
    {
        public Guid produceId { get; set; }
        public ProduceDictionaryItemDto[] ProduceDictionaryData { get; set; }
    }



    public class ProduceDictionaryItemDto
    {

        public Guid Id { get; set; }

        /// <summary>
        /// Field Name
        /// </summary>
        public string KeyName { get; set; }

        /// <summary>
        /// Field display name
        /// </summary>
        public string DisplayName { get; set; }



        /// <summary>
        /// Unit
        /// </summary>
        public string Unit { get; set; }

        /// <summary>
        ///Unit conversion expression
        /// </summary>
        public string UnitExpression { get; set; }

        /// <summary>
        /// Unit conversion
        /// </summary>
        public bool UnitConvert { get; set; }
        /// <summary>
        /// Field remarks
        /// </summary>
        public string KeyDesc { get; set; }
        /// <summary>
        /// default value
        /// </summary>
        public string DefaultValue { get; set; }

        /// <summary>
        /// Whether to display
        /// </summary>
        public bool Display { get; set; }

        /// <summary>
        /// Location name
        /// </summary>
        public string Place0 { get; set; }
        /// <summary>
        /// This position sequence
        /// </summary>
        public string PlaceOrder0 { get; set; }
        public string Place1 { get; set; }
        public string PlaceOrder1 { get; set; }
        public string Place2 { get; set; }
        public string PlaceOrder2 { get; set; }
        public string Place3 { get; set; }
        public string PlaceOrder3 { get; set; }
        public string Place4 { get; set; }
        public string PlaceOrder4 { get; set; }
        public string Place5 { get; set; }
        public string PlaceOrder5 { get; set; }
        /// <summary>
        /// type of data 
        /// </summary>
        public DataType DataType { get; set; }


        public string Tag { get; set; }

    }
}
