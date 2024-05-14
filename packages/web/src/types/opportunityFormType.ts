export interface opportunityFormType {
  [key: string]:
    | { required: boolean; value: string | undefined; label: string | undefined; hint: string | undefined }
    | { required: boolean; value: boolean; label: string | undefined; hint: string | undefined }
  name: { required: true; value: string | undefined; label: string | undefined; hint: string | undefined }
  surname: { required: true; value: string | undefined; label: string | undefined; hint: string | undefined }
  tel: { required: true; value: string | undefined; label: string | undefined; hint: string | undefined }
  email: { required: true; value: string | undefined; label: string | undefined; hint: string | undefined }
  siret: { required: true; value: string | undefined; label: string | undefined; hint: string | undefined }
  needs: { required: true; value: string | undefined; label: string | undefined; hint: string | undefined }
  cgu: { required: true; value: boolean; label: string | undefined; hint: string | undefined }
  linkToProgramPage: { required: true; value: string; label: string | undefined; hint: string | undefined }
}
