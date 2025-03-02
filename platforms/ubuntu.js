const path = require('path');

module.exports = {
  platform: 'default',

  // ip to be used by the AP
  ap_ip: '192.168.220.1',
  startGateway: 'systemctl start mozilla-gateway-wifi-setup',
  stopGateway: 'systemctl stop mozilla-gateway-wifi-setup',
  restartGateway: 'systemctl restart mozilla-gateway-wifi-setup',
  stopWifiService: 'systemctl stop mozilla-gateway-wifi-setup',

  // A shell command that outputs the string "COMPLETED" if we are
  // connected to a wifi network and outputs something else otherwise
  getStatus:
    'wpa_cli -iwlan0 status | sed -n -e \'/^wpa_state=/{s/wpa_state=//;p;q}\'',

  // A shell command that outputs the SSID of the current wifi network
  // or outputs nothing if we are not connected to wifi
  getConnectedNetwork:
    'wpa_cli -iwlan0 status | sed -n -e \'/^ssid=/{s/ssid=//;p;q}\'',

  // A Python script that scans for wifi networks and outputs the ssids in
  // order from best signal to worst signal, omitting hidden networks
  scan: path.join(__dirname, 'scan.py'),

  // A shell command that lists the names of known wifi networks, one
  // to a line.
  getKnownNetworks:
    // eslint-disable-next-line
    'wpa_cli -iwlan0 list_networks | sed -e "1d" | awk \'BEGIN {FS="\\t"}; {print $2}\'',

  // Start broadcasting an access point.
  // The name of the AP is defined in a config file elsewhere
  // Note that we use different commands on Yocto systems than
  // we do on Raspbian systems
  startAP:
    // eslint-disable-next-line
    'ifconfig wlan0 $IP; systemctl start hostapd; systemctl start dnsmasq',

  // Stop broadcasting an AP and attempt to reconnect to local wifi
  stopAP:
    // eslint-disable-next-line
    'systemctl stop hostapd; systemctl stop dnsmasq; ifconfig wlan0 0.0.0.0',

  // Remove an existing network. Expects the network ID in the environment
  // variable ID.
  removeNetwork:
    'wpa_cli -iwlan0 remove_network $ID && wpa_cli -iwlan0 save_config',

  // Define a new wifi network. Expects the network name and password
  // in the environment variables SSID and PSK.
  defineNetwork:
    // eslint-disable-next-line
    'nmcli device wifi connect "$SSID" password "$PSK"',

  // Define a new open wifi network. Expects the network name
  // in the environment variable SSID.
  defineOpenNetwork:
    // eslint-disable-next-line
    'nmcli device wifi connect "$SSID"',

  // Lists configured networks
  listNetworks: 'wpa_cli -iwlan0 list_networks',

  // Broadcast an Eddystone beacon
  broadcastBeacon:
    // eslint-disable-next-line
    'echo almafa',
};
