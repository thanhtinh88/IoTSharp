using System;
using IoTSharp.Data;

namespace IoTSharp.Controllers.Models
{
    public class QueryDto
    {
        /// <summary>
        ///Start line of current page
        /// </summary>
        public int Offset { get; set; } = 0;
        /// <summary>
        ///Number of page lines
        /// </summary>
        public int Limit { get; set; } = 10;
        /// <summary>
        /// Name used for fuzzy query
        /// </summary>
        public string Name { get; set; }
    }

    public class AssetEntityParam : QueryDto
    {
        public Guid Id { get; set; }
    }


    public class AlarmParam : QueryDto
    {
        public Guid? OriginatorId { get; set; }
        public int Serverity { get; set; }
        public int AlarmStatus { get; set; }
        public DateTime[] ClearDateTime { get; set; }
        public DateTime[] StartDateTime { get; set; }
        public int OriginatorType { get; set; }


        public DateTime[] EndDateTime { get; set; }
        public DateTime[] AckDateTime { get; set; }

        public string AlarmType { get; set; }
    }
    public class DeviceParam : QueryDto
    {

        public Guid customerId { get; set; }

        public Guid ruleId { get; set; }

        public bool OnlyActive { get; set; }

    }

    public class RulePageParam : QueryDto
    {

        public string Creator { get; set; }
        public DateTime[] CreatTime { get; set; }
    }

    public class EventParam : QueryDto
    {
        public Guid? RuleId { get; set; }
        public string CreatorName { get; set; }

        public Guid? Creator { get; set; }
        public DateTime[] CreatTime { get; set; }
    }

    public class DictionaryParam : QueryDto
    {
        public string DictionaryName { get; set; }
        public int DictionaryGroupId { get; set; }
    }

    public class I18NParam : QueryDto
    {
        public string KeyName { get; set; }
    }

    /// <summary>
    /// Tenant's customer query
    /// </summary>
    public class CustomerParam : QueryDto
    {
        /// <summary>
        /// Tenant ID
        /// </summary>
        public Guid tenantId { get; set; }
    }

    /// <summary>
    ///Customer's user query
    /// </summary>
    public class UserQueryDto : QueryDto
    {
        /// <summary>
        /// Customer ID
        /// </summary>
        public Guid CustomerId { get; set; }
    }
}