using IoTSharp.Contracts;
using IoTSharp.Data;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace IoTSharp.Dtos
{
    public class TokenEntity
    {
        /// <summary>
        /// token
        /// </summary>
        public string access_token { get; set; }
        /// <summary>
        /// Expiration
        /// </summary>
        public long expires_in { get; set; }


        public string refresh_token { get; set; }
        public DateTime expires { get; set; }
    }

    public class LoginResult
    {
        /// <summary>
        /// Login results
        /// </summary>
        public ApiCode Code { get; set; }
        /// <summary>
        /// username
        /// </summary>
        public string UserName { get; set; }
        /// <summary>
        /// Login results
        /// </summary>
        public Microsoft.AspNetCore.Identity.SignInResult SignIn { get; set; }
        /// <summary>
        /// whether succeed
        /// </summary>
        public bool Succeeded { get; set; }
        /// <summary>
        ///Token
        /// </summary>
        public TokenEntity Token { get; set; }
        /// <summary>
        /// Permissions possessed by the user
        /// </summary>
        public IList<string> Roles { get; set; }
        public string Avatar { get; internal set; }
    }

    public class LoginDto
    {
        /// <summary>
        /// password
        /// </summary>
        [Required]
        public string Password { get; set; }
        /// <summary>
        /// username
        /// </summary>
        [Required]
        public string UserName { get; set; }

    }

    public class RegisterDto
    {
        /// <summary>
        /// The email address is also the user name. One email address can only register one customer of the platform. If you have two tenants with accounts on the platform, you need two email addresses.
        /// </summary>
        [Required]
        public string Email { get; set; }
        /// <summary>
        /// telephone number
        /// </summary>
        [Required]
        public string PhoneNumber { get; set; }
        /// <summary>
        /// The user's customer email address
        /// </summary>
        [Required]
        public string Customer { get; set; }
        /// <summary>
        /// Username Password
        /// </summary>
        [Required]
        [StringLength(100, MinimumLength = 6)]
        public string Password { get; set; }
    }

    public class UserItemDto
    {
        /// <summary>
        /// User email address
        /// </summary>
        public string Email { get; set; }
        /// <summary>
        /// Permission identification
        /// </summary>
        public List<string> Roles { get; set; } = new List<string>();
        /// <summary>
        /// telephone number
        /// </summary>
        public string PhoneNumber { get; set; }
        /// <summary>
        /// Number of failed login attempts
        /// </summary>
        public int AccessFailedCount { get; set; }
        /// <summary>
        /// Identification
        /// </summary>
        public string Id { get; set; }
        /// <summary>
        /// Whether it is locked
        /// </summary>
        public bool LockoutEnabled { get; set; }
        /// <summary>
        /// Lock duration
        /// </summary>
        public DateTimeOffset? LockoutEnd { get; set; }
        /// <summary>
        /// username
        /// </summary>
        public string UserName { get; set; }
        public string CustomerName { get; set; }
        public string TenantName { get; set; }
    }

    public class UserPassword
    {
        /// <summary>
        /// Old Password
        /// </summary>
        public string Pass { get; set; }
        /// <summary>
        /// New Password
        /// </summary>
        public string PassNew { get; set; }
        /// <summary>
        /// Verify password for the second time
        /// </summary>
        public string PassNewSecond { get; set; }
    }
}