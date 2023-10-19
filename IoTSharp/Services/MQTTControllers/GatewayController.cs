using IoTSharp.EventBus;
using IoTSharp.Contracts;
using IoTSharp.Data;
using IoTSharp.Dtos;
using IoTSharp.Extensions;
using IoTSharp.Gateways;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using MQTTnet;
using MQTTnet.AspNetCore.Routing;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Collections;
using IdentityModel.OidcClient;

namespace IoTSharp.Services.MQTTControllers
{
    /// <summary>
    /// Compatible with thingsboard protocol
    /// </summary>
    [MqttController]
    [MqttRoute("v1/gateway")]
    public class V1GatewayController : GatewayController
    {
        public V1GatewayController(ILogger<GatewayController> logger, IServiceScopeFactory scopeFactor,
         IOptions<AppSettings> options, IPublisher queue
         ) : base(logger, scopeFactor, options, queue)
        {
        }
    }

    [MqttController]
    [MqttRoute("[controller]")]
    public class GatewayController : MqttBaseController
    {
        private readonly ILogger _logger;
        private readonly IServiceScopeFactory _scopeFactor;
        private readonly IPublisher _queue;
        private readonly IServiceScope _scope;
        private readonly RawDataGateway _rawData;
        private readonly KepServerEx _kep;
        public GatewayController(ILogger<GatewayController> logger, IServiceScopeFactory scopeFactor,
            IOptions<AppSettings> options, IPublisher queue
            )
        {
            _logger = logger;
            _scopeFactor = scopeFactor;
            _queue = queue;
            _scope = scopeFactor.CreateScope();
            _rawData = _scope.ServiceProvider.GetService<RawDataGateway>();
            _kep = _scope.ServiceProvider.GetService<KepServerEx>();
        }

        [MqttRoute("telemetry")]
        public async Task telemetry()
        {
            var _dev = GetSessionItem<Device>();
            var lst = Newtonsoft.Json.JsonConvert.DeserializeObject<Dictionary<string, List<GatewayPlayload>>>(Message.ConvertPayloadToString());
            _logger.LogInformation($"The data {Message.Topic} of {ClientId} is gateway data and is parsed to {lst?.Count} devices");
            await _queue.PublishActive(_dev.Id, ActivityStatus.Activity);

            lst?.Keys.ToList().ForEach(async dev =>
            {
                var plst = lst[dev];
                var device = _dev.JudgeOrCreateNewDevice(dev, _scopeFactor, _logger);
                await _queue.PublishActive(device.Id, ActivityStatus.Activity);
                _logger.LogInformation($"{ClientId}'s gateway data is processing device {dev}, and the device ID is {_dev?.Id}");
                plst.ForEach(p =>
                {
                    _queue.PublishTelemetryData(new PlayloadData() { DeviceId = device.Id, ts = new DateTime(p.Ticks, DateTimeKind.Utc), MsgBody = p.Values, DataSide = DataSide.ClientSide, DataCatalog = DataCatalog.TelemetryData });
                });
                _logger.LogInformation($"{ClientId}'s gateway data processing is completed, device {dev}ID is {device?.Id}, totaling {plst.Count}");
            });
            await Ok();
        }

        [MqttRoute("attributes")]
        public async Task Attributes()
        {
            var _dev = GetSessionItem<Device>();
            var lst = Newtonsoft.Json.JsonConvert.DeserializeObject<Dictionary<string, List<GatewayPlayload>>>(Message.ConvertPayloadToString());
            _logger.LogInformation($"The data {Message.Topic} of {ClientId} is gateway data and is parsed to {lst?.Count} devices");
            await _queue.PublishActive(_dev.Id, ActivityStatus.Activity);
            lst?.Keys.ToList().ForEach(async dev =>
            {
                var plst = lst[dev];
                var device = _dev.JudgeOrCreateNewDevice(dev, _scopeFactor, _logger);
                await _queue.PublishActive(device.Id, ActivityStatus.Activity);
                _logger.LogInformation($"{ClientId}'s gateway data is processing device {dev}, and the device ID is {device?.Id}");
                plst.ForEach(async p =>
                {
                    await _queue.PublishAttributeData(new PlayloadData() { DeviceId = device.Id, ts = new DateTime(p.Ticks, DateTimeKind.Utc), MsgBody = p.Values, DataSide = DataSide.ClientSide, DataCatalog = DataCatalog.TelemetryData });
                });
                _logger.LogInformation($"{ClientId}'s gateway data processing is completed, device {dev}ID is {device?.Id}, totaling {plst.Count}");
            });
            await Ok();
        }

        [MqttRoute("{devname}/connect")]
        public async Task on_connect_bydevname(string devname)
        {
            var _dev = GetSessionItem<Device>();
            await _queue.PublishActive(_dev.Id, ActivityStatus.Activity);

            var device = _dev.JudgeOrCreateNewDevice(devname, _scopeFactor, _logger);
            if (device != null)
            {
                await _queue.PublishConnect(device.Id, ConnectStatus.Connected);
            }
            else
            {
                _logger.LogWarning("Failed to create or find the gateway device.");
            }
            await Ok();
        }

        [MqttRoute("{devname}/disconnect")]
        public async Task on_disconnect_bydevname(string devname)
        {
            var _dev = GetSessionItem<Device>();
            await _queue.PublishActive(_dev.Id, ActivityStatus.Activity);
            var device = _dev.JudgeOrCreateNewDevice(devname, _scopeFactor, _logger);
            if (device != null)
            {
                await _queue.PublishConnect(device.Id, ConnectStatus.Disconnected);
            }
            else
            {
                _logger.LogWarning("Failed to create or find the gateway device.");
            }
            await Ok();
        }

        [MqttRoute("connect")]
        public async Task on_connect()
        {
            var _dev = GetSessionItem<Device>();
            var ds = Newtonsoft.Json.JsonConvert.DeserializeObject<GatewayDeviceStatus>(Message.ConvertPayloadToString());
            await _queue.PublishActive(_dev.Id, ActivityStatus.Activity);
            if (ds != null)
            {
                var device = _dev.JudgeOrCreateNewDevice(ds.Device, _scopeFactor, _logger);
                if (device != null)
                {
                    await _queue.PublishConnect(device.Id, ConnectStatus.Connected);
                }
                else
                {
                    _logger.LogWarning("Failed to create or find the gateway device.");
                }
            }
            else
            {
                _logger.LogWarning("Unable to obtain the sub-device of the gateway.");
            }
            await Ok();
        }

        [MqttRoute("disconnect")]
        public async Task Disconnect()
        {
            var _dev = GetSessionItem<Device>();
            var ds = Newtonsoft.Json.JsonConvert.DeserializeObject<GatewayDeviceStatus>(Message.ConvertPayloadToString());
            await _queue.PublishActive(_dev.Id, ActivityStatus.Activity);
            if (ds != null)
            {
                var device = _dev.JudgeOrCreateNewDevice(ds.Device, _scopeFactor, _logger);
                if (device != null)
                {
                    await _queue.PublishConnect(device.Id, ConnectStatus.Disconnected);
                }
                else
                {
                    _logger.LogWarning("Failed to create or find the gateway device.");
                }
            }
            else
            {
                _logger.LogWarning("Unable to obtain the sub-device of the gateway.");
            }
            await Ok();
        }

        [MqttRoute("xml")]
        public async Task UploadXmlData()
        {
            try
            {
                var _dev = GetSessionItem<Device>();
                await _queue.PublishActive(_dev.Id, ActivityStatus.Activity);
                var result = await _rawData.ExecuteAsync(_dev, "xml", Message.ConvertPayloadToString());
                _logger.LogInformation($"Calling the XML gateway processing statement returns: {result.Code}-{result.Msg}");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Failed to call XML gateway: {ex.Message}");
            }
            await Ok();
        }

        [MqttRoute("json")]
        public async Task UploadJsonData()
        {
            try
            {
                var _dev = GetSessionItem<Device>();
                await _queue.PublishActive(_dev.Id, ActivityStatus.Activity);
                var result = await _rawData.ExecuteAsync(_dev, "json", Message.ConvertPayloadToString());
                _logger.LogInformation($"Calling the Json gateway processing statement returns: {result.Code}-{result.Msg}");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Failed to call Json gateway: {ex.Message}");
            }
            await Ok();
        }

        [MqttRoute("kepserverex")]
        public async Task KepServerEx()
        {
            try
            {
                var _dev = GetSessionItem<Device>();
                if (_dev != null)
                {
                    await _queue.PublishActive(_dev.Id, ActivityStatus.Activity);
                    var result = await _kep.ExecuteAsync(_dev, Message.Payload);
                    _logger.LogInformation($"Calling KepServerEx gateway processing statement returns: {result.Code}-{result.Msg}");
                    await Ok();
                }
                else
                {
                    await BadMessage();
                    _logger.LogWarning($"No device found when calling KepServerEx gateway");
                }

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Failed to call KepServerEx: {ex.Message}");
            }

        }
    }
}