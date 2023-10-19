using System;
using System.ComponentModel.DataAnnotations;

namespace IoTSharp.Dtos
{
    public class CreateUserDto
    {
        /// <summary>
        /// User email
        /// </summary>
        [Required]
        [EmailAddress]
        public string Email { get; set; }

        /// <summary>
        /// System administrator password
        /// </summary>
        [Required]
        [StringLength(100, ErrorMessage = "PASSWORD_MIN_LENGTH", MinimumLength = 6)]
        public string Password { get; set; }

        /// <summary>
        /// telephone number
        /// </summary>
        [Phone]
        public string PhoneNumber { get; set; }
        /// <summary>
        ///Customer ID
        /// </summary>
        public Guid Customer { get; set; }

    }
}