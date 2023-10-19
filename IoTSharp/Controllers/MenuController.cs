using IoTSharp.Contracts;
using IoTSharp.Data;
using IoTSharp.Dtos;
using IoTSharp.Extensions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Linq;

namespace IoTSharp.Controllers
{
    /// <summary>
    /// this is test purpose
    /// </summary>
    [Route("api/[controller]/[action]")]
    [ApiController]
    [Authorize]
    public class MenuController : ControllerBase
    {
        private readonly UserManager<IdentityUser> _userManager;
        private readonly ApplicationDbContext _context;

        public MenuController(UserManager<IdentityUser> userManager, ApplicationDbContext context)
        {
            _userManager = userManager;
            _context = context;
        }

        public ApiResult<dynamic> GetUserAsset(int type)
        {
            return new ApiResult<dynamic>(ApiCode.Success, "OK", null);
        }

        [HttpGet]
        public ApiResult<dynamic> GetProfile()
        {
            var profile = this.GetUserProfile();
            var sysmenu = new List<MenuItem>();
            if (User.IsInRole(nameof(UserRole.SystemAdmin)))
            {
                sysmenu.Add(new() { text = "Certificate Management", i18n = "", vi18n = "iot.certmnt", routename = "certmnt", link = "/iot/settings/certmgr", vpath = "/iot /settings/certmgr", });
                sysmenu.Add(new() { text = "tenant list", i18n = "", vi18n = "iot.tenantlist", routename = "tenantlist", link = "/iot/settings/tenantlist", vpath = "/iot /settings/tenantlist" });
            }
            if (User.IsInRole(nameof(UserRole.TenantAdmin)))
            {
                sysmenu.Add(new() { text = "Customer List", i18n = "", vi18n = "iot.customerlist", routename = "customerlist", link = "/iot/settings/customerlist", vpath = "/iot /settings/customerlist", });
            }
            if (User.IsInRole(nameof(UserRole.CustomerAdmin)))
            {
                sysmenu.Add(new() { text = "userlist", i18n = "", vi18n = "iot.userlist", routename = "userlist", link = "/iot/settings/userlist", vpath = "/iot /settings/userlist", });
            }

            var _user_menu = new List<MenuItem>
             {
                 new()
                 {
                     text = "Dashboard",
                     i18n = "Dashboard",
                     vi18n = "iot.dashboardmnt",
                     routename = "dashboard",
                     vpath = "/dashboard",
                     icon = "anticon-dashboard",
                     children = new MenuItem[]
                         {
                             new() { text = "Dashboard", i18n = "", vi18n="iot.dashboard", routename="dashboard", link = "/dashboard", vpath="/dashboard", }
                         }
                 }
             };
            if (User.IsInRole(nameof(UserRole.NormalUser)))
            {
                _user_menu.Add(
                 new()
                 {
                     text = "digital twin",
                     i18n = "",
                     vi18n = "iot.devicemnt",
                     routename = "devicemnt",
                     vpath = "/iot/devices",
                     icon = "anticon-database",
                     children = new MenuItem[]
                         {
                             new() { text = "Device Management", i18n = "", vi18n="iot.devicelist", routename="devicelist", link = "/iot/devices/devicelist", vpath="/iot/devices/devicelist"},
                             new() { text = "Device Alarm", i18n = "", vi18n="iot.alarmlist", routename="alarmlist", link = "/iot/alarms/alarmlist", vpath = "/iot/alarms/alarmlist ", },
                             new() { text = "Rule chain design", i18n = "", vi18n="iot.flowlist", routename="flowlist", link = "/iot/rules/flowlist", vpath = "/iot/rules/ flowlist", },
                             new() { text = "Rule Chain Audit", i18n = "", vi18n="iot.flowevents", routename="flowevents", link = "/iot/rules/flowevents", vpath = "/iot/rules/ flowevents", },
                           // new() { text = "Gateway Configurator", i18n = "", vi18n="iot.devicegraph", routename="devicegraph", link = "/iot/devices/devicegraph", vpath="/iot/ devices/devicegraph", },
                         }
                 });
                 _user_menu.Add(new()
                 {
                     text = "Product Management",
                     i18n = "",
                     vi18n = "iot.producemnt",
                     routename = "producemnt",
                     icon = "medicinebox",
                     vpath = "/iot/produce",
                     children = new MenuItem[]
                         {
                             new() { text = "Product List", i18n = "", vi18n="iot.producelist", routename="producelist", link = "/iot/produce/producelist", vpath="/iot/produce/producelist"}
                         }
                 });
                 _user_menu.Add(new()
                 {
                     text = "Asset Management",
                     i18n = "",
                     vi18n = "iot.assetsmnt",
                     routename = "assetsmnt",
                     vpath = "/iot/assets",
                     icon = "anticon-gold",
                     children = new MenuItem[]
                         {
                             new() { text = "assetlist", i18n = "", vi18n="iot.assetlist", routename="assetlist", link = "/iot/assets/assetlist", vpath="/iot/assets/assetlist"},
                         },
                 });
            }
            _user_menu.Add(new()
            {
                text = "System Management",
                i18n = "",
                vi18n = "iot.settingsmnt",
                routename = "settingsmnt",
                vpath = "/iot/settings",
                icon = "anticon-setting",
                children = sysmenu.ToArray()
            });
            var data = new
            {
                menu = new[]{
                        new MenuItem
                        {
                            text = "Main Navigation",
                            i18n = "Main Navigation",
                            vi18n="iot.home",
                            routename="home",
                            group = true,
                            hideInBreadcrumb = true,
                            vpath="/dashboard",
                            isAffix=true,
                            isLink=false,
                            children = _user_menu.ToArray()
                        }
                    },
                funcs = Enumerable.Range(0, 500),
                username = profile.Name,
                AppName = "IoTSharp",
                Modules = new[]
                                {
                        "kanban",
                        "statistics",
                        "lists",
                        //"warning"
                    }, //User homepage module
                Email = this.User.GetEmail(),
                Customer = User.GetCustomerId(),
                Tenant = User.GetTenantId(),
                Logo = ""
            };
            return new ApiResult<dynamic>(ApiCode.Success, "OK", data);
        }
    }
}