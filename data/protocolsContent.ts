import { ProtocolDetail } from './protocolsContent/types';
import { BGP_PROTOCOL } from './protocolsContent/bgp';
import { EVPN_PROTOCOL } from './protocolsContent/evpn';
import { LINUX_PROTOCOL } from './protocolsContent/linux';
import { MACSEC_PROTOCOL } from './protocolsContent/macsec';
import { MLAG_PROTOCOL } from './protocolsContent/mlag';
import { NVME_OF_PROTOCOL } from './protocolsContent/nvmeof';
import { MULTICAST_PROTOCOL } from './protocolsContent/multicast';
import { QOS_PROTOCOL } from './protocolsContent/qos';
import { VXLAN_PROTOCOL } from './protocolsContent/vxlan';

export * from './protocolsContent/types';

export const PROTOCOL_CONTENT: Record<string, ProtocolDetail> = {
  VXLAN: VXLAN_PROTOCOL,
  EVPN: EVPN_PROTOCOL,
  MLAG: MLAG_PROTOCOL,
  "NVMe-oF": NVME_OF_PROTOCOL,
  MULTICAST: MULTICAST_PROTOCOL,
  LINUX: LINUX_PROTOCOL,
  BGP: BGP_PROTOCOL,
  QOS: QOS_PROTOCOL,
  MACSEC: MACSEC_PROTOCOL
};
