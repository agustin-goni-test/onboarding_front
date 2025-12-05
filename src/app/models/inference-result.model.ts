export class InferenceResultModel {
    contactName: string | null = null;
    contactRut: string | null = null;
    serialNumber: string | null = null;
    bankName: string | null = null;
    accountType: string | null = null;
    accountNumber: string | null = null;

    reset() {
        this.contactName = null;
        this.contactRut = null;
        this.serialNumber = null;
        this.bankName = null;
        this.accountType = null;
        this.accountNumber = null;
    }
}