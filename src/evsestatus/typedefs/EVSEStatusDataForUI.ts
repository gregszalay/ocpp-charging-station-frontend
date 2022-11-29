export type EVSEStatusDataForUI = {
  isEVConnected: number;
  isChargingEnabled: number;
  isCharging: number;
  isError: number;
  EnergyActiveNet_kwh_float: number;
  PowerActiveImport_kw_float: number;
};
