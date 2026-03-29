import QRCode from "qrcode";

const generateQR = async (data) => {
    try {
        const qr = await QRCode.toDataURL(data);
        return qr;
    } catch (error) {
        throw new Error("QR generation failed");
    }
};

export default generateQR;