using IoTSharp.EventBus;
using IoTSharp.Contracts;
using IoTSharp.Data;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using MQTTnet.Server;
using Quartz;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace IoTSharp.Jobs
{

    [QuartzJobScheduler(60)]
    public class CheckDevices : IJob
    {
        private readonly MqttClientSetting _mcsetting;
        private readonly ILogger<CheckDevices> _logger;
        private readonly IServiceScopeFactory _scopeFactor;
        private readonly MqttServer _serverEx;
        private readonly IPublisher _queue;

        public CheckDevices(ILogger<CheckDevices> logger, IServiceScopeFactory scopeFactor, MqttServer serverEx
           , IOptions<AppSettings> options, IPublisher queue)
        {
            _mcsetting = options.Value.MqttClient;
            _logger = logger;
            _scopeFactor = scopeFactor;
            _serverEx = serverEx;
            _queue = queue;
        }
        public async Task Execute(IJobExecutionContext context)
        {
            //If the interrupt is in the mqtt server list, get the timestamp of the last message received,
            using (var scope = _scopeFactor.CreateScope())
            using (var _dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>())
            {
                try
                {
                    var sf = from d in _dbContext.AttributeLatest where (d.KeyName == Constants._Active && d.Value_Boolean == true) select d.DeviceId;
                    if (sf.Any())
                    {
                        var devices = await sf.ToListAsync();
                        foreach (var id in devices)
                        {
                            var dev = await _dbContext.Device.FirstOrDefaultAsync(d => d.Id== id);
                            var ladt = from d in _dbContext.AttributeLatest where d.DeviceId == id && d.DataSide == DataSide.ServerSide && d.KeyName == Constants._LastActivityDateTime select d.Value_DateTime;
                            var __LastActivityDateTime = await ladt.FirstOrDefaultAsync();
                            if (dev != null && __LastActivityDateTime!=null)
                            {

                                if (DateTime.UtcNow.Subtract(__LastActivityDateTime.GetValueOrDefault()).TotalSeconds > dev.Timeout)
                                {
                                    _logger.LogInformation($"The device {dev.Name}({dev.Id}) is now inactive, the last active time was {__LastActivityDateTime}, and the timeout was {dev.Timeout} seconds");
                                    await _queue.PublishActive(id, ActivityStatus.Inactivity);
                                }
                            }
                        }
                    }
                }
                catch (Exception ex)
                {

                    _logger.LogError(ex, "Error checking device online status.");
                }
            }
        }
    }
}
