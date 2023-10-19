using IoTSharp.Contracts;
using IoTSharp.Data;
using IoTSharp.Dtos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System;
using System.Linq;
using System.Net;
using System.Security.Cryptography.X509Certificates;
using System.Threading.Tasks;

namespace IoTSharp.Controllers
{
    /// <summary>
    /// Install
    /// </summary>
    [ApiController]
    [Route("api/[controller]/[action]")]
    public partial class InstallerController : ControllerBase
    {
        private ApplicationDbContext _context;
        private ILogger _logger;
        private readonly UserManager<IdentityUser> _userManager;
        private readonly IConfiguration _configuration;
        private readonly SignInManager<IdentityUser> _signInManager;
        private readonly ApplicationDBInitializer _dBInitializer;
        private readonly AppSettings _setting;

        public InstallerController(
            UserManager<IdentityUser> userManager,
            SignInManager<IdentityUser> signInManager,
            IConfiguration configuration, ILogger<AccountController> logger, ApplicationDbContext context
           , ApplicationDBInitializer dBInitializer,IOptions<AppSettings> options)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _configuration = configuration;
            _logger = logger;
            _context = context;
            _dBInitializer = dBInitializer;
            _setting = options.Value;
        }

        /// <summary>
        /// Check IoTSharp instance information
        /// </summary>
        /// <returns></returns>
        [AllowAnonymous]
        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesDefaultResponseType]
        public ApiResult<InstanceDto> Instance()
        {
            try
            {
                return new ApiResult<InstanceDto>(ApiCode.Success, "Ok", GetInstanceDto());
            }
            catch (Exception ex)
            {
                return new ApiResult<InstanceDto>(ApiCode.Exception, ex.Message, null);
            }
        }

        private InstanceDto GetInstanceDto()
        {
            return new InstanceDto()
            {
                Installed = _context.Relationship.Any(),
                EnableTls = _setting.MqttBroker.EnableTls,
                Domain = _setting.MqttBroker.DomainName ?? this.Request.Host.ToString(),
                Version = System.Reflection.Assembly.GetExecutingAssembly().GetName().Version.ToString(),
                CACertificate = _setting.MqttBroker.CACertificate != null,
                CAThumbprint = _setting.MqttBroker.CACertificate?.Thumbprint,
                BrokerThumbprint = _setting.MqttBroker.BrokerCertificate?.Thumbprint
            };
        }

        /// <summary>
        /// The domain name does not need to be configured. The machine name will be used by default.
        /// </summary>
        /// <returns></returns>
        [Authorize(Roles = nameof(UserRole.SystemAdmin))]
        [HttpPost]
        public ApiResult CreateRootCertificate()
        {
            var domain  =_setting.MqttBroker.DomainName ?? this.Request.Host.ToString();
            ApiResult result = new ApiResult(ApiCode.Success, "OK");
            if (!_setting.MqttBroker.EnableTls)
            {
                result = new ApiResult(ApiCode.NotEnableTls, "TLS is not yet used, please enable it in the configuration item. ");
            }
           else  if (_setting.MqttBroker.CACertificate != null)
            {
                result = new ApiResult(ApiCode.AlreadyExists, "CACertificate already exists.");
            }
            else if (string.IsNullOrEmpty(domain))
            {
                result = new ApiResult(ApiCode.NeedServerIPAddress, "ServerIPAddress     is required.");
            }
            else if ( Uri.TryCreate(domain, UriKind.Absolute, out  Uri _uri))
            {
                try
                {
                    var ten = _context.GetTenant(User.GetTenantId());
                    var option = _setting.MqttBroker;
                    var fx = new System.IO.FileInfo(option.CACertificateFile);
                    if (!fx.Directory.Exists) fx.Directory.Create();
                      fx = new System.IO.FileInfo(option.CAPrivateKeyFile);
                    if (!fx.Directory.Exists) fx.Directory.Create();
                      fx = new System.IO.FileInfo(option.PrivateKeyFile);
                    if (!fx.Directory.Exists) fx.Directory.Create();
                      fx = new System.IO.FileInfo(option.CertificateFile);
                    if (!fx.Directory.Exists) fx.Directory.Create();
                    var ca = _uri.CreateCA(option.CACertificateFile, option.CAPrivateKeyFile);
                    ca.CreateBrokerTlsCert(_uri.Host, Dns.GetHostAddresses(_uri.Host).FirstOrDefault(),
                        option.CertificateFile, option.PrivateKeyFile, ten.Email);
                    ca.LoadCAToRoot();
                    result = new ApiResult(ApiCode.Success, ca.Thumbprint);
                }
                catch (Exception exception)
                {
                    result = new ApiResult(ApiCode.Exception, exception.Message );
                }
            }
            else  
            {
                result = new ApiResult(ApiCode.Exception, "Url error.");
            }
            return result;
        }

        /// <summary>
        /// Install and initialize IoTSharp
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        [AllowAnonymous]
        [HttpPost]
        public async Task<ApiResult<InstanceDto>> Install([FromBody] InstallDto model)
        {
            try
            {
                if (!_context.Relationship.Any())
                {
                    await _dBInitializer.SeedRoleAsync();
                    await _dBInitializer.SeedUserAsync(model);
                    await _dBInitializer.SeedDictionary();
                    return new ApiResult<InstanceDto>(ApiCode.Success, "Ok", GetInstanceDto());
                }
                else
                {
                    return new ApiResult<InstanceDto>(ApiCode.AlreadyExists, "Already installed", GetInstanceDto());
                }
            }
            catch (Exception ex)
            {
                return new ApiResult<InstanceDto>(ApiCode.Exception, ex.Message, null);
            }
        }
    }
}