using System.ComponentModel.DataAnnotations;

namespace IoTSharp.Dtos
{

    public class InstallDto
    {
        /// <summary>
        /// System administrator username
        /// </summary>
        [Required]
        [EmailAddress]
        public string Email { get; set; }

        /// <summary>
        /// client's name
        /// </summary>
        [Required]
        public string CustomerName { get; set; }
        /// <summary>
        /// System administrator password
        /// </summary>
        [Required]
        [StringLength(100, ErrorMessage = "PASSWORD_MIN_LENGTH", MinimumLength = 6)]
        public string Password { get; set; }
        /// <summary>
        /// Tenant name
        /// </summary>
        public string TenantName { get; set; }
        /// <summary>
        /// Tenant email
        /// </summary>
        [EmailAddress]
        public string TenantEMail { get; set; }
        /// <summary>
        /// Customer email
        /// </summary>
        [EmailAddress]
        public string CustomerEMail { get; set; }
        /// <summary>
        /// telephone number
        /// </summary>
        [Phone]
        public string PhoneNumber { get; set; }
    }
}