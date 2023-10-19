using static CLanguage.Report;
using System.ComponentModel.DataAnnotations;
using System;

namespace IoTSharp.Dtos
{
    public class CreateUserInput
    {
        /// <summary>
        /// The email address is also the user name. One email address can only register one customer of the platform. If you have two tenants with accounts on the platform, you need two email addresses.
        /// </summary>
        [Required]
        public string Email { get; set; }
        /// <summary>
        /// telephone number
        /// </summary>
        public string PhoneNumber { get; set; }
        /// <summary>
        ///
        /// </summary>
        public Guid CustomerId { get; set; }

        /// <summary>
        /// Username Password
        /// </summary>
        [Required]
        [StringLength(100, MinimumLength = 6)]
        public string Password { get; set; } = "1q2w3E*";
    }
}
