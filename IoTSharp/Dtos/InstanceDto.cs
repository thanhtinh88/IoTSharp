namespace IoTSharp.Dtos
{
    public class InstanceDto
    {
        /// <summary>
        /// system version
        /// </summary>
        public string Version { get; set; }
        /// <summary>
        /// Whether it is installed
        /// </summary>
        public bool Installed { get; set; }
        public bool CACertificate { get; set; }

        /// <summary>
        /// http://localhost/
        /// </summary>
        public string Domain { get; set; }
        public string BrokerThumbprint { get; set; }
        public string CAThumbprint { get; set; }
        public bool? EnableTls { get; set; }
    }


}