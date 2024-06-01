import crypto from 'crypto';

const { MerchantID, HASHKEY, HASHIV, Version, NotifyUrl, ReturnUrl } = process.env;
const RespondType = 'JSON';

interface orderItem {
    Email: string;
    Amt: number; //總金額
    ItemDesc: string; //商品描述
    TimeStamp: number;
    MerchantOrderNo: string;
}

// 字串組合
export function genDataChain(order: orderItem): string {
    return `MerchantID=${MerchantID}&TimeStamp=${
        order.TimeStamp
    }&Version=${Version}&RespondType=${RespondType}&MerchantOrderNo=${
        order.MerchantOrderNo
    }&Amt=${order.Amt}&NotifyURL=${encodeURIComponent(
        NotifyUrl
    )}&ReturnURL=${encodeURIComponent(ReturnUrl)}&ItemDesc=${encodeURIComponent(
        order.ItemDesc
    )}&Email=${encodeURIComponent(order.Email)}`;
}

// 對應文件 P17：使用 aes 加密
// $edata1=bin2hex(openssl_encrypt($data1, "AES-256-CBC", $key, OPENSSL_RAW_DATA, $iv));
export function createSesEncrypt(TradeInfo: orderItem) {
    const encrypt = crypto.createCipheriv('aes-256-cbc', HASHKEY, HASHIV);
    const enc = encrypt.update(genDataChain(TradeInfo), 'utf8', 'hex');
    return enc + encrypt.final('hex');
}

// 對應文件 P18：使用 sha256 加密
// $hashs="HashKey=".$key."&".$edata1."&HashIV=".$iv;
export function createShaEncrypt(aesEncrypt: string) {
    const sha = crypto.createHash('sha256');
    const plainText = `HashKey=${HASHKEY}&${aesEncrypt}&HashIV=${HASHIV}`;
    return sha.update(plainText).digest('hex').toUpperCase();
}

// 對應文件 21, 22 頁：將 aes 解密
export function createSesDecrypt(TradeInfo: string) {
    const decrypt = crypto.createDecipheriv('aes256', HASHKEY, HASHIV);
    decrypt.setAutoPadding(false);
    const text = decrypt.update(TradeInfo, 'hex', 'utf8');
    const plainText = text + decrypt.final('utf8');
    // eslint-disable-next-line no-control-regex
    const result = plainText.replace(/[\x00-\x20]+/g, '');
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return JSON.parse(result);
}
