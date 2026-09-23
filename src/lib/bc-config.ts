// Konstanten fuer die Business-Central-Schnittstelle (RLP). Tenant-ID und
// Company-GUID sind aus den Beispiel-Responses (@odata.context) bestaetigt;
// die Company-GUID ist laut BC-Entwicklung reine Formsache (mandantenuebergreifende
// Tabellen), wird aber trotzdem als Pflichtsegment in der URL benoetigt.
const TENANT_ID = "80690875-b516-45ad-ae52-ec1368023c4e";
const COMPANY_ID = "dba7ad6b-ce51-f011-be59-0022485d4e72";

export const BC_TOKEN_URL = `https://login.microsoftonline.com/${TENANT_ID}/oauth2/v2.0/token`;
export const BC_SCOPE = "https://api.businesscentral.dynamics.com/.default";
export const BC_RLP_BASE_URL = `https://api.businesscentral.dynamics.com/v2.0/${TENANT_ID}/Production/api/vtg/rlp/v1.0/companies(${COMPANY_ID})`;
