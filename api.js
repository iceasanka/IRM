import axios from 'axios';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from 'react-native';

let _host = '';
let _port = '';
let api, apiStock, apiReturn, apiSupplier, apiPosStock, apiPosCountedStock, apiGrn;
// new system (z_ tables): Return Items list, suppliers, items
let apiReturnList, apiSupplierz, apiItemz;
// new system: stock ledger / adjustments, till sync status, mobile GRN drafts
let apiStockLedger, apiStockAdj, apiSync, apiMobileGrn;

const DEFAULT_HOST = "192.168.1.5";
const DEFAULT_PORT = "";

// Builds a base URL for one API path from the current _host/_port.
// Supports two ways of connecting:
//  - Plain IP + port on the LAN, e.g. host="192.168.1.5" port="5000"
//      -> http://192.168.1.5:5000/api/Items
//  - A full tunnel/domain URL with no port, e.g.
//    host="https://sharp-gras-gourmet-employer.trycloudflare.com" port=""
//      -> https://sharp-gras-gourmet-employer.trycloudflare.com/api/Items
function buildBaseUrl(apiPath) {
  let host = (_host || DEFAULT_HOST).trim().replace(/\/+$/, '');

  // If the saved host already includes a scheme (e.g. pasted tunnel URL),
  // use that scheme and strip it off before recombining below.
  let protocol = 'http';
  const schemeMatch = host.match(/^(https?):\/\/(.*)$/i);
  if (schemeMatch) {
    protocol = schemeMatch[1].toLowerCase();
    host = schemeMatch[2];
  }

  const port = (_port || '').trim();
  const portPart = port ? `:${port}` : '';

  return `${protocol}://${host}${portPart}/api/${apiPath}`;
}

// Call this function at app startup to update _host and _port from AsyncStorage
export async function updateApiHostPortFromStorage() {
  await initApi();
}

export async function initApi() {
  const storedHost = await AsyncStorage.getItem("api_ip");
  const storedPort = await AsyncStorage.getItem("api_port");

  _host = storedHost || DEFAULT_HOST;
  // An empty string is a deliberate "no port" choice (e.g. a tunnel URL) —
  // only fall back to the default port when nothing has ever been saved.
  _port = storedPort !== null ? storedPort : DEFAULT_PORT;

  const itemsUrl = buildBaseUrl('Items');
  api = axios.create({ baseURL: itemsUrl });
  apiStock = axios.create({ baseURL: buildBaseUrl('Stocks') });
  apiReturn = axios.create({ baseURL: buildBaseUrl('Return') });
  apiSupplier = axios.create({ baseURL: buildBaseUrl('Supplier') });
  apiPosStock = axios.create({ baseURL: buildBaseUrl('PosStock') });
  apiPosCountedStock = axios.create({ baseURL: buildBaseUrl('PosCountedStock') });
  apiGrn = axios.create({ baseURL: buildBaseUrl('GrnTemp') });
  apiReturnList = axios.create({ baseURL: buildBaseUrl('ReturnList'), timeout: 20000 });
  apiSupplierz = axios.create({ baseURL: buildBaseUrl('Supplierz'), timeout: 20000 });
  apiItemz = axios.create({ baseURL: buildBaseUrl('Itemz'), timeout: 20000 });
  apiStockLedger = axios.create({ baseURL: buildBaseUrl('StockLedger'), timeout: 20000 });
  apiStockAdj = axios.create({ baseURL: buildBaseUrl('StockAdjustment'), timeout: 20000 });
  apiSync = axios.create({ baseURL: buildBaseUrl('Sync'), timeout: 8000 });
  apiMobileGrn = axios.create({ baseURL: buildBaseUrl('MobileGrn'), timeout: 20000 });

  // The home page shows this URL and whether the server answers, so no popup here any more
  console.log('[api] Final base URL:', itemsUrl);
}

// the server address now in use, e.g. http://192.168.1.5:5000 (home page)
export function apiBaseUrl() {
  return buildBaseUrl('').replace(/\/api\/$/, '');
}



export const apigetItemWithDetailsByBarcode = (barcode) => {
  const url = `/GetItemWithDetailsByBarcode?barcode=${barcode}`;
  return api.get(url);
};

export function apigetItemByDescription(query) {
  const url = `/search?query=${query}`
  //const fullUrl = `${api.defaults.baseURL}${url}`;
 //console.log('apigetItemByDescription fullUrl:', fullUrl);
  return api.get(url);
}

export const getPriceLink = (itemCode) => {
  const url = `/GetPriceLink?itemCode=${itemCode}`;
  return api.get(url);
};

export const addPriceLink = (data) => {
  const url = '/AddPriceLink';
  return api.post(url, data);
};

export const updateItemRetPrice = (itemCode, eRetPrice) => {
  const url = "/UpdateItemRetPrice";
  const data = { itemCode, eRetPrice };
  return api.post(url, data);
};


export function apigetStockByItemCode(_itemcode) {
  return apiStock.get(`/GetStock?itemcode=${_itemcode}`);
}

export const updateStock = (data) => {
  const url = '/UpdateStock';
  return apiStock.post(url, data);
};

export function getAllReturnItemsBySuppCode(suppcode) {
  const url = `/GetItemsBySuppCode?suppcode=${suppcode}`
  return apiReturn.get(url);
}

export function apiAddReturnItem(data) {
  const url = '/AddReturnItem';
  return apiReturn.post(url, data);
}

export function apiUpdateItemById(id, data) {
  const url = `/${id}`;
  return apiReturn.put(url, data);;
}

export function apiProcessReturnItems(data) {
  const url = '/process';
  return apiReturn.post(url, data);;
}

export function apiPrint(data) {
  const url = '/print';
  return apiReturn.post(url, data);;
}

export function apiDeleteItemById(id) {
  const url = `/${id}`;
  return apiReturn.delete(url);;
}

export function apigetSuppByDescription(query) {
  const url = `/SearchSuppliers?query=${query}`
  return apiSupplier.get(url);
}

export function apigetPosStockByItemCode(_itemcode) {
  const url =`/GetPosStock?itemCode=${_itemcode}`;
  return apiPosStock.get(url);
}

export function deleteAllPosCountedStock() {
  const url = '/DeleteAll';
  return apiPosCountedStock.post(url);
}

export function deletePosCountedStockByItemCode(itemCode) {
  const url = `/DeleteByItemCode?itemCode=${itemCode}`;
  return apiPosCountedStock.post(url);
}



export function apiAddGrn(data) {
  
  const url = '/AddGrnTemp';

  //console.log('apiAddGrn', data);
   // const fullUrl = `${apiGrn.defaults.baseURL}${url}`;
  //console.log(fullUrl);

  return apiGrn.post(url, data);;
}

export function apiDeleteGrn(id) {
  const url = `/DeleteGrnTemp/${id}`;
  return apiGrn.delete(url);
}

// ---- Return Items list on the new system (api/ReturnList) - the same list as the back office Return Items page ----

// scanned / typed code -> [{ itemId, barcode, refCode, descrip, costPrice, retailPrice, stockQty, suppId }]
export function rlLookup(code) {
  return apiReturnList.get('/Lookup', { params: { code } });
}

// open rows (Added + Ready) of one supplier (suppId empty = all)
export function rlList(suppId) {
  return apiReturnList.get('', { params: suppId ? { suppId } : {} });
}

// { itemId, suppId, qty, reason, remark } - the same item + supplier still "Added" gets the qty added
export function rlAdd(data) {
  return apiReturnList.post('', { ...data, source: 1 });
}

export function rlUpdate(id, data) {
  return apiReturnList.put(`/${id}`, data);
}

// status 2 = Ready, 1 = back to Added
export function rlSetStatus(ids, status) {
  return apiReturnList.post('/status', { ids, status, userId: 'mobile' });
}

export function rlDelete(ids) {
  return apiReturnList.post('/delete', { ids });
}

// Ready rows of one supplier -> a PRN, taken off stock now (post = true)
export function rlProcess(ids, post = true) {
  return apiReturnList.post('/process', { ids, post, userId: 'mobile', remark: 'Return Items (mobile app)' });
}

export function rlPrint(ids) {
  return apiReturnList.post('/print', { ids });
}

// suppliers by name: [{ suppId, suppCode, suppName }]
export function apiSearchSupplierz(name) {
  return apiSupplierz.get(`/search/${encodeURIComponent(name)}`);
}

// items by description: [{ itemId, barcode, refCode, descrip, ... }]
export function apiSearchItemzByDes(query) {
  return apiItemz.get('/SearchByDes', { params: { query } });
}

// ---- Price links on the new system (api/Itemz) - the same links as the back office Item Entry page ----

// barcode / ref code -> [ItemzWithDetails] (itemId, descrip, retailPrice, costPrice, maxPrice, ...)
export function plSearchByCode(query) {
  return apiItemz.get('/SearchByCode', { params: { query } });
}

// active links, lowest price first: [{ priceLinkId, retailPrice, wholesalePrice, costPrice, remark, cDate }]
export function plGetLinks(itemId) {
  return apiItemz.get(`/PriceLinks/${itemId}`);
}

// { itemId, retailPrice, wholesalePrice?, costPrice?, remark? }
export function plAddLink(data) {
  return apiItemz.post('/AddPriceLink', data);
}

export function plDeleteLink(priceLinkId) {
  return apiItemz.delete(`/PriceLink/${priceLinkId}`);
}

// the item's normal retail price
export function plUpdateRetailPrice(itemId, retailPrice) {
  return apiItemz.post('/UpdateRetailPrice', { itemId, retailPrice });
}

// ---- Stock on the new system (stock ledger) - till bills come in by themselves (about every minute) ----

// { itemId, qty, avgCost, uDate, ... }
export function stBalance(itemId) {
  return apiStockLedger.get(`/Balance/${itemId}`);
}

// movements with running balance: { openingQty, closingQty, rows: [{ txnDate, txnTypeName, docNo, qtyIn, qtyOut, balance }] }
export function stItemCard(itemId, fromDate) {
  return apiStockLedger.get('/ItemCard', { params: { itemId, fromDate } });
}

// [{ reasonId, reasonName }]
export function stReasons() {
  return apiStockAdj.get('/Reasons');
}

// one item: countedQty = set the stock to what was counted, adjQty = + add / - remove. Saved = posted (ADJ no).
// opts: { countedQty, adjQty, reasonId } - one of countedQty / adjQty, the other null
export function stAdjust(itemId, opts) {
  const { countedQty, adjQty, reasonId } = opts;
  return apiStockAdj.post('/Save', {
    reasonId, remark: 'Mobile app', userId: 'mobile',
    lines: [{ itemId, countedQty: countedQty ?? null, adjQty: adjQty ?? null, reasonId }],
  });
}

// tills: [{ terminalCode, terminalName, status, lastSyncAt, isStale }] - also used as "is the server there"
export function syncTerminals() {
  return apiSync.get('/Terminals');
}

// ---- GRN on the new system: the phone fills a suspended GRN of the supplier, the back office commits it ----

// lines of the supplier's open draft, newest first (empty = no draft yet)
export function mgGet(suppId) {
  return apiMobileGrn.get('', { params: { suppId } });
}

// { suppId, itemId, qty, costPrice, sellPrice } -> { grnNo, idx }. Same item + prices -> qty added
export function mgAddLine(data) {
  return apiMobileGrn.post('/line', data);
}

export function mgUpdateLine(idx, data) {
  return apiMobileGrn.put(`/line/${idx}`, data);
}

export function mgDeleteLine(idx) {
  return apiMobileGrn.delete(`/line/${idx}`);
}

//GetGrnTempByGrnReferenceAndStatus
export function apiGetGrnTempByGrnReferenceAndStatus(grnReference, status) {
  const url = `/GetGrnTempByGrnReferenceAndStatus?grnReference=${grnReference}&status=${status}`;
  return apiGrn.get(url);
}





