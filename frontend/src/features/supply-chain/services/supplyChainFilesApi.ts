import { filesApi } from '@/features/content/files/services/filesApi';
import type { FileObject, FileUploadProgress } from '@/features/content/files/services/filesApi';

export type SupplyChainFileCategory =
  | 'sbom_export'
  | 'attestation_proof'
  | 'supply_chain_scan_report'
  | 'vendor_compliance'
  | 'vendor_assessment'
  | 'vendor_certificate';

export type SupplyChainAttachableType =
  | 'SupplyChain::Sbom'
  | 'SupplyChain::Attestation'
  | 'SupplyChain::ContainerImage'
  | 'SupplyChain::Vendor';

export interface SupplyChainFileUploadOptions {
  category: SupplyChainFileCategory;
  onProgress?: (progress: FileUploadProgress) => void;
  visibility?: string;
  description?: string;
  metadata?: Record<string, unknown>;
  tags?: string[];
}

// A thin wrapper over core filesApi, which owns the /files endpoint family.
// It only pins the supply-chain attachable types and file categories.
export const supplyChainFilesApi = {
  /**
   * Get files attached to a supply chain entity
   */
  async getEntityFiles(
    attachableType: SupplyChainAttachableType,
    attachableId: string,
    category?: SupplyChainFileCategory
  ): Promise<{ files: FileObject[] }> {
    return filesApi.getFiles({
      attachable_type: attachableType,
      attachable_id: attachableId,
      ...(category && { category })
    });
  },

  /**
   * Upload a file and attach it to a supply chain entity
   */
  async uploadFile(
    attachableType: SupplyChainAttachableType,
    attachableId: string,
    file: File,
    options: SupplyChainFileUploadOptions
  ): Promise<FileObject> {
    return filesApi.uploadFile(file, {
      ...options,
      attachableType,
      attachableId
    });
  },

  /**
   * Delete a file
   */
  async deleteFile(fileId: string, permanent: boolean = false): Promise<void> {
    return filesApi.deleteFile(fileId, permanent);
  },

  /**
   * Download a file
   */
  async downloadFile(fileId: string, filename?: string): Promise<void> {
    return filesApi.downloadFile(fileId, filename);
  },

  /**
   * Get download URL for a file
   */
  async getDownloadUrl(fileId: string): Promise<string> {
    const file = await filesApi.getFile(fileId);
    return file.urls?.download || '';
  },

  // Vendor-specific helpers
  async getVendorDocuments(vendorId: string, category?: SupplyChainFileCategory) {
    return this.getEntityFiles('SupplyChain::Vendor', vendorId, category);
  },

  async uploadVendorDocument(
    vendorId: string,
    file: File,
    category: 'vendor_compliance' | 'vendor_assessment' | 'vendor_certificate',
    options?: Omit<SupplyChainFileUploadOptions, 'category'>
  ) {
    return this.uploadFile('SupplyChain::Vendor', vendorId, file, {
      ...options,
      category
    });
  },

  // SBOM-specific helpers
  async getSbomFiles(sbomId: string) {
    return this.getEntityFiles('SupplyChain::Sbom', sbomId, 'sbom_export');
  },

  async uploadSbomExport(
    sbomId: string,
    file: File,
    options?: Omit<SupplyChainFileUploadOptions, 'category'>
  ) {
    return this.uploadFile('SupplyChain::Sbom', sbomId, file, {
      ...options,
      category: 'sbom_export'
    });
  },

  // Attestation-specific helpers
  async getAttestationFiles(attestationId: string) {
    return this.getEntityFiles('SupplyChain::Attestation', attestationId, 'attestation_proof');
  },

  async uploadAttestationProof(
    attestationId: string,
    file: File,
    options?: Omit<SupplyChainFileUploadOptions, 'category'>
  ) {
    return this.uploadFile('SupplyChain::Attestation', attestationId, file, {
      ...options,
      category: 'attestation_proof'
    });
  },

  // Container Image-specific helpers
  async getContainerImageFiles(imageId: string) {
    return this.getEntityFiles('SupplyChain::ContainerImage', imageId, 'supply_chain_scan_report');
  },

  async uploadScanReport(
    imageId: string,
    file: File,
    options?: Omit<SupplyChainFileUploadOptions, 'category'>
  ) {
    return this.uploadFile('SupplyChain::ContainerImage', imageId, file, {
      ...options,
      category: 'supply_chain_scan_report'
    });
  }
};
