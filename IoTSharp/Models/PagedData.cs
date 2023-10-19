using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace IoTSharp.Models
{
    /// <summary>
    /// Returns a page of data of type <typeparamref name="T"/>
    /// </summary>
    /// <typeparam name="T"></typeparam>
    public class PagedData<T>
    {
        /// <summary>
        ///Total amount of data
        /// </summary>
        public long total { get; set; }
        /// <summary>
        /// One page of data
        /// </summary>
        public List<T> rows { get; set; }

    }
}
