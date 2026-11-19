// Sentry tags of the opportunity workflow: the name of the partner whose API key authenticated the request (never the key itself).
// Empty for the TEE site, which calls the API without a key.
export class PartnerMonitorTags {
  static of(partner: string | undefined): { [key: string]: string } {
    return partner ? { partner } : {}
  }
}
