declare module "@paystack/inline-js" {
  export default class PaystackPop {
    resumeTransaction(
      accessCode: string,
      options: {
        onSuccess?: () => void;
        onCancel?: () => void;
      },
    ): void;
  }
}
